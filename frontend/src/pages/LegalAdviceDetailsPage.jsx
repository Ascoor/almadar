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
  const advices = data?.data || [];
  const current = location.state || advices.find((a) => a.id === Number(id));

  if (!current) {
    return <div className="p-4">لا توجد بيانات</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="mb-4">
        <Button onClick={() => navigate(-1)}>رجوع</Button>
      </div>
      <Suspense fallback={<div>تحميل التفاصيل...</div>}>
        <LegalAdviceDetails selected={current} onClose={() => navigate(-1)} />
      </Suspense>
    </div>
  );
}
