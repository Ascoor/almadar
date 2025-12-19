import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useContracts } from '@/hooks/dataHooks';
import { getContractById } from '@/services/api/contracts';
import GlobalSpinner from '@/components/common/Spinners/GlobalSpinner';

const ContractDetails = lazy(
  () => import('@/features/contracts/components/ContractDetails'),
);

export default function ContractDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const { data } = useContracts();

  const contracts = data?.data?.data || [];
  const initialContract =
    location.state || contracts.find((c) => c.id === Number(id));

  const [current, setCurrent] = useState(initialContract || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const lastFetchedId = useRef(null);

  useEffect(() => {
    if (initialContract) setCurrent(initialContract);
  }, [initialContract]);

  useEffect(() => {
    if (!id) return;
    if (current?.id && String(current.id) === String(id)) return;

    const sid = String(id);
    if (lastFetchedId.current === sid) return;
    lastFetchedId.current = sid;

    const controller = new AbortController();
    setLoading(true);
    setError('');

    getContractById(id, { signal: controller.signal })
      .then((res) => setCurrent(res.data?.data ?? res.data))
      .catch((err) => {
        if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED')
          return;
        setCurrent(null);
        setError('لا توجد بيانات لهذا العقد أو لا تملك صلاحية.');
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
      <div className="mb-4 flex gap-2">
        <Button onClick={() => navigate(-1)}>رجوع</Button>
      </div>

      <Suspense fallback={<div>تحميل التفاصيل...</div>}>
        <ContractDetails selected={current} onClose={() => navigate(-1)} />
      </Suspense>
    </div>
  );
}
