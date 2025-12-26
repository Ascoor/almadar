import API_CONFIG from '@/config/config';
import {
  BadgeDollarSign,
  Calendar,
  File,
  FileText,
  Globe,
  Layers,
  Notebook,
  Pencil,
  ShieldCheck,
  UserCheck,
  Users,
  XCircle,
  ExternalLink,
} from 'lucide-react';

/**
 * ✅ Neon Glass / Token-based (day + dark)
 * - Uses your CSS tokens: --bg, --fg, --card, --muted, --border, --ring, --gradient-primary, --shadow-*
 * - No hardcoded "blue/gray" colors → all driven by tokens for perfect dark/day
 */

export default function ContractDetails({ selected, onClose, onEdit }) {
  if (!selected) return null;

  const hasDuration = Boolean(selected.end_date);
  const formattedValue = selected.value
    ? `${Number(selected.value).toLocaleString()} ريال`
    : '—';

  const attachmentUrl = selected.attachment
    ? `${API_CONFIG.baseURL}/storage/${selected.attachment}`
    : null;

  return (
    <div
      className="
        relative mt-4
        rounded-[1.75rem]
        border border-border
        bg-card/70 backdrop-blur
        shadow-[var(--shadow-lg)]
        overflow-hidden
      "
    >
      {/* top neon bar */}
      <div className="h-1 w-full bg-[var(--gradient-primary)] opacity-70" />

      {/* dark-only soft halo */}
      <div
        className="
          pointer-events-none absolute -top-28 -right-28 h-[28rem] w-[28rem] rounded-full
          opacity-0 dark:opacity-100
          bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--ring)_18%,transparent),transparent_72%)]
          blur-3xl
        "
      />

      {/* header actions */}
      <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="
              inline-flex items-center gap-2
              rounded-full px-3 py-1.5
              border border-border
              bg-muted/40 hover:bg-muted/60
              text-fg text-sm font-semibold
              shadow-[var(--shadow-sm)]
              transition
              focus:outline-none focus-visible:ring-2 focus-visible:ring-ring
            "
          >
            <Pencil size={16} className="text-primary" />
            تعديل
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          className="
            grid place-items-center
            w-9 h-9 rounded-full
            border border-border
            bg-muted/30 hover:bg-muted/55
            transition
            focus:outline-none focus-visible:ring-2 focus-visible:ring-ring
          "
          aria-label="إغلاق"
          title="إغلاق"
        >
          <XCircle size={20} className="text-destructive" />
        </button>
      </div>

      <div className="p-6 md:p-10">
        {/* title */}
        <div className="mb-7 flex items-center gap-3">
          <div
            className="
              grid place-items-center w-11 h-11 rounded-2xl
              border border-border
              bg-muted/30
              shadow-[var(--shadow-sm)]
            "
            aria-hidden="true"
          >
            <FileText size={22} className="text-primary" />
          </div>

          <div className="leading-tight">
            <h2 className="text-2xl font-extrabold text-fg">تفاصيل العقد</h2>
            <p className="text-xs text-muted-foreground">
              بيانات العقد وتفاصيله حسب النظام
            </p>
          </div>
        </div>

        {/* info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-sm">
          <InfoItem icon={File} label="رقم العقد" value={selected.number} />
          <InfoItem
            icon={Globe}
            label="نوع العقد"
            value={selected.scope === 'local' ? 'محلي' : 'دولي'}
          />
          <InfoItem
            icon={Layers}
            label="تصنيف العقد"
            value={selected.category?.name}
          />
          <InfoItem icon={ShieldCheck} label="الحالة" value={selected.status} />
          <InfoItem
            icon={BadgeDollarSign}
            label="قيمة العقد"
            value={formattedValue}
          />
          <InfoItem
            icon={Calendar}
            label="تاريخ الإنشاء"
            value={selected.created_at}
          />
          <InfoItem
            icon={Users}
            label="الأطراف المتعاقدة"
            value={selected.contract_parties}
          />
          <InfoItem
            icon={Calendar}
            label="آخر تحديث"
            value={selected.updated_at}
          />
          <InfoItem
            icon={UserCheck}
            label="محرر البيان"
            value={selected.creator?.name}
          />
          <InfoItem
            icon={UserCheck}
            label="مسؤول التعاقد"
            value={selected.assigned_to?.name}
          />
          <InfoItem
            icon={UserCheck}
            label="آخر من عدّل العقد"
            value={selected.updater?.name}
          />

          <InfoItem
            icon={Calendar}
            label={hasDuration ? 'تاريخ بداية العقد' : 'تاريخ العقد'}
            value={selected.start_date}
          />
          {hasDuration && (
            <InfoItem
              icon={Calendar}
              label="تاريخ نهاية العقد"
              value={selected.end_date}
            />
          )}

          {/* attachment */}
          <div className="col-span-full sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <File size={16} className="text-primary" />
              <span className="font-semibold">المرفق</span>
            </div>

            {attachmentUrl ? (
              <a
                href={attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center gap-2
                  rounded-2xl px-3 py-2
                  border border-border
                  bg-muted/35 hover:bg-muted/60
                  text-sm font-semibold text-fg
                  shadow-[var(--shadow-sm)]
                  transition
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-ring
                "
              >
                <ExternalLink size={16} className="text-primary" />
                عرض الملف
              </a>
            ) : (
              <div className="rounded-2xl border border-border bg-muted/25 px-3 py-2 text-sm text-muted-foreground">
                لا يوجد
              </div>
            )}
          </div>
        </div>

        {/* big sections */}
        <SectionCard icon={UserCheck} title="ملخص العقد">
          {selected.summary || 'لا يوجد ملخص متاح.'}
        </SectionCard>

        <SectionCard icon={FileText} title="وصف العقد">
          {selected.description || 'لا يوجد وصف متاح.'}
        </SectionCard>

        <SectionCard icon={Users} title="الأطراف المتعاقدة">
          {selected.contract_parties || 'لا توجد بيانات حول الأطراف المتعاقدة.'}
        </SectionCard>

        <SectionCard icon={Notebook} title="ملاحظات">
          {selected.notes || 'لا توجد ملاحظات.'}
        </SectionCard>
      </div>
    </div>
  );
}

/* ---------- Small Info Tile ---------- */
function InfoItem({ icon: Icon, label, value }) {
  const empty = !value;

  return (
    <div
      className="
        rounded-2xl border border-border
        bg-muted/25
        p-4
        shadow-[var(--shadow-sm)]
      "
    >
      <div className="flex items-start gap-3">
        <div
          className="
            mt-0.5 grid place-items-center
            w-9 h-9 rounded-xl
            border border-border
            bg-card/60
          "
          aria-hidden="true"
        >
          <Icon size={18} className="text-primary" />
        </div>

        <div className="min-w-0">
          <div className="text-[11px] text-muted-foreground mb-1">{label}</div>
          <div className={`text-sm font-extrabold ${empty ? 'text-muted-foreground' : 'text-fg'}`}>
            {value || '—'}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Big Section Card ---------- */
function SectionCard({ icon: Icon, title, children }) {
  return (
    <div
      className="
        mt-7
        rounded-3xl border border-border
        bg-card/55 backdrop-blur
        shadow-[var(--shadow-md)]
        overflow-hidden
      "
    >
      {/* section bar */}
      <div className="h-1 w-full bg-[var(--gradient-primary)] opacity-60" />

      <div className="p-5 md:p-6">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="
              grid place-items-center w-10 h-10 rounded-2xl
              border border-border
              bg-muted/30
            "
            aria-hidden="true"
          >
            <Icon size={18} className="text-primary" />
          </div>

          <h3 className="text-base md:text-lg font-extrabold text-fg">
            {title}
          </h3>
        </div>

        <p className="text-sm text-fg/90 leading-relaxed whitespace-pre-line">
          {children}
        </p>
      </div>
    </div>
  );
}
