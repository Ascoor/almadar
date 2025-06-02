import React, { useEffect, useState } from 'react';
import { getAllRecentData } from '../../services/api/dashboard'; // استيراد خدمة جلب البيانات
import DataCard from './DataCard'; // استيراد مكون DataCard
import {ReceiptText } from 'lucide-react';
const RecentItems = () => {
  const [data, setData] = useState({
    latestAddedContracts: [],
    latestUpdatedContracts: [],
    latestInvestigationActions: [],
    latestLitigationActions: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllRecentData(); // جلب البيانات من الخادم
      setData(response); // تخزين البيانات المسترجعة في الحالة
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* عرض أول كارتين في سطر واحد */}
      <div className="flex justify-center">
        <DataCard
          title="أحدث العقود المضافة"
          items={data.latestAddedContracts} // تمرير بيانات العقود المضافة
          type="contracts" // تم تمرير نوع البيانات
          icon={<ReceiptText  />}
        />
      </div>
      <div className="flex justify-center">
        <DataCard
          title="أحدث العقود المحدثة"
          items={data.latestUpdatedContracts} // تمرير بيانات العقود المحدثة
          type="contracts"
        />
      </div>

      {/* عرض ثاني كارتين في سطر واحد */}
      <div className="flex justify-center">
        <DataCard
          title="أحدث إجراءات التحقيقات"
          items={data.latestInvestigationActions} // تمرير بيانات التحقيقات
          type="investigation_actions"
        />
      </div>
      <div className="flex justify-center">
        <DataCard
          title="أحدث إجراءات القضايا"
          items={data.latestLitigationActions} // تمرير بيانات القضايا
          type="litigation_actions"
        />
      </div>
    </div>
  );
};

export default RecentItems;
