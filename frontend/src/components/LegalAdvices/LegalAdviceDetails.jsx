import React from "react";
import {
  FileText,
  CalendarDays,
  User,
  Building2,
  FolderOpen,
  Hash,
  Paperclip,
  XCircle,
} from "lucide-react";
import API_CONFIG from "../../config/config";

export default function LegalAdviceDetails({ selected, onClose }) {
  if (!selected) return null;

  return (
    <div className="w-full rounded-2xl shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 p-6 space-y-6 text-sm text-right transition-all">

      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4 mb-4 border-dashed">
        <h2 className="text-xl font-bold flex items-center gap-2 text-greenic dark:text-gold">
          <FileText className="w-5 h-5 text-greenic dark:text-gold" />
          تفاصيل المشورة القانونية
        </h2>
        <button
          onClick={onClose}
          className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400 hover:underline transition"
        >
          <XCircle className="w-4 h-4" />
          إغلاق
        </button>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Detail icon={<FolderOpen />} label="نوع المشورة" value={selected.advice_type?.type_name} />
        <Detail icon={<FileText />} label="الموضوع" value={selected.topic} />
        <Detail icon={<User />} label="الجهة الطالبة" value={selected.requester || "—"} />
        <Detail icon={<Building2 />} label="الجهة المصدرة" value={selected.issuer || "—"} />
        <Detail icon={<CalendarDays />} label="تاريخ المشورة" value={selected.advice_date} />
        <Detail icon={<Hash />} label="رقم المشورة" value={selected.advice_number} />

        {/* Attachment */}
        <div className="sm:col-span-2 flex items-center gap-2">
          <Paperclip className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="font-semibold">المرفق:</span>
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
            <span className="text-gray-400 ml-1">لا يوجد</span>
          )}
        </div>
      </div>

      {/* Advice Text Section */}
      <div className="rounded-xl border border-[#ccf1e9] dark:border-gray-600 bg-[#f7fdfc] dark:bg-gray-700 p-4 shadow-inner">
        <h3 className="font-semibold text-greenic dark:text-gold mb-2 flex items-center gap-2">
          📄 نص المشورة
        </h3>
        <p className="whitespace-pre-wrap leading-relaxed text-gray-700 dark:text-gray-200">
          {selected.text || "لا يوجد نص للمشورة."}
        </p>
      </div>
    </div>
  );
}

function Detail({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-1 text-greenic dark:text-gold">{icon}</div>
      <div>
        <span className="font-semibold text-gray-800 dark:text-gray-100">{label}:</span>{" "}
        <span className="text-gray-600 dark:text-gray-300">{value}</span>
      </div>
    </div>
  );
}
