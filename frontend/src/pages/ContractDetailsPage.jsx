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
  const current = location.state || contracts.find((c) => c.id === Number(id));

  if (!current) {
    return <div className="p-4">لا توجد بيانات</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="mb-4">
        <Button onClick={() => navigate(-1)}>رجوع</Button>
      </div>
      <Suspense fallback={<div>تحميل التفاصيل...</div>}>
        <ContractDetails selected={current} onClose={() => navigate(-1)} />
      </Suspense>
    </div>
  );
}
