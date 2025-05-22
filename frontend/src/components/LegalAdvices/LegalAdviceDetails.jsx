import React from 'react';

import API_CONFIG from "../../config/config";
export default function LegalAdviceDetails({ selected, onClose }) {
  if (!selected) return null;

  return (
    <div className="w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 space-y-6 text-right text-sm dark:text-gray-300 text-gray-700">
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-almadar-blue dark:text-almadar-yellow">
          تفاصيل المشورة القانونية
        </h2>
        <button
          onClick={onClose}
          className="text-sm text-red-600 dark:text-red-400 hover:underline"
        >
          ✖ إغلاق
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
        <div><span className="font-semibold">نوع المشورة:</span> {selected.advice_type?.type_name}</div>
        <div><span className="font-semibold">الموضوع:</span> {selected.topic}</div>
        <div><span className="font-semibold">الجهة الطالبة:</span> {selected.requester || '—'}</div>
        <div><span className="font-semibold">الجهة المصدرة:</span> {selected.issuer || '—'}</div>
        <div><span className="font-semibold">تاريخ المشورة:</span> {selected.advice_date}</div>
        <div><span className="font-semibold">رقم المشورة:</span> {selected.advice_number}</div>
        <div className="md:col-span-2">
          <span className="font-semibold">المرفق:</span>{" "}
          {selected.attachment ? (
            <a
            href={`${API_CONFIG.baseURL}/storage/${selected.attachment}`}
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

      <div className="p-4 bg-[#f7fdfc] dark:bg-gray-700 border border-[#cceee8] dark:border-gray-600 rounded-lg">
        <h3 className="font-semibold text-almadar-blue dark:text-almadar-yellow mb-2">
          📄 نص المشورة
        </h3>
        <p className="whitespace-pre-wrap leading-relaxed">
          {selected.text || "لا يوجد نص للمشورة."}
        </p>
      </div>
    </div>
  );
}
