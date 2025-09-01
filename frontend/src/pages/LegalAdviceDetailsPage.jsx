import { lazy, Suspense } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useLegalAdvices } from "@/hooks/dataHooks";

const LegalAdviceDetails = lazy(() => import("../components/LegalAdvices/LegalAdviceDetails"));

export default function LegalAdviceDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { data } = useLegalAdvices();
  const advice = location.state || data?.data?.find((a) => a.id === Number(id));

  if (!advice) {
    return <div className="p-4">لا توجد بيانات</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <Button onClick={() => navigate(-1)} className="mb-4">
        رجوع
      </Button>
      <Suspense fallback={<div>تحميل التفاصيل...</div>}>
        <LegalAdviceDetails selected={advice} onClose={() => navigate(-1)} />
      </Suspense>
    </div>
  );
}
