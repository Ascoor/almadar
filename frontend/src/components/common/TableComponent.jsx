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
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={() => onRowClick?.(row)}
      className="cursor-pointer border-b border-muted hover:bg-muted/50 transition"
    >
      {onView && can('view') && (
        <td className="p-2 text-center">
          <button onClick={e => { e.stopPropagation(); onView.handler(row); }} className="text-primary">
            <Eye />
          </button>
        </td>
      )}

      {headers.map((header) => (
        <td key={`${rowIndex}-${header.key}`} className="p-2 text-center text-sm">
          {customRenderers?.[header.key]
            ? customRenderers[header.key](row)
            : row[header.key] ?? '—'}
        </td>
      ))}

      {onEdit && can('edit') && (
        <td className="p-2 text-center">
          <button onClick={e => { e.stopPropagation(); onEdit.handler(row); }} className="text-purple-600 hover:text-purple-800">
            <Edit />
          </button>
        </td>
      )}

      {onDelete && can('delete') && (
        <td className="p-2 text-center">
          <button onClick={e => { e.stopPropagation(); onDelete.handler(row); }} className="text-red-600 hover:text-red-800">
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
  onView,        // { action: 'view', handler: fn }
  onEdit,        // { action: 'edit', handler: fn }
  onDelete,      // { action: 'delete', handler: fn }
  renderAddButton, // { action: 'create', render: fn }
  onRowClick,
  moduleName, // 💡 Required: "contracts", "investigations", ...
}) {
  const { hasPermission } = useContext(AuthContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [sortKey, setSortKey] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const can = (action) => hasPermission(`${action} ${moduleName}`);

  useEffect(() => {
    const keywords = searchQuery.trim().toLowerCase().split(/\s+/);
    setFilteredData(
      data.filter(item =>
        keywords.every(kw =>
          headers.some(h =>
            h.key !== 'actions' &&
            String(item[h.key] || '')
              .toLowerCase()
              .includes(kw)
          )
        )
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

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortDirection(dir => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  return (
    <section className="bg-card p-6 rounded-xl shadow-lg border border-border">
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
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

      <div className="overflow-x-auto">
        <table className="w-full text-center text-sm border-collapse">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              {onView && can('view') && <th className="p-2">عرض</th>}
              {headers.map(h => (
                <th
                  key={h.key}
                  className="p-2 cursor-pointer select-none"
                  onClick={() => handleSort(h.key)}
                >
                  {h.text}{' '}
                  {sortKey === h.key &&
                    (sortDirection === 'asc' ? <ArrowUp size={14}/> : <ArrowDown size={14}/>)}
                </th>
              ))}
              {onEdit && can('edit') && <th className="p-2">تعديل</th>}
              {onDelete && can('delete') && <th className="p-2">حذف</th>}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, idx) => (
              <AnimatedRow
                key={row.id}
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
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
