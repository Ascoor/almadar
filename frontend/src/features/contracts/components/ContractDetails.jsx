import API_CONFIG from '@/config/config';
import {
  BadgeDollarSign,
  Calendar,
  File,
  FileText,
  Globe,
  Layers,
  Pencil,
  ShieldCheck,
  UserCheck,
  Users,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import EntityComments from '@/components/common/EntityComments';
import {
  DetailsShell,
  InfoItem,
  SectionCard,
} from '@/components/common/details/DetailsPrimitives';

export default function ContractDetails({ selected, onClose, onEdit }) {
  if (!selected) return null;

  const hasDuration = Boolean(selected.end_date);
  const formattedValue = selected.value
    ? `${Number(selected.value).toLocaleString()} ريال`
    : '—';

  const attachmentUrl = selected.attachment
    ? `${API_CONFIG.baseURL}/storage/${selected.attachment}`
    : null;

  const actions = onEdit ? (
    <button
      type="button"
      onClick={onEdit}
      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 border border-border bg-muted/40 hover:bg-muted/60 text-fg text-sm font-semibold shadow-[var(--shadow-sm)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Pencil size={16} className="text-primary" />
      تعديل
    </button>
  ) : null;

  return (
    <DetailsShell
      title="تفاصيل العقد"
      subtitle="بيانات العقد وتفاصيله حسب النظام"
      icon={FileText}
      onClose={onClose}
      actions={actions}
    >
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SectionCard title="المرفق" icon={File}>
          {attachmentUrl ? (
            <a
              href={attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 border border-border bg-muted/30 hover:bg-muted/50 text-sm font-semibold text-primary transition shadow-[var(--shadow-sm)]"
            >
              <ExternalLink size={16} />
              عرض المرفق
            </a>
          ) : (
            <p className="text-sm text-muted-foreground">لا يوجد مرفق.</p>
          )}
        </SectionCard>

        <SectionCard title="التعليقات" icon={MessageCircle}>
          <EntityComments entityType="contracts" entityId={selected.id} />
        </SectionCard>
      </div>
    </DetailsShell>
  );
}
