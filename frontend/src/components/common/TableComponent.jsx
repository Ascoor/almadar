import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Edit, Eye, Trash, ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '@/components/auth/AuthContext';

const AnimatedRow = ({
  row,
  rowIndex,
  headers,
  customRenderers,
  onEdit,
  onDelete,
  onView,
  onRowClick,
  moduleName, // اسم الوحدة مثل "contracts"
}) => {
  const { hasPermission } = useContext(AuthContext);

  const can = (action) => hasPermission(`${action} ${moduleName}`);

  return (
   <motion.tr
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
    onClick={() => onRowClick?.(row)}
>
      {onView && can('view') && (
        <td className="p-2 text-center">
          <button onClick={(e) => { e.stopPropagation(); onView.handler(row); }} className="text-primary">
            <Eye />
          </button>
        </td>
      )}

      {headers.map((header) => {
        let content;

        if (header.key === 'attachment') {
          content = row.attachment ? (
            <a
              href={`${import.meta.env.VITE_API_BASE_URL}/storage/${row.attachment}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline"
            >
              عرض
            </a>
          ) : (
            <span className="text-muted-foreground">لا يوجد</span>
          );
        } else if (customRenderers?.[header.key]) {
          content = customRenderers[header.key](row);
        } else {
          content = row[header.key] ?? '—';
        }

        return (
          <td key={`${rowIndex}-${header.key}`} className="p-2 text-center text-sm text-foreground">
            {content}
          </td>
        );
      })}

      {onEdit && can('edit') && (
        <td className="p-2 text-center">
          <button onClick={(e) => { e.stopPropagation(); onEdit(row); }} className="text-purple-600 hover:text-purple-800">
            <Edit />
          </button>
        </td>
      )}

      {onDelete && can('delete') && (
        <td className="p-2 text-center">
          <button onClick={(e) => { e.stopPropagation(); onDelete(row); }} className="text-red-600 hover:text-red-800">
            <Trash />
          </button>
        </td>
      )}
    </motion.tr>
  );
};

export default function TableComponent({
  data,
  headers,
  customRenderers,
  onView,
  onEdit,
  onDelete,
  renderAddButton,
  onRowClick,
  moduleName,
  expandedRowRenderer,
}) {
  const { hasPermission } = useContext(AuthContext);

  // Check permissions dynamically for action and module name
  const can = (action) => {
    if (!moduleName || typeof moduleName !== 'string') return false;

    const possibilities = [];

    // Check for different module variations like 'litigation-from-actions' -> ['litigation-from-actions', 'litigation-from', 'litigation']
    const parts = moduleName.split("-");

    if (parts.length >= 3) {
      possibilities.push(parts.join("-")); // Full module name like 'litigation-from-actions'
      possibilities.push(parts.slice(0, 2).join("-")); // Parent module name like 'litigation-from'
      possibilities.push(parts[0]); // General category name like 'litigation'
    } else if (parts.length === 2) {
      possibilities.push(moduleName); // For two-part names like 'investigation-actions'
      possibilities.push(parts[0]); // General category name like 'investigation'
    } else {
      possibilities.push(moduleName); // General case for single words like 'users'
    }

    // Check if the user has permission for any of the possibilities
    return possibilities.some((mod) => hasPermission(`${action} ${mod}`));
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [sortKey, setSortKey] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
const [currentPage, setCurrentPage] = useState(1);
const rowsPerPage = 10;

  useEffect(() => {
    const keywords = searchQuery.trim().toLowerCase().split(/\s+/);

    const filtered = Array.isArray(data)
      ? data.filter(item =>
          keywords.every(kw =>
            headers.some(h => {
              if (h.key === 'actions') return false;

              let cellValue;
              try {
                if (customRenderers?.[h.key]) {
                  const rendered = customRenderers[h.key](item);
                  if (typeof rendered === 'string') {
                    cellValue = rendered;
                  } else if (typeof rendered?.props?.children === 'string') {
                    cellValue = rendered.props.children;
                  } else {
                    cellValue = JSON.stringify(rendered);
                  }
                } else {
                  cellValue = item[h.key];
                }
              } catch {
                cellValue = item[h.key]; // Fallback
              }

              return String(cellValue || '').toLowerCase().includes(kw);
            })
          )
        )
      : [];

    setFilteredData(filtered);
  }, [searchQuery, data, headers, customRenderers]);

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

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortDirection((dir) => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };
const totalPages = Math.ceil(sortedData.length / rowsPerPage);

const paginatedData = useMemo(() => {
  const start = (currentPage - 1) * rowsPerPage;
  return sortedData.slice(start, start + rowsPerPage);
}, [sortedData, currentPage]);

  return (
    <motion.section
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: 'easeOut' }}
  className="bg-card p-6 rounded-xl shadow-lg border border-border"
>  <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
        {renderAddButton?.render && can('create') && (
          <div>{renderAddButton.render()}</div>
        )}
        <input
          type="text"
          placeholder="ابحث..."
          className="px-3 py-2 border rounded w-full md:w-64"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
   <table className="min-w-full divide-y divide-border text-xs sm:text-sm text-center">
   <thead className="bg-muted text-muted-foreground">
      <tr>
        {onView && can('view') && <th className="p-3">عرض</th>}
        {headers.map((h) => (
          <th
            key={h.key}
            onClick={() => handleSort(h.key)}
            className="p-3 cursor-pointer select-none whitespace-nowrap"
          >
            <div className="flex items-center justify-center gap-1">
              {h.text}
              {sortKey === h.key &&
                (sortDirection === 'asc' ? (
                  <ArrowUp size={14} />
                ) : (
                  <ArrowDown size={14} />
                ))}
            </div>
          </th>
        ))}
        {onEdit && can('edit') && <th className="p-3">تعديل</th>}
        {onDelete && can('delete') && <th className="p-3">حذف</th>}
      </tr>
    </thead>
    <motion.tbody
  key={currentPage}
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{
    duration: 0.5,
    ease: 'easeOut',
    delayChildren: 0.15,
    staggerChildren: 0.04,
  }}
>

     {paginatedData.map((row, idx) => (
    <React.Fragment key={row.id}>
      <AnimatedRow
        row={row}
        rowIndex={idx}
        headers={headers}
        customRenderers={customRenderers}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        onRowClick={onRowClick}
        moduleName={moduleName}
      />
      {expandedRowRenderer?.(row)}
    </React.Fragment>
  ))}


</motion.tbody>
        </table>
        {totalPages > 1 && (
  <div className="flex justify-center mt-4 gap-2">
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        onClick={() => setCurrentPage(page)}
        className={`px-3 py-1 border rounded ${
          page === currentPage ? 'bg-primary text-white' : 'hover:bg-muted'
        }`}
      >
        {page}
      </button>
    ))}
  </div>
)}
 
</motion.section>
  );
}
