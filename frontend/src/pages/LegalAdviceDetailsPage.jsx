import { Suspense, useMemo, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  useAdviceTypes,
  useLegalAdvice,
  useLegalAdvices,
} from '@/hooks/dataHooks';
import {
  DetailsShell,
  InfoItem,
  SectionCard,
} from '@/components/common/details/DetailsPrimitives';
import EntityComments from '@/components/common/EntityComments';
import { FileText, User, ShieldCheck, Calendar, MessageCircle, Hash } from 'lucide-react';
import LegalAdviceModal from '@/features/legal-advices/components/LegalAdviceModal';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  // قائمة المشورات (للـ fallback)
  const { data, refetch: refetchAdvices } = useLegalAdvices();
  const advices = data?.data || data?.data?.data || [];
  const { data: adviceTypes = [] } = useAdviceTypes();

  const fallbackAdvice = useMemo(
    () => location.state || advices.find((a) => a.id === Number(id)),
    [advices, id, location.state],
  );

  const { data: advice, isLoading, refetch } = useLegalAdvice(id, {
    initialData: fallbackAdvice,
  });

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
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsModalOpen(true)}
          >
            تعديل
          </Button>
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
        {isModalOpen && (
          <LegalAdviceModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            adviceTypes={adviceTypes}
            initialData={advice}
            reload={() => {
              refetch();
              refetchAdvices();
            }}
          />
        )}
      </Suspense>
    </div>
  );
}
