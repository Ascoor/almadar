import { useEffect, useRef, useState } from 'react';
import GlobalSpinner from '@/components/common/Spinners/GlobalSpinner';
import { getInvestigationById } from '@/services/api/investigations';

export default function InvestigationDetailsSmart({ id, selected, children }) {
  const [current, setCurrent] = useState(selected ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const lastFetchedId = useRef(null);

  // ✅ عرض بيانات الجدول فورًا
  useEffect(() => {
    if (selected) setCurrent(selected);
  }, [selected]);

  // ✅ fetch by id (Notifications/URL)
  useEffect(() => {
    if (!id) return;

    if (current?.id && String(current.id) === String(id)) return;

    const sid = String(id);
    if (lastFetchedId.current === sid) return;
    lastFetchedId.current = sid;

    const controller = new AbortController();
    setLoading(true);
    setError('');

    getInvestigationById(id, { signal: controller.signal })
      .then((res) => setCurrent(res.data?.data ?? res.data))
      .catch((err) => {
        if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED')
          return;
        setCurrent(null);
        setError('لا توجد بيانات لهذا التحقيق أو لا تملك صلاحية.');
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading && !current) return <GlobalSpinner />;

  if (!current) {
    return (
      <div className="p-6 text-center text-red-500">
        {error || 'لا توجد بيانات'}
      </div>
    );
  }

  // ✅ render-prop
  return typeof children === 'function' ? children(current) : null;
}
