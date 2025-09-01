import { lazy, Suspense, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLegalAdvices } from "@/hooks/dataHooks";

const LegalAdviceDetails = lazy(() =>
  import("@/features/legal-advices/components/LegalAdviceDetails")
);

export default function LegalAdviceDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  // البيانات الأساسية
  const { data } = useLegalAdvices();
  const advices = data?.data || [];

  // تحديد المشورة الحالية
  const initialAdvice = location.state || advices.find((a) => a.id === Number(id));
  const [current] = useState(initialAdvice);

  if (!current) {
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
        <LegalAdviceDetails selected={current} onClose={() => navigate(-1)} />
      </Suspense>

    </div>
  );
}
