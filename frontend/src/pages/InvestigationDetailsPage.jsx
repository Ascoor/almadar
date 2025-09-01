import { lazy, Suspense, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useInvestigations } from "@/hooks/dataHooks";

const InvestigationActionsTable = lazy(() =>
  import("@/features/investigations/components/InvestigationActionsTable")
);

export default function InvestigationDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const { data, refetch } = useInvestigations();
  const investigations = data?.data?.data || [];
  const initial = location.state || investigations.find((i) => i.id === Number(id));

  const [current] = useState(initial || null);

  if (!current) {
    return <div className="p-4">لا توجد بيانات</div>;
  }


  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="mb-4 flex gap-2">
        <Button onClick={() => navigate(-1)}>رجوع</Button>
      </div>

      <div className="mb-6 p-4 bg-card text-fg rounded-xl shadow">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <span className="font-semibold">الموظف: </span>
            {current.employee_name}
          </div>
          <div>
            <span className="font-semibold">الجهة المحيلة: </span>
            {current.source}
          </div>
          <div>
            <span className="font-semibold">الموضوع: </span>
            {current.subject}
          </div>
          <div>
            <span className="font-semibold">رقم القضية: </span>
            {current.case_number}
          </div>
          <div>
            <span className="font-semibold">الحالة: </span>
            {current.status}
          </div>
        </div>
      </div>

      <Suspense fallback={<div>تحميل البيانات...</div>}>
        <InvestigationActionsTable
          investigationId={current.id}
          reloadInvestigations={refetch}
        />
      </Suspense>

    </div>
  );
}
