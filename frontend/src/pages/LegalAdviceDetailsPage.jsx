import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLegalAdvices } from '@/hooks/dataHooks';
import { getLegalAdviceById } from '@/services/api/legalAdvices';
import GlobalSpinner from '@/components/common/Spinners/GlobalSpinner';

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
  const initialAdvice =
    location.state || advices.find((a) => a.id === Number(id));
  const [current, setCurrent] = useState(initialAdvice || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const lastFetchedId = useRef(null);

  useEffect(() => {
    if (initialAdvice) setCurrent(initialAdvice);
  }, [initialAdvice]);

  useEffect(() => {
    if (!id) return;
    if (current?.id && String(current.id) === String(id)) return;

    const sid = String(id);
    if (lastFetchedId.current === sid) return;
    lastFetchedId.current = sid;

    const controller = new AbortController();
    setLoading(true);
    setError('');

    getLegalAdviceById(id, { signal: controller.signal })
      .then((res) => setCurrent(res.data?.data ?? res.data))
      .catch((err) => {
        if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED')
          return;
        setCurrent(null);
        setError('لا توجد بيانات لهذه المشورة أو لا تملك صلاحية.');
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [id, current]);

  if (loading && !current) return <GlobalSpinner />;

  if (!current) {
    return <div className="p-4 text-center text-red-500">{error || 'لا توجد بيانات'}</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      {/* أزرار التحكم */}
      <div className="mb-4 flex gap-2">
        <Button onClick={() => navigate(-1)}>رجوع</Button>
      </div>

      {/* تفاصيل المشورة */}
      <Suspense fallback={<div>تحميل التفاصيل...</div>}>
        <LegalAdviceDetails selected={current} onClose={() => navigate(-1)} />
      </Suspense>
    </div>
  );
}
