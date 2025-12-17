import { useEffect, useRef, useState } from 'react';
import { getContractById } from '@/services/api/contracts';
import ContractDetails from '@/features/contracts/components/ContractDetails';
import GlobalSpinner from '@/components/common/Spinners/GlobalSpinner';

export default function ContractDetailsSmart({ id, selected, onClose }) {
  const [current, setCurrent] = useState(selected ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const lastFetchedId = useRef(null);

  useEffect(() => {
    if (selected) setCurrent(selected);
  }, [selected]);

  useEffect(() => {
    if (!id) return;

    // ✅ أول ما ندخل على /contracts/:id بدون selected
    if (!current) setLoading(true);

    if (current?.id && String(current.id) === String(id)) return;

    const sid = String(id);
    if (lastFetchedId.current === sid) return;
    lastFetchedId.current = sid;

    const controller = new AbortController();
    setError(false);
    setLoading(true);

    getContractById(id, { signal: controller.signal })
      .then((res) => {
        setCurrent(res.data?.data ?? res.data);
      })
      .catch((err) => {
        if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED')
          return;
        setError(true);
        setCurrent(null);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ✅ ما عاد فيه صفحة بيضاء
  if (loading) return <GlobalSpinner />;

  if (error || !current) {
    return (
      <div className="p-6 text-center text-red-500">
        لم يتم العثور على العقد
      </div>
    );
  }

  return <ContractDetails selected={current} onClose={onClose} />;
}
