import React from "react";

export default function International({ contracts = [], onEditContract, onSelectContract }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center border-b-2 border-almadar-green dark:border-almadar-yellow pb-2">
        <h1 className="text-2xl text-center font-bold text-almadar-green dark:text-almadar-yellow">
          التعاقدات الدولية
        </h1>
      </div>

      <div className="overflow-auto bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        {contracts.length > 0 ? (
          <table className="min-w-full text-sm text-center border border-gray-300 text-almadar-gray-darker dark:text-gray-100 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-almadar-yellow-light">
              <tr>
                <th className="border p-2 dark:border-gray-600">رقم العقد</th>
                <th className="border p-2 dark:border-gray-600">القيمة</th>
                <th className="border p-2 dark:border-gray-600">التصنيف</th>
                <th className="border p-2 dark:border-gray-600">الحالة</th>
                <th className="border p-2 dark:border-gray-600">خيارات</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map(contract => (
                <tr
                  key={contract.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition"
                  onClick={() => onSelectContract(contract)}
                >
                  <td className="border p-2 dark:border-gray-600">{contract.number}</td>
                  <td className="border p-2 dark:border-gray-600">{contract.value?.toLocaleString()}</td>
                  <td className="border p-2 dark:border-gray-600">{contract.category?.name}</td>
                  <td className="border p-2 dark:border-gray-600">{contract.status}</td>
                  <td className="border p-2 dark:border-gray-600">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); 
                        onEditContract(contract);
                      }}
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
            لا توجد تعاقدات دولية متاحة.
          </div>
        )}
      </div>
    </div>
  );
}
