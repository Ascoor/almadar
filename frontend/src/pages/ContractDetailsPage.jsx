import { lazy, Suspense, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useContract, useContracts } from '@/hooks/dataHooks';

const ContractDetails = lazy(
  () => import('@/features/contracts/components/ContractDetails'),
);

export default function ContractDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const { data } = useContracts();

  const contracts = data?.data?.data || [];
  const initialContract = useMemo(
    () => location.state || contracts.find((c) => c.id === Number(id)),
    [contracts, id, location.state],
  );

  const shouldFetchSingle = Boolean(id);
  const {
    data: contractData,
    isLoading: isContractLoading,
    isFetching: isContractFetching,
  } = useContract(id, {
    enabled: shouldFetchSingle,
  });

  const resolvedContract = initialContract || contractData;

  if (isContractLoading || (isContractFetching && !resolvedContract)) {
    return <div className="p-4">جارٍ تحميل بيانات العقد...</div>;
  }

  if (!resolvedContract) {
    return <div className="p-4">لا توجد بيانات</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="mb-4 flex gap-2">
        <Button onClick={() => navigate(-1)}>رجوع</Button>
      </div>

      <Suspense fallback={<div>تحميل التفاصيل...</div>}>
        <ContractDetails
          selected={resolvedContract}
          onClose={() => navigate(-1)}
        />
      </Suspense>
    </div>
  );
}
