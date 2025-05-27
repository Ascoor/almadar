
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Edit, Eye, Trash, ArrowUp, ArrowDown } from 'lucide-react';
import * as XLSX from 'xlsx';
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

  const can = (action) => hasPermission(`${action} ${moduleName}`);

  const filteredData = useMemo(() => {
    const keywords = searchQuery.toLowerCase().split(/\s+/);
    return data.filter(item =>
      keywords.every(kw =>
        headers.some(h => {
          const val = item[h.key] ?? '';
          return String(val).toLowerCase().includes(kw);
        })
      )
    );
  }, [searchQuery, data, headers]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey] || '';
      const bVal = b[sortKey] || '';
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
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const exportToExcel = () => {
    const headersRow = headers.map(h => h.text);
    const rows = (selectedIds.length ? data.filter(d => selectedIds.includes(d.id)) : filteredData)
      .map(row => headers.map(h => row[h.key] ?? ''));
    const sheet = XLSX.utils.aoa_to_sheet([headersRow, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, 'Export');
    XLSX.writeFile(workbook, 'export.xlsx');
  };

  return (
    <div className="p-4 border rounded shadow-sm bg-white dark:bg-gray-900">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="ابحث..."
          className="border p-2 rounded"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="space-x-2">
          <button onClick={exportToExcel} className="bg-green-600 text-white px-3 py-1 rounded">تصدير</button>
          {renderAddButton && can('create') && renderAddButton()}
        </div>
      </div>

      <table className="w-full text-sm text-center border">
        <thead className="bg-gray-100">
          <tr>
            <th></th>
            {headers.map(h => (
              <th key={h.key} onClick={() => {
                if (sortKey === h.key) setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                else setSortKey(h.key);
              }} className="cursor-pointer">
                {h.text}
                {sortKey === h.key && (sortDirection === 'asc' ? ' 🔼' : ' 🔽')}
              </th>
            ))}
            {(onEdit || onDelete || onView) && <th>إجراءات</th>}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, index) => (
            <React.Fragment key={row.id}>
              <tr className="hover:bg-gray-100">
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(row.id)}
                    onChange={() => toggleSelectRow(row.id)}
                  />
                </td>
                {headers.map(h => (
                  <td key={h.key}>{customRenderers[h.key]?.(row) ?? row[h.key] ?? '—'}</td>
                ))}
                <td className="space-x-1">
                  {onView && <button onClick={() => onView(row)} className="text-blue-600"><Eye size={14} /></button>}
                  {onEdit && <button onClick={() => onEdit(row)} className="text-purple-600"><Edit size={14} /></button>}
                  {onDelete && <button onClick={() => onDelete(row)} className="text-red-600"><Trash size={14} /></button>}
                </td>
              </tr>
              {expandedRowRenderer?.(row)}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: Math.ceil(filteredData.length / rowsPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-2 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
