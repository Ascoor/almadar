import { lazy, Suspense, useState, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useLitigations } from "@/hooks/dataHooks";
import { deleteLitigation } from "@/services/api/litigations";
import { toast } from "sonner";
import { AuthContext } from "@/context/AuthContext";

const LitigationActionsTable = lazy(() =>
  import("@/components/Litigations/LitigationActionsTable")
);
const LitigationModal = lazy(() =>
  import("@/components/Litigations/LitigationModal")
);
const GlobalConfirmDeleteModal = lazy(() =>
  import("@/components/common/GlobalConfirmDeleteModal")
);

export default function LitigationDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { hasPermission } = useContext(AuthContext);

  const { data, refetch } = useLitigations();
  const litigations = data?.data?.data || [];
  const initialLitigation =
    location.state || litigations.find((l) => l.id === Number(id));

  const [current, setCurrent] = useState(initialLitigation);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!current) {
    return <div className="p-4">لا توجد بيانات</div>;
  }

  const reloadLitigation = async () => {
    const res = await refetch();
    const list = res?.data?.data || [];
    const updated = list.find((l) => l.id === current.id);
    if (updated) setCurrent(updated);
  };

  const handleDelete = async () => {
    try {
      await deleteLitigation(current.id);
      toast.success("تم حذف الدعوى بنجاح");
      await refetch();
      navigate(-1);
    } catch {
      toast.error("فشل حذف الدعوى");
    } finally {
      setConfirmDelete(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="mb-4 flex gap-2">
        <Button onClick={() => navigate(-1)}>رجوع</Button>

        {hasPermission(`edit litigation-${current.scope}`) && (
          <Button onClick={() => setIsModalOpen(true)}>تعديل</Button>
        )}

        {hasPermission(`delete litigation-${current.scope}`) && (
          <Button variant="destructive" onClick={() => setConfirmDelete(true)}>
            حذف
          </Button>
        )}
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

      <Suspense fallback={null}>
        {isModalOpen && (
          <LitigationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            initialData={current}
            reloadLitigations={reloadLitigation}
          />
        )}

        {confirmDelete && (
          <GlobalConfirmDeleteModal
            isOpen={confirmDelete}
            onClose={() => setConfirmDelete(false)}
            onConfirm={handleDelete}
            title="تأكيد حذف الدعوى"
            description={`هل تريد حذف الدعوى رقم: ${current.case_number ?? ""}؟ لا يمكن التراجع عن هذه العملية.`}
            confirmText="حذف"
            cancelText="إلغاء"
          />
        )}
      </Suspense>
    </div>
  );
}
