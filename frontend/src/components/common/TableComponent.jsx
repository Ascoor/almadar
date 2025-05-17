// src/components/common/TableComponent.jsx
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Edit, Eye, Trash, ArrowUp, ArrowDown } from 'lucide-react'; 
import { motion } from 'framer-motion';
import API_CONFIG from '../../config/config';
import { AuthContext } from '@/components/auth//AuthContext';

const AnimatedRow = ({
  row,
  rowIndex,
  headers,
  customRenderers,
  onEdit,
  onDelete,
  onView,
  onRowClick,
}) => {
  const { hasPermission } = useContext(AuthContext);

  return (
    <motion.tr
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={() => onRowClick?.(row)}
      className="cursor-pointer border-b border-muted hover:bg-muted/50 transition"
    >
      {onView && hasPermission(onView.permission) && (
        <td className="p-2 text-center">
          <button onClick={e => { e.stopPropagation(); onView.handler(row); }} className="text-primary">
            <Eye />
          </button>
        </td>
      )}

 {headers.map((header) => (
  <td key={`${rowIndex}-${header.key}`} className="p-2 text-center text-sm">
    {header.key === 'attachment' ? (
      row.attachment ? (
        <a
          href={`${api}/${row.attachment}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-blue-600"
        >
          عرض
        </a>
      ) : (
        <span className="text-muted-foreground">لا يوجد</span>
      )
    ) : customRenderers?.[header.key] ? (
      customRenderers[header.key](row)
    ) : (
      row[header.key] ?? '—'
    )}
  </td>
))}

      {onEdit && hasPermission(onEdit.permission) && (
        <td className="p-2 text-center">
          <button onClick={e => { e.stopPropagation(); onEdit.handler(row); }} className="text-purple-600 hover:text-purple-800">
            <Edit />
          </button>
        </td>
      )}

      {onDelete && hasPermission(onDelete.permission) && (
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
  onView,        // { permission: 'view X', handler: fn }
  onEdit,        // { permission: 'edit X', handler: fn }
  onDelete,      // { permission: 'delete X', handler: fn }
  renderAddButton, // fn or null
  onRowClick,
}) {
  const { hasPermission } = useContext(AuthContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [sortKey, setSortKey] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  // فلترة
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

  // ترتيب
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
        {renderAddButton && hasPermission(renderAddButton.permission) && (
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
              {onView && hasPermission(onView.permission) && <th className="p-2">عرض</th>}
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
              {onEdit && hasPermission(onEdit.permission) && <th className="p-2">تعديل</th>}
              {onDelete && hasPermission(onDelete.permission) && <th className="p-2">حذف</th>}
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
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
