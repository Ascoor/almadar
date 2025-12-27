import {
  FileText,
  CalendarDays,
  User,
  Building2,
  FolderOpen,
  Hash,
  Paperclip,
  MessageCircle,
} from 'lucide-react';
import API_CONFIG from '@/config/config';
import EntityComments from '@/components/common/EntityComments';
import {
  DetailsShell,
  InfoItem,
  SectionCard,
} from '@/components/common/details/DetailsPrimitives';

export default function LegalAdviceDetails({ selected, onClose }) {
  if (!selected) return null;

  return (
    <DetailsShell
      title="تفاصيل المشورة القانونية"
      subtitle="واجهة موحدة للعرض والتعليقات"
      icon={FileText}
      onClose={onClose}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InfoItem
          icon={FolderOpen}
          label="نوع المشورة"
          value={selected.advice_type?.type_name}
        />
        <InfoItem icon={FileText} label="الموضوع" value={selected.topic} />
        <InfoItem
          icon={User}
          label="الجهة الطالبة"
          value={selected.requester || '—'}
        />
        <InfoItem
          icon={Building2}
          label="الجهة المصدرة"
          value={selected.issuer || '—'}
        />
        <InfoItem
          icon={CalendarDays}
          label="تاريخ المشورة"
          value={formatDateTime(selected.advice_date)}
        />
        <InfoItem icon={Hash} label="رقم المشورة" value={selected.advice_number} />
        {selected.created_at && (
          <InfoItem
            icon={CalendarDays}
            label="تاريخ الإنشاء"
            value={formatDateTime(selected.created_at)}
          />
        )}
        {selected.updated_at && (
          <InfoItem
            icon={CalendarDays}
            label="آخر تحديث"
            value={formatDateTime(selected.updated_at)}
          />
        )}
        {selected.creator?.name && (
          <InfoItem icon={User} label="منشئ السجل" value={selected.creator?.name} />
        )}
        {selected.updater?.name && (
          <InfoItem icon={User} label="آخر من عدّل" value={selected.updater?.name} />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SectionCard title="المرفق" icon={Paperclip}>
          {selected.attachment ? (
            <a
              href={`${API_CONFIG.baseURL}/storage/${selected.attachment}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 border border-border bg-muted/30 hover:bg-muted/50 text-sm font-semibold text-primary transition shadow-[var(--shadow-sm)]"
            >
              عرض الملف
            </a>
          ) : (
            <span className="text-muted-foreground text-sm">لا يوجد</span>
          )}
        </SectionCard>

        <SectionCard title="التعليقات" icon={MessageCircle}>
          <EntityComments entityType="legal-advices" entityId={selected.id} />
        </SectionCard>
      </div>

      <SectionCard title="نص المشورة" hint="عرض/قراءة" className="bg-[var(--comments-item)]">
        <p className="whitespace-pre-wrap leading-relaxed text-fg text-sm">
          {selected.text || 'لا يوجد نص للمشورة.'}
        </p>
      </SectionCard>
    </DetailsShell>
  );
}

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
