import React from 'react';
import API_CONFIG from "../../config/config";

export default function ContractDetails({ selected, onClose }) {
  if (!selected) return null;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-almadar-mint-light  rounded-2xl shadow-lg p-5 md:p-8 mt-4 transition-all duration-300">
      
      {/* العنوان وزر الإغلاق */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
        <h2 className="text-xl font-bold text-almadar-blue dark:text-almadar-mint-light">
          📄 تفاصيل العقد
        </h2>
        <button
          onClick={onClose}
          className="text-sm font-medium px-3 py-1 bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-600/30 transition"
        >
          ✖ إغلاق
        </button>
      </div>

      {/* بيانات العقد */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-sm text-gray-700 dark:text-gray-200">
        <Detail label="رقم العقد" value={selected.number} />
        <Detail label="تصنيف العقد" value={selected.scope === 'local' ? 'محلي' : 'دولي'} />
        <Detail label="نوع العقد" value={selected.category?.name} />
        <Detail label="الحالة" value={selected.status} />
        <Detail label="القيمة" value={`${selected.value?.toLocaleString()} ريال`} />
        <Detail label="تاريخ البداية" value={selected.start_date} />
        <Detail label="تاريخ النهاية" value={selected.end_date} />
        <div className="col-span-full sm:col-span-2 lg:col-span-1">
          <span className="font-semibold">المرفق:</span>{" "}
          {selected.attachment ? (
            <a
              href={`${API_CONFIG.baseURL}/storage/${selected.attachment}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
            >
              عرض الملف
            </a>
          ) : (
            <span className="text-gray-400 dark:text-gray-500 ml-1">لا يوجد</span>
          )}
        </div>
      </div>

      {/* ملخص */}
      <div className="mt-6 p-5 rounded-lg bg-gray-100/70 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
        <h3 className="font-semibold text-almadar-blue dark:text-almadar-sand-light mb-2">
          🔍 ملخص العقد
        </h3>
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {selected.summary || "لا يوجد ملخص متاح."}
        </p>
      </div>
    </div>
  );
}

// ✅ مكون فرعي للتفاصيل
function Detail({ label, value }) {
  return (
    <div>
      <span className="font-semibold text-almadar-sky dark:text-almadar-sky-light">{label}:</span>{" "}
      <span>{value || "—"}</span>
    </div>
  );
}
