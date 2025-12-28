import { Suspense, lazy, useMemo, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLegalAdvice, useLegalAdvices, useAdviceTypes } from '@/hooks/dataHooks';
import {
  DetailsShell,
  InfoItem,
  SectionCard,
} from '@/components/common/details/DetailsPrimitives';
import EntityComments from '@/components/common/EntityComments';
import { Pencil, FileText, User, ShieldCheck, Calendar, MessageCircle, Hash } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const LegalAdviceModal = lazy(
  () => import('@/features/legal-advices/components/LegalAdviceModal'),
);

// ✅ (اختياري) لو عندكم جدول إجراءات للمشورة، فعّله
// const LegalAdviceActionsTable = lazy(() => import('@/features/legal-advices/components/LegalAdviceActionsTable'));

const formatDate = (value) => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return value;
  }
};

export default function LegalAdviceDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { hasPermission } = useAuth();
  const canEdit = hasPermission('edit legaladvices');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // قائمة المشورات (للـ fallback)
  const { data } = useLegalAdvices();
  const advices = data?.data || data?.data?.data || [];

  const fallbackAdvice = useMemo(
    () => location.state || advices.find((a) => a.id === Number(id)),
    [advices, id, location.state],
  );

  const { data: advice, isLoading, refetch } = useLegalAdvice(id, {
    initialData: fallbackAdvice,
  });

  const { data: adviceTypes = [] } = useAdviceTypes();

  if (isLoading && !advice) {
    return <div className="p-4">جاري تحميل بيانات المشورة...</div>;
  }

  if (!advice) {
    return <div className="p-4">لا توجد بيانات</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen space-y-4">
      <div className="mb-2 flex gap-2">
        <Button onClick={() => navigate(-1)}>رجوع</Button>
      </div>

      <DetailsShell
        title="تفاصيل المشورة القانونية"
        subtitle="عرض متجاوب + الإجراءات والتعليقات في أسطر مستقلة"
        icon={FileText}
        actions={
          canEdit ? (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 border border-border bg-muted/40 hover:bg-muted/60 text-fg text-sm font-semibold shadow-[var(--shadow-sm)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Pencil size={16} className="text-primary" />
              تعديل
            </button>
          ) : null
        }
      >
        {/* ✅ كروت البيانات الأساسية (Responsive) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-sm">
          <InfoItem icon={Hash} label="المعرف" value={advice.id ?? '—'} />
          <InfoItem icon={FileText} label="الموضوع" value={advice.topic || advice.subject || '—'} />
          <InfoItem icon={ShieldCheck} label="الحالة" value={advice.status || '—'} />
          <InfoItem icon={User} label="المسؤول" value={advice.assigned_to?.name || advice.assignedTo?.name || '—'} />
          <InfoItem icon={Calendar} label="تاريخ الإنشاء" value={formatDate(advice.created_at)} />
          <InfoItem icon={Calendar} label="آخر تحديث" value={formatDate(advice.updated_at)} />
        </div>

      

        {/* ✅ سطر مستقل: التعليقات */}
        <SectionCard title="التعليقات" icon={MessageCircle}>
          <EntityComments entityType="legal-advices" entityId={advice.id} />
        </SectionCard>
      </DetailsShell>

      <Suspense fallback={null}>
        {isModalOpen && canEdit ? (
          <LegalAdviceModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            initialData={advice}
            adviceTypes={adviceTypes}
            reload={refetch}
          />
        ) : null}
      </Suspense>
    </div>
  );
}
