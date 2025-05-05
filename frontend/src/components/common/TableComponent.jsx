import React, { useState, useEffect, useMemo } from 'react';
import { MdEdit, MdVisibility } from 'react-icons/md';
import { FaTrashAlt, FaSortUp, FaSortDown } from 'react-icons/fa';
import { motion } from 'framer-motion';
import API_CONFIG from '../../config/config';

const AnimatedRow = ({
  row,
  rowIndex,
  onEdit,
  onDelete,
  onView,
  headers,
  customRenderers,
  onRowClick,
}) => {
  return (
    <motion.tr
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={() => onRowClick?.(row)}
      className="cursor-pointer border-b border-muted transition-all hover:bg-muted dark:hover:bg-muted/20"
    >
      {onView && (
        <td className="p-2 text-center">
          <button onClick={() => onView(row)} className="text-primary">
            <MdVisibility />
          </button>
        </td>
      )}
      {headers.map((header) => (
        <td key={`${rowIndex}-${header.key}`} className="p-2 text-center text-sm text-foreground">
          {header.key === 'attachment' ? (
            row.attachment ? (
              <a
                href={`${API_CONFIG.baseURL}/storage/${row.attachment}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 underline"
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
      <td className="p-2 text-center">
        <button onClick={() => onEdit(row)} className="text-purple-600 hover:text-purple-700">
          <MdEdit />
        </button>
      </td>
      <td className="p-2 text-center">
        <button onClick={() => onDelete(row)} className="text-red-600 hover:text-red-700">
          <FaTrashAlt />
        </button>
      </td>
    </motion.tr>
  );
};

const TableComponent = ({
  data,
  headers,
  customRenderers,
  onDelete,
  onEdit,
  onView,
  renderAddButton,
  onRowClick,
  expandedRowRenderer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [sortKey, setSortKey] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    const keywords = searchQuery.trim().toLowerCase().split(/\s+/);
    const filtered = data.filter((item) =>
      keywords.every((kw) =>
        headers.some(
          (h) =>
            h.key !== 'actions' &&
            item[h.key]?.toString().toLowerCase().includes(kw),
        ),
      ),
    );
    setFilteredData(filtered);
  }, [searchQuery, data, headers]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey] || '';
      const valB = b[sortKey] || '';
      return sortDirection === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });
  }, [filteredData, sortKey, sortDirection]);

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  return (
    <section className="bg-card text-card-foreground p-6 rounded-xl shadow-lg border border-border">
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
        {renderAddButton && <div>{renderAddButton()}</div>}
        <input
          type="text"
          className="border border-input rounded px-3 py-2 bg-background text-foreground placeholder-muted-foreground w-full md:w-64"
          placeholder="ابحث..."
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm text-center">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              {onView && <th className="p-2">عرض</th>}
              {headers.map((header) => (
                <th
                  key={header.key}
                  className="p-2 cursor-pointer select-none"
                  onClick={() => handleSort(header.key)}
                >
                  {header.text}{' '}
                  {sortKey === header.key &&
                    (sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />)}
                </th>
              ))}
              <th className="p-2">تعديل</th>
              <th className="p-2">حذف</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <React.Fragment key={row.id}>
                <AnimatedRow
                  row={row}
                  rowIndex={index}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                  headers={headers}
                  customRenderers={customRenderers}
                  onRowClick={onRowClick}
                />
                {expandedRowRenderer && expandedRowRenderer(row)}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TableComponent;
