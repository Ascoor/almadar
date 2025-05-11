import React from "react";
import { Trash2 } from "lucide-react";

const VariableListCard = ({ title, variables, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-4 w-full max-w-md transition hover:shadow-2xl border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold text-navy dark:text-yellow-300 mb-3">{title}</h3>
      <table className="w-full text-sm text-right text-gray-700 dark:text-gray-200">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800 text-xs uppercase text-gray-600 dark:text-gray-300">
            <th className="px-2 py-2 border-b">المتغير</th>
            <th className="px-2 py-2 border-b">الإجراء</th>
          </tr>
        </thead>
        <tbody>
          {variables.map((item, idx) => (
            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              <td className="px-2 py-2 border-b border-gray-100 dark:border-gray-700">{item.label}</td>
              <td className="px-2 py-2 border-b border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => onDelete(title, idx)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default VariableListCard;