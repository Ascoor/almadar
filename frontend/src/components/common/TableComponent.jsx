import React, { useState, useMemo, useContext } from 'react';
import { Edit, Eye, Trash, ChevronUp, ChevronDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import API_CONFIG from '../../config/config';
import { AuthContext } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

const EXPORT_LABELS = {
  excel: { en: '📁 Excel', ar: '📁 إكسل' },
  csv: { en: '🧾 CSV', ar: '🧾 CSV' }
};

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
}) {
  
  const { hasPermission } = useContext(AuthContext);
  const { lang, translations } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const rowsPerPage = 10;

  // Infer if a column is numeric by sampling first non-null value
  const isNumericColumn = (key) => {
    const sample = data.find((d) => d[key] !== undefined && d[key] !== null);
    if (!sample) return false;
    const v = sample[key];
    return typeof v === 'number' || (!isNaN(Number(v)) && v !== '' && v !== null);
  };

  // Parse and test numeric filter expressions: 
  // supports ">=10", "< 25", "= 5", "10-20" (range), or plain number (equals)
  const matchNumeric = (val, expr) => {
    const value = Number(val);
    if (isNaN(value)) return false;
    const s = String(expr).trim().replace(/\s+/g, '');
    if (!s) return true;
    // Range pattern a-b
    const range = s.match(/^(\-?\d+(?:\.\d+)?)[-–](\-?\d+(?:\.\d+)?)$/);
    if (range) {
      const a = Number(range[1]);
      const b = Number(range[2]);
      const [minV, maxV] = a <= b ? [a, b] : [b, a];
      return value >= minV && value <= maxV;
    }
    const opMatch = s.match(/^(>=|<=|>|<|=)?(\-?\d+(?:\.\d+)?)$/);
    if (opMatch) {
      const op = opMatch[1] || '=';
      const num = Number(opMatch[2]);
      switch (op) {
        case '>': return value > num;
        case '<': return value < num;
        case '>=': return value >= num;
        case '<=': return value <= num;
        case '=': default: return value === num;
      }
    }
    return false;
  };

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
    const tokens = searchQuery.trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return data;

    // Each token must match at least one column.
    return data.filter((item) => tokens.every((tk) => {
      // numeric token detection
      const numericExpr = /^(>=|<=|>|<|=)?\s*\-?\d+(?:\.\d+)?(?:\s*[-–]\s*\-?\d+(?:\.\d+)?)?$/;
      const isNumericTk = numericExpr.test(tk.replace(/\s+/g, ''));

      if (isNumericTk) {
        // match against any numeric column
        return headers.some((h) => isNumericColumn(h.key) && matchNumeric(item[h.key], tk));
      }
      // text token: match against any column string
      const low = tk.toLowerCase();
      return headers.some((h) => String(item[h.key] ?? '').toLowerCase().includes(low));
    }));
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
            className="rounded-2xl px-3 py-1 text-sm bg-primary text-[color:var(--primary-foreground)] hover:shadow-glow transition"
          >
            {EXPORT_LABELS.excel[lang]}
          </button>
          <button
            onClick={() => exportTo('csv')}
            className="rounded-2xl px-3 py-1 text-sm bg-secondary text-fg hover:shadow-glow transition"
          >
            {EXPORT_LABELS.csv[lang]}
          </button>
          <input
            type="text"
            placeholder={`🔍 ${translations.search_placeholder}`}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none bg-bg text-fg"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm border rounded border-border">
          <thead className="bg-secondary/80 text-fg">
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
              <tr
                key={row.id}
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
                            className="underline text-accent hover:text-"
                          >
                            عرض المرفق
                          </a>
                        ) : (
                          <span className="text-muted text-xs">
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
                        onClick={(e) => {
                          e.stopPropagation();
                          onView(row);
                        }}
                        className="text-accent hover:text-"
                      >
                        <Eye size={16} />
                      </button>
                    )}
                    {onEdit && can('edit') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(row);
                        }}
                        className="text-secondary hover:text-"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                    {onDelete && can('delete') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(row);
                        }}
                        className="text-destructive hover:text-destructive/90"
                      >
                        <Trash size={16} />
                      </button>
                    )}
                  </td>
              </tr>
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
                  : 'bg-bg text-primary hover:bg-primary/10'
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
