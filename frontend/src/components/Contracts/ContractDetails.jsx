import API_CONFIG from "../../config/config";
import {
  FileText, File, UserCheck, ShieldCheck, Calendar,
  BadgeDollarSign, Layers, Globe, XCircle, Notebook
} from 'lucide-react';

export default function ContractDetails({ selected, onClose }) {
  if (!selected) return null;

  const hasDuration = !!selected.end_date;
  const formattedValue = selected.value ? `${selected.value.toLocaleString()} ريال` : '—';

  return (
    <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-zinc-950 dark:to-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-xl p-6 md:p-10 mt-4 transition-all duration-300 hover:shadow-2xl">

      {/* زر الإغلاق */}
      <button
        onClick={onClose}
        className="absolute top-3 left-3 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition"
      >
        <XCircle size={22} />
      </button>

      {/* عنوان الصفحة */}
      <div className="flex items-center gap-3 mb-6">
        <FileText size={28} className="text-blue-600 dark:text-blue-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          تفاصيل العقد
        </h2>
      </div>

      {/* معلومات العقد */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
        <InfoItem icon={<File />} label="رقم العقد" value={selected.number} />
        <InfoItem icon={<Globe />} label="نوع العقد" value={selected.scope === 'local' ? 'محلي' : 'دولي'} />
        <InfoItem icon={<Layers />} label="تصنيف العقد" value={selected.category?.name} />
        <InfoItem icon={<ShieldCheck />} label="الحالة" value={selected.status} />
        <InfoItem icon={<BadgeDollarSign />} label="قيمة العقد" value={formattedValue} />

        <InfoItem icon={<Calendar />} label="تاريخ الإنشاء" value={selected.created_at} />
        <InfoItem icon={<Calendar />} label="آخر تحديث" value={selected.updated_at} />
        <InfoItem icon={<UserCheck />} label="منشئ العقد" value={selected.creator?.name} />
        <InfoItem icon={<UserCheck />} label="آخر من عدّل العقد" value={selected.updater?.name} />
        <InfoItem icon={<Calendar />} label={hasDuration ? "تاريخ بداية العقد" : "تاريخ العقد"} value={selected.start_date} />
        {hasDuration && (
          <InfoItem icon={<Calendar />} label="تاريخ نهاية العقد" value={selected.end_date} />
        )}

        {/* المرفق */}
        <div className="col-span-full sm:col-span-2 lg:col-span-1">
          <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-semibold">
            <File size={16} />
            المرفق:
          </span>
          {selected.attachment ? (
            <a
              href={`${API_CONFIG.baseURL}/storage/${selected.attachment}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline ml-1 block mt-1 transition"
            >
              عرض الملف
            </a>
          ) : (
            <span className="text-gray-400 dark:text-gray-500 ml-1 mt-1 block">لا يوجد</span>
          )}
        </div>
      </div>

      {/* ملخص العقد */}
      <SectionCard icon={<UserCheck size={18} />} title="ملخص العقد">
        {selected.summary || "لا يوجد ملخص متاح."}
      </SectionCard>

      {/* ملاحظات */}
      <SectionCard icon={<Notebook size={18} />} title="ملاحظات">
        {selected.notes || "لا توجد ملاحظات."}
      </SectionCard>
    </div>
  );
}

// ✅ عرض معلومات مفصلة بشكل منسق
function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 text-gray-800 dark:text-gray-100">
      <div className="pt-1 text-blue-500 dark:text-blue-300 shrink-0">{icon}</div>
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</div>
        <div className={`font-semibold ${!value ? 'text-gray-400 dark:text-zinc-500' : ''}`}>
          {value || '—'}
        </div>
      </div>
    </div>
  );
}

// ✅ مكون موحد لعرض أقسام كبيرة
function SectionCard({ icon, title, children }) {
  return (
    <div className="mt-8 p-6 rounded-2xl bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-inner">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
        <span className="text-blue-500 dark:text-blue-300">{icon}</span>
        {title}
      </h3>
      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
        {children}
      </p>
    </div>
  );
}
