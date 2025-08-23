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
    <div className="w-full rounded-2xl shadow-xl bg-gradient-primary border border-border p-6 space-y-6 text-sm text-right transition-all">

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
  <Detail icon={<CalendarDays />} label="تاريخ المشورة" value={formatDateTime(selected.advice_date)} />
  <Detail icon={<Hash />} label="رقم المشورة" value={selected.advice_number} />

  {/* تاريخ الإنشاء والتحديث */}
  {selected.created_at && (
    <Detail icon={<CalendarDays />} label="تاريخ الإنشاء" value={formatDateTime(selected.created_at)} />
  )}
  {selected.updated_at && (
    <Detail icon={<CalendarDays />} label="آخر تحديث" value={formatDateTime(selected.updated_at)} />
  )}

  {/* منشئ السجل والمحدث */}
  {selected.creator?.name && (
    <Detail icon={<User />} label="منشئ السجل" value={selected.creator?.name} />
  )}
  {selected.updater?.name && (
    <Detail icon={<User />} label="آخر من عدّل" value={selected.updater?.name} />
  )} 
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
      <div className="rounded-xl border border-accent-light dark:border-border bg-accent-light/20 dark:bg-muted p-4 shadow-inner">
        <h3 className="font-semibold text-greenic dark:text-gold mb-2 flex items-center gap-2">
          📄 نص المشورة
        </h3>
        <p className="whitespace-pre-wrap leading-relaxed text-foreground">
          {selected.text || "لا يوجد نص للمشورة."}
        </p>
      </div>
    </div>
  );
}

// ✅ مكون عنصر تفصيل
function Detail({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2 text-foreground">
      <div className="pt-1 text-greenic dark:text-gold shrink-0">{icon}</div>
      <div>
        <div className="text-xs text-muted-foreground mb-1">{label}</div>
        <div className={`font-semibold ${!value ? 'text-muted-foreground' : ''}`}>
          {value || '—'}
        </div>
      </div>
    </div>
  );
}

// ✅ تنسيق التاريخ بالتقويم العربي و 12 ساعة
function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  return date.toLocaleString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}
