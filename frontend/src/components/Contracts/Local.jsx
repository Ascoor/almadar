import React from "react";
import API_CONFIG from "../../config/config";

export default function Local({ contracts = [], onEditContract, onSelectContract }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl text-center font-bold text-almadar-green dark:text-almadar-yellow border-b-2 border-almadar-green dark:border-almadar-yellow pb-2">
        التعاقدات المحلية
      </h1>

      <div className="overflow-auto bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        {contracts.length > 0 ? (
          <table className="min-w-full text-sm text-center border border-gray-300 text-almadar-gray-darker dark:text-gray-100 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-almadar-yellow-light">
              <tr>
                <th>رقم العقد</th>
                <th>القيمة</th>
                <th>التصنيف</th>
                <th>الحالة</th>
                <th>مرفق</th>
                <th>خيارات</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map(contract => (
                <tr
                  key={contract.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => onSelectContract(contract)}
                >
                  <td>{contract.number}</td>
                  <td>{contract.value?.toLocaleString()} ﷼</td>
                  <td>{contract.category?.name}</td>
                  <td>{contract.status}</td>
                  <td>
                    {contract.attachment ? (
                      <a href={`${API_CONFIG.baseURL}/storage/${contract.attachment}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        عرض
                      </a>
                    ) : (
                      <span className="text-gray-400">لا يوجد</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={(e) => { e.stopPropagation(); onEditContract(contract); }}
                      className="text-almadar-green-dark dark:text-almadar-green-light hover:underline font-medium"
                    >
                      تعديل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            لا توجد تعاقدات محلية متاحة.
          </div>
        )}
      </div>
    </div>
  );
}
