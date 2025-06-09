import React from 'react';
import { useRecentData } from '@/hooks/dataHooks';
import DataCard from './DataCard';
import HomeSpinner from '@/components/common/Spinners/HomeSpinner'
import { ReceiptText } from 'lucide-react';

const RecentItems = () => {
  const { data: recentData, isLoading, isError } = useRecentData();

  const {
    latestAddedContracts = [],
    latestUpdatedContracts = [],
    latestInvestigationActions = [],
    latestLitigationActions = [],
  } = recentData || {};

  if (isLoading) {
    return (
      <div className="text-center pt-16 py-4">
   <HomeSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-4 text-red-500 font-bold">
        فشل في تحميل البيانات
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
      <DataCard
        title="أحدث العقود المضافة"
        items={latestAddedContracts}
        type="contracts"
        icon={<ReceiptText />}
      />
      <DataCard
        title="أحدث العقود المحدثة"
        items={latestUpdatedContracts}
        type="contracts"
      />
      <DataCard
        title="أحدث إجراءات التحقيقات"
        items={latestInvestigationActions}
        type="investigation_actions"
      />
      <DataCard
        title="أحدث إجراءات القضايا"
        items={latestLitigationActions}
        type="litigation_actions"
      />
    </div>
  );
};

export default RecentItems;
