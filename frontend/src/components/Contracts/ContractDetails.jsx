import React from 'react';

export default function ContractDetails({ selected, onClose }) {
  if (!selected) return null;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-6 space-y-6 mt-6 transition-all">
      
      {/* العنوان وزر الإغلاق */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-almadar-green dark:text-almadar-yellow">
          تفاصيل العقد
        </h2>
        <button
          onClick={onClose}
          className="text-sm text-red-600 dark:text-red-400 hover:underline"
        >
          ✖ إغلاق
        </button>
      </div>

      {/* تفاصيل البيانات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700 dark:text-gray-300">
        <div><span className="font-semibold">رقم العقد:</span> {selected.number}</div>
        <div><span className="font-semibold">نوع العقد:</span> {selected.scope === 'local' ? 'محلي' : 'دولي'}</div>
        <div><span className="font-semibold">تصنيف العقد:</span> {selected.category?.name}</div>
        <div><span className="font-semibold">الحالة:</span> {selected.status}</div>
        <div><span className="font-semibold">قيمة العقد:</span> {selected.value?.toLocaleString()} ريال</div>
        <div><span className="font-semibold">تاريخ البداية:</span> {selected.start_date}</div>
        <div><span className="font-semibold">تاريخ النهاية:</span> {selected.end_date}</div>
        <div>
          <span className="font-semibold">المرفق:</span> 
          {selected.attachment ? (
            <a 
              href={selected.attachment}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline ml-2"
            >
              عرض الملف
            </a>
          ) : (
            <span className="text-gray-400 ml-2">لا يوجد</span>
          )}
        </div>
      </div>

      {/* ملخص العقد */}
      <div className="mt-6 p-4 bg-[#f7fdfc] dark:bg-gray-700 border border-[#cceee8] dark:border-gray-600 rounded-lg">
        <h3 className="font-semibold text-almadar-green dark:text-almadar-yellow mb-2">
          🔍 ملخص العقد
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {selected.summary || 'لا يوجد ملخص متاح.'}
        </p>
      </div>
    </div>
  );
}
