import React from "react";
import { Link } from "react-router-dom";

export default function AgainstCompanyLitigations({ litigations }) {
  return (
    <div className="mt-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-4 md:p-6 transition">
      <h3 className="text-lg md:text-xl font-bold text-almadar-blue dark:text-almadar-yellow">
        القضايا ضد الشركة
      </h3>
      {litigations.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">لا توجد قضايا ضد الشركة مسجلة.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm text-center border border-gray-200 dark:border-gray-600">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-yellow-200">
              <tr>
                <th className="p-2 border">اسم القضية</th>
                <th className="p-2 border">تاريخ الرفع</th>
                <th className="p-2 border">الحالة</th>
                <th className="p-2 border">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100">
              {litigations.map((litigation) => (
                <tr key={litigation.id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td className="p-2 border">{litigation.name}</td>
                  <td className="p-2 border">{litigation.filing_date}</td>
                  <td className="p-2 border">{litigation.status}</td>
                  <td className="p-2 border">
                    <Link
                      to={`/litigations/${litigation.id}/actions`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-yellow-300"
                    >
                      عرض الإجراءات
                    </Link>
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
