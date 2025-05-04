import React, { useState } from "react";
import LitigationActionsTable from "../LitigationActionsTable";

export default function AgainstCompanyLitigations({ litigations = [] }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-almadar-blue dark:text-almadar-yellow">
        الدعاوى المرفوعة على الشركة
      </h2>
      {litigations.length === 0 ? (
        <p className="text-gray-400">لا توجد دعاوى حالياً.</p>
      ) : (
        <table className="w-full table-fixed text-sm border border-gray-300 dark:border-gray-600">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-yellow-200">
            <tr>
              <th className="p-3">رقم الدعوى</th>
              <th className="p-3">المحكمة</th>
              <th className="p-3">الخصم</th>
              <th className="p-3">الموضوع</th>
              <th className="p-3">الحالة</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100">
            {litigations.map((item) => (
              <React.Fragment key={item.id}>
                <tr
                  className="border-t cursor-pointer  text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  onClick={() => toggleExpand(item.id)}
                >
                  <td className="p-2">{item.case_number}</td>
                  <td className="p-2">{item.court}</td>
                  <td className="p-2">{item.opponent}</td>
                  <td className="p-2">{item.subject}</td>
                  <td className="p-2">{item.status}</td>
                </tr>
                {expandedId === item.id && (
                  <tr>
                    <td colSpan="5">
                      <LitigationActionsTable actions={item.actions || []} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
