import DemoEntityDetails from '@/features/data-spike/components/DemoEntityDetails';

const DataFetchingSpike = () => {
  return (
    <div className="space-y-4 p-4">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
          data fetching spike
        </p>
        <h1 className="text-xl font-bold text-gray-900">معمارية البيانات والكاش</h1>
        <p className="text-sm text-gray-600">
          نموذج مصغر يوضح كيفية فصل طبقة الجلب، إدارة الحالة (React Query)، وحالات العرض
          للواجهات المتقدمة.
        </p>
      </header>
      <DemoEntityDetails entityId="case-1042" />
    </div>
  );
};

export default DataFetchingSpike;
