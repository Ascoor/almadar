import { lazy, Suspense } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useLitigations } from "@/hooks/dataHooks";

const LitigationActionsTable = lazy(() => import("@/components/Litigations/LitigationActionsTable"));

export default function LitigationDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { data, refetch } = useLitigations();
  const litigations = data?.data?.data || [];
  const litigation = location.state || litigations.find((l) => l.id === Number(id));

  if (!litigation) {
    return <div className="p-4">لا توجد بيانات</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <Button onClick={() => navigate(-1)} className="mb-4">
        رجوع
      </Button> 
      <div className="mb-6 p-4 bg-card text-fg rounded-xl shadow">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <span className="font-semibold">رقم الدعوى: </span>
            {litigation.case_number}
          </div>
          <div>
            <span className="font-semibold">المحكمة: </span>
            {litigation.court}
          </div>
          <div>
            <span className="font-semibold">الخصم: </span>
            {litigation.opponent}
          </div>
          <div>
            <span className="font-semibold">الموضوع: </span>
            {litigation.subject}
          </div>
          <div>
            <span className="font-semibold">الحالة: </span>
            {litigation.status}
          </div>
        </div>
      </div> 
      <Suspense fallback={<div>تحميل البيانات...</div>}>
        <LitigationActionsTable litigationId={litigation.id} scope={litigation.scope} reloadLitigations={refetch} />
      </Suspense>
    </div>
  );
}
