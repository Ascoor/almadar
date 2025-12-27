import { Suspense, useMemo } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLegalAdvice, useLegalAdvices } from '@/hooks/dataHooks';
import {
  DetailsShell,
  InfoItem,
  SectionCard,
} from '@/components/common/details/DetailsPrimitives';
import EntityComments from '@/components/common/EntityComments';
import { FileText, User, ShieldCheck, Calendar, MessageCircle, Hash } from 'lucide-react';

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

  // قائمة المشورات (للـ fallback)
  const { data } = useLegalAdvices();
  const advices = data?.data || data?.data?.data || [];

  const fallbackAdvice = useMemo(
    () => location.state || advices.find((a) => a.id === Number(id)),
    [advices, id, location.state],
  );

  const { data: advice, isLoading } = useLegalAdvice(id, {
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

        {/* ✅ سطر مستقل: الإجراءات/الجدول */}
        <SectionCard title="الإجراءات" icon={ShieldCheck} hint="متجاوب على الموبايل">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[720px]">
              <Suspense fallback={<div>تحميل البيانات...</div>}>
                {/* ضع جدول الإجراءات الخاص بالمشورة هنا إن كان موجودًا */}
                {/* <LegalAdviceActionsTable adviceId={advice.id} /> */}

                {/* Placeholder نظيف بدل الجدول إذا لم يوجد */}
                <div className="rounded-lg border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                  لا يوجد جدول إجراءات مرتبط بهذه المشورة (أو لم يتم ربطه بعد).
                </div>
              </Suspense>
            </div>
          </div>
        </SectionCard>

        {/* ✅ سطر مستقل: التعليقات */}
        <SectionCard title="التعليقات" icon={MessageCircle}>
          <EntityComments entityType="legal-advices" entityId={advice.id} />
        </SectionCard>
      </DetailsShell>
    </div>
  );
}
