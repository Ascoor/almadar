import React, { useState, useMemo, useContext } from 'react';
import { Edit, Eye, Trash, ChevronUp, ChevronDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import API_CONFIG from '../../config/config';
import { AuthContext } from '@/components/auth/AuthContext';

export default function TableComponent({
  data = [],
  headers = [],
  customRenderers = {},
  moduleName = '',
  onEdit,
  onDelete,
  onView,
  renderAddButton,
  onRowClick,
  expandedRowRenderer,
}) {
  const { hasPermission } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const rowsPerPage = 10;

  const can = (action) => {
    if (!moduleName || typeof moduleName !== 'string') return false;
    const possibilities = [];
    const parts = moduleName.split('-');
    if (parts.length >= 3) {
      possibilities.push(parts.join('-'));
      possibilities.push(parts.slice(0, 2).join('-'));
      possibilities.push(parts[0]);
    } else if (parts.length === 2) {
      possibilities.push(moduleName);
      possibilities.push(parts[0]);
    } else {
      possibilities.push(moduleName);
    }
    return possibilities.some((mod) => hasPermission(`${action} ${mod}`));
  };

  const filteredData = useMemo(() => {
    const keywords = searchQuery.toLowerCase().split(/\s+/);
    return data.filter((item) =>
      keywords.every((kw) =>
        headers.some((h) =>
          String(item[h.key] ?? '')
            .toLowerCase()
            .includes(kw),
        ),
      ),
    );
  }, [searchQuery, data, headers]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey] ?? '';
      const bVal = b[sortKey] ?? '';
      return sortDirection === 'asc'
        ? String(aVal).localeCompare(bVal)
        : String(bVal).localeCompare(aVal);
    });
  }, [filteredData, sortKey, sortDirection]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage]);

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const exportTo = (type = 'xlsx') => {
    const selectedRows =
      selectedIds.length > 0
        ? data.filter((row) => selectedIds.includes(row.id))
        : filteredData;

    const headerRow = headers.map((h) => h.text);
    const rows = selectedRows.map((row) =>
      headers.map((h) => row[h.key] ?? ''),
    );

    const sheet = XLSX.utils.aoa_to_sheet([headerRow, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, 'Export');

    if (type === 'csv') {
      XLSX.writeFile(wb, 'export.csv', { bookType: 'csv' });
    } else {
      XLSX.writeFile(wb, 'export.xlsx');
    }
  };

  return (
    <div className="p-4 rounded-xl shadow-lg border border-border bg-card transition-all">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between gap-3 mb-4 items-center">
        {renderAddButton?.render && can('create') && renderAddButton.render()}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => exportTo('xlsx')}
            className="px-3 py-1 text-sm rounded bg-primary text-primary-foreground hover:bg-primary-hover"
          >
            📁 Excel
          </button>
          <button
            onClick={() => exportTo('csv')}
            className="px-3 py-1 text-sm rounded bg-secondary text-secondary-foreground hover:bg-secondary-hover"
          >
            🧾 CSV
          </button>
          <input
            type="text"
            placeholder="🔍 ابحث..."
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none bg-background text-foreground"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm border rounded border-border">
          <thead className="bg-secondary/80 text-foreground">
            <tr>
              <th className="p-3"></th>
              {headers.map((h) => (
                <th
                  key={h.key}
                  onClick={() => {
                    if (sortKey === h.key) {
                      setSortDirection((prev) =>
                        prev === 'asc' ? 'desc' : 'asc',
                      );
                    } else {
                      setSortKey(h.key);
                      setSortDirection('asc');
                    }
                  }}
                  className="p-3 cursor-pointer select-none text-center"
                >
                  <div className="flex items-center justify-center gap-1">
                    {h.text}
                    {sortKey === h.key &&
                      (sortDirection === 'asc' ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      ))}
                  </div>
                </th>
              ))}
              {(onView && can('view')) ||
              (onEdit && can('edit')) ||
              (onDelete && can('delete')) ? (
                <th className="p-3">إجراءات</th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData.map((row) => (
              <React.Fragment key={row.id}>
                <tr
                  className="transition cursor-pointer hover:bg-secondary/30"
                  onClick={() => onRowClick?.(row)}
                >
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id)}
                      onChange={() => toggleSelectRow(row.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  {headers.map((h) => (
                    <td key={h.key} className="p-2 text-center">
                      {h.key === 'attachment' ? (
                        row.attachment ? (
                          <a
                            href={`${API_CONFIG.baseURL}/storage/${row.attachment}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-accent hover:text-accent-hover"
                          >
                            عرض المرفق
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            لا يوجد
                          </span>
                        )
                      ) : (
                        (customRenderers[h.key]?.(row) ?? row[h.key] ?? '—')
                      )}
                    </td>
                  ))}
                  <td className="p-2 space-x-1 text-center">
                    {onView && can('view') && (
                      <button
                        onClick={() => onView(row)}
                        className="text-accent hover:text-accent-hover"
                      >
                        <Eye size={16} />
                      </button>
                    )}
                    {onEdit && can('edit') && (
                      <button
                        onClick={() => onEdit(row)}
                        className="text-secondary hover:text-secondary-hover"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                    {onDelete && can('delete') && (
                      <button
                        onClick={() => onDelete(row)}
                        className="text-destructive hover:text-destructive/90"
                      >
                        <Trash size={16} />
                      </button>
                    )}
                  </td>
                </tr>
                {expandedRowRenderer?.(row)}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from(
          { length: Math.ceil(filteredData.length / rowsPerPage) },
          (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 text-sm rounded font-bold transition-all duration-200 ${
                currentPage === i + 1
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-primary hover:bg-primary/10'
              }`}
            >
              {i + 1}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
