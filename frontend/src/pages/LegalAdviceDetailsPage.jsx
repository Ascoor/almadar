import { lazy, Suspense, useMemo } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLegalAdvice, useLegalAdvices } from '@/hooks/dataHooks';

const LegalAdviceDetails = lazy(
  () => import('@/features/legal-advices/components/LegalAdviceDetails'),
);

export default function LegalAdviceDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  // البيانات الأساسية
  const { data } = useLegalAdvices();
  const advices = data?.data || [];

  // تحديد المشورة الحالية
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
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      {/* أزرار التحكم */}
      <div className="mb-4 flex gap-2">
        <Button onClick={() => navigate(-1)}>رجوع</Button>
      </div>

      {/* تفاصيل المشورة */}
      <Suspense fallback={<div>تحميل التفاصيل...</div>}>
        <LegalAdviceDetails selected={advice} onClose={() => navigate(-1)} />
      </Suspense>
    </div>
  );
}
