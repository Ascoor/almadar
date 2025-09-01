import { lazy, Suspense } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useContracts } from "@/hooks/dataHooks";

const ContractDetails = lazy(() => import("../components/Contracts/ContractDetails"));

export default function ContractDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { data } = useContracts();
  const contracts = data?.data?.data || [];
  const contract = location.state || contracts.find((c) => c.id === Number(id));

  if (!contract) {
    return <div className="p-4">لا توجد بيانات</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <Button onClick={() => navigate(-1)} className="mb-4">
        رجوع
      </Button>
      <Suspense fallback={<div>تحميل التفاصيل...</div>}>
        <ContractDetails selected={contract} onClose={() => navigate(-1)} />
      </Suspense>
    </div>
  );
}
