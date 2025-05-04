import React from "react";
import { FaEdit, FaPlusCircle } from "react-icons/fa";

export default function LitigationActionsTable({ actions = [], onEdit, onAdd }) {
  return (
    <div className="mt-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-4 md:p-6 transition">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg md:text-xl font-bold text-almadar-blue dark:text-almadar-yellow">
          الإجراءات القضائية المرتبطة
        </h3>
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 text-sm md:text-base text-white bg-almadar-blue dark:bg-almadar-yellow dark:text-black px-4 py-2 rounded-lg hover:scale-105 transition"
          >
            <FaPlusCircle />
            <span>إضافة إجراء</span>
          </button>
        )}
      </div>

      {actions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">لا توجد إجراءات مسجلة.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm text-center border border-gray-200 dark:border-gray-600">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-yellow-200">
              <tr>
                <th className="p-2 border">تعديل</th>
                <th className="p-2 border">نوع الإجراء</th>
                <th className="p-2 border">تاريخ الإجراء</th>
                <th className="p-2 border">الطلبات</th>
                <th className="p-2 border">النتيجة</th>
                <th className="p-2 border">القائم بالإجراء</th>
                <th className="p-2 border">مكان الإجراء</th>
                <th className="p-2 border">الملاحظات</th>
                <th className="p-2 border">الحالة</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100">
              {actions.map((action) => (
                <tr key={action.id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td className="p-2 border">
                    <button
                      title="تعديل"
                      onClick={() => onEdit?.(action)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-yellow-300"
                    >
                      <FaEdit />
                    </button>
                  </td>
                  <td className="p-2 border">{action.action_type}</td>
                  <td className="p-2 border">{action.action_date}</td>
                  <td className="p-2 border">{action.requirements || "—"}</td>
                  <td className="p-2 border">{action.results || "—"}</td>
                  <td className="p-2 border">{action.lawyer_name}</td>
                  <td className="p-2 border">{action.location}</td>
                  <td className="p-2 border">{action.notes || "—"}</td>
                  <td className="p-2 border font-bold text-emerald-700 dark:text-emerald-300">
                    {action.status === "pending"
                      ? "معلق"
                      : action.status === "in_review"
                      ? "قيد المراجعة"
                      : "منجز"}
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
