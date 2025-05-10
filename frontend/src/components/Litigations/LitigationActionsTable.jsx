import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function LitigationActionsTable({ actions, onEdit, onDelete }) {
  return (
    <div className="mt-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-4 md:p-6 transition">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg md:text-xl font-bold text-almadar-blue dark:text-almadar-yellow">
          الإجراءات القضائية المرتبطة
        </h3>
      </div>

      {actions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">لا توجد إجراءات مسجلة لهذه القضية.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm text-center border border-gray-200 dark:border-gray-600">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-yellow-200">
              <tr>
                <th className="p-2 border">تعديل</th>
                <th className="p-2 border">نوع الإجراء</th>
                <th className="p-2 border">تاريخ الإجراء</th>
                <th className="p-2 border">المحامي/المستشار</th>
                <th className="p-2 border">مكان الإجراء</th>
                <th className="p-2 border">الحالة</th>
                <th className="p-2 border">الخيارات</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100">
              {actions.map((action) => (
                <tr key={action.id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td className="p-2 border">
                    <button
                      onClick={() => onEdit?.(action)} // Invoke onEdit function with the action object
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-yellow-300"
                    >
                      <FaEdit />
                    </button>
                  </td>
                  <td className="p-2 border">{action.action_type}</td>
                  <td className="p-2 border">{action.action_date}</td>
                  <td className="p-2 border">{action.lawyer_name}</td>
                  <td className="p-2 border">{action.location}</td>
                  <td className="p-2 border">{action.status}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => onDelete?.(action.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-yellow-300"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
