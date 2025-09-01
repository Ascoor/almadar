import { lazy, Suspense, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLitigations } from "@/hooks/dataHooks";

const LitigationActionsTable = lazy(() =>
  import("@/features/litigations/components/LitigationActionsTable")
);

export default function LitigationDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const { data, refetch } = useLitigations();
  const litigations = data?.data?.data || [];
  const initialLitigation =
    location.state || litigations.find((l) => l.id === Number(id));

  const [current] = useState(initialLitigation);

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
            <span className="font-semibold">رقم الدعوى: </span>
            {current.case_number}
          </div>
          <div>
            <span className="font-semibold">المحكمة: </span>
            {current.court}
          </div>
          <div>
            <span className="font-semibold">الخصم: </span>
            {current.opponent}
          </div>
          <div>
            <span className="font-semibold">الموضوع: </span>
            {current.subject}
          </div>
          <div>
            <span className="font-semibold">الحالة: </span>
            {current.status}
          </div>
        </div>
      </div>

      <Suspense fallback={<div>تحميل البيانات...</div>}>
        <LitigationActionsTable
          litigationId={current.id}
          scope={current.scope}
          reloadLitigations={refetch}
        />
      </Suspense>

    </div>
  );
}
