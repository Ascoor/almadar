import React, { useState, useEffect, useMemo } from 'react';
import { MdEdit, MdVisibility } from 'react-icons/md';
import { FaTrashAlt, FaSortUp, FaSortDown } from 'react-icons/fa';
import { useSpring, animated } from '@react-spring/web';
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
  const [isHovered, setIsHovered] = useState(false);
  const springProps = useSpring({
    scale: isHovered ? 1.01 : 1,
    config: { duration: 200 },
  });

  const handleClick = () => {
    if (onRowClick) onRowClick(row);
  };

  return (
    <>
      <animated.tr
        style={{
          ...springProps,
          transform: springProps.scale.to((s) => `scale(${s})`),
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        className={`cursor-pointer border-b dark:border-gray-700 transition-all duration-200 ${
          isHovered ? 'bg-gray-100 dark:bg-gray-700' : ''
        }`}
      >
        {onView && (
          <td className="p-2 text-center">
            <button onClick={() => onView(row)}>
              <MdVisibility />
            </button>
          </td>
        )}
        {headers.map((header) => (
          <td key={`${rowIndex}-${header.key}`} className="p-2 text-center">
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
                <span className="text-gray-400">لا يوجد</span>
              )
            ) : customRenderers?.[header.key] ? (
              customRenderers[header.key](row)
            ) : (
              row[header.key] ?? '—'
            )}
          </td>
        ))}
        <td className="p-2 text-center">
          <button onClick={() => onEdit(row)} className="text-violet-600">
            <MdEdit />
          </button>
        </td>
        <td className="p-2 text-center">
          <button onClick={() => onDelete(row)} className="text-red-600">
            <FaTrashAlt />
          </button>
        </td>
      </animated.tr>
    </>
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
    <section className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md">
      <div className="flex flex-col md:flex-row justify-between mb-4">
        {renderAddButton && <div>{renderAddButton()}</div>}
        <input
          type="text"
          className="mt-2 md:mt-0 border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
          placeholder="ابحث..."
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm text-center">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white">
            <tr>
              {onView && <th className="p-2">عرض</th>}
              {headers.map((header) => (
                <th
                  key={header.key}
                  className="p-2 cursor-pointer"
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
  