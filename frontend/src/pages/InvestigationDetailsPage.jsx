import { lazy, Suspense } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useInvestigations } from "@/hooks/dataHooks";

const InvestigationActionsTable = lazy(() => import("@/components/Investigations/InvestigationActionsTable"));

export default function InvestigationDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { data, refetch } = useInvestigations();
  const investigations = data?.data?.data || [];
  const investigation = location.state || investigations.find((i) => i.id === Number(id));

  if (!investigation) {
    return <div className="p-4">لا توجد بيانات</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <Button onClick={() => navigate(-1)} className="mb-4">
        رجوع
      </Button>
      <Suspense fallback={<div>تحميل البيانات...</div>}>
        <InvestigationActionsTable investigationId={investigation.id} reloadInvestigations={refetch} />
      </Suspense>
    </div>
  );
}
