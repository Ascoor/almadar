import { XCircle, Calendar, ShieldCheck, UserCheck, FileText, ClipboardList } from "lucide-react";

export default function InvestigationActionDetailsCard({ selected, onClose }) {
  if (!selected) return null;

  return (
    <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-zinc-950 dark:to-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-xl p-6 md:p-10 mt-4">
      <button
        onClick={onClose}
        className="absolute top-3 left-3 text-red-500 hover:text-red-700 dark:text-red-400"
        type="button"
      >
        <XCircle size={22} />
      </button>

      <div className="flex items-center gap-3 mb-6">
        <ClipboardList size={28} className="text-blue-600 dark:text-blue-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          تفاصيل إجراء التحقيق
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
        <InfoItem icon={<Calendar size={16} />} label="تاريخ الإجراء" value={selected.action_date} />

        <InfoItem
          icon={<FileText size={16} />}
          label="نوع الإجراء"
          value={selected.action_type?.action_name || selected.action_type_name || "—"}
        />

        <InfoItem icon={<UserCheck size={16} />} label="القائم بالإجراء" value={selected.officer_name} />
        <InfoItem icon={<ShieldCheck size={16} />} label="الحالة" value={selected.status} />
        <InfoItem icon={<UserCheck size={16} />} label="المسؤول" value={selected.assigned_to?.name || "—"} />
      </div>

      <SectionCard title="المتطلبات">{selected.requirements || "—"}</SectionCard>
      <SectionCard title="النتائج">{selected.results || "—"}</SectionCard>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  const empty = value === null || value === undefined || value === "";
  return (
    <div className="flex items-start gap-3 text-gray-800 dark:text-gray-100">
      <div className="pt-1 text-blue-500 dark:text-blue-300 shrink-0">{icon}</div>
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</div>
        <div className={`font-semibold ${empty ? "text-gray-400 dark:text-zinc-500" : ""}`}>
          {empty ? "—" : value}
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="mt-8 p-6 rounded-2xl bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-inner">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">{title}</h3>
      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{children}</p>
    </div>
  );
}
