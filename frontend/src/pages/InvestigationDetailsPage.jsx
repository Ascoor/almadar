import { lazy, Suspense, useState, useContext } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useInvestigations } from "@/hooks/dataHooks";
import { updateInvestigation, deleteInvestigation } from "@/services/api/investigations";
import { toast } from "sonner";
import { AuthContext } from "@/context/AuthContext";

const InvestigationActionsTable = lazy(() => import("@/components/Investigations/InvestigationActionsTable"));
const InvestigationModal = lazy(() => import("@/components/Investigations/InvestigationModal"));
const GlobalConfirmDeleteModal = lazy(() => import("@/components/common/GlobalConfirmDeleteModal"));

export default function InvestigationDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { hasPermission } = useContext(AuthContext);
  const { data, refetch } = useInvestigations();
  const investigations = data?.data?.data || [];
  const initialInvestigation = location.state || investigations.find((i) => i.id === Number(id));
  const [current, setCurrent] = useState(initialInvestigation);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!current) {
    return <div className="p-4">لا توجد بيانات</div>;
  }

  const reloadInvestigation = async () => {
    const res = await refetch();
    const list = res?.data?.data || [];
    const updated = list.find((i) => i.id === current.id);
    if (updated) setCurrent(updated);
  };

  const handleSave = async (form) => {
    try {
      await updateInvestigation(current.id, form);
      toast.success("تم التعديل بنجاح");
      setIsModalOpen(false);
      await reloadInvestigation();
    } catch {
      toast.error("فشل في التعديل");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteInvestigation(current.id);
      toast.success("تم حذف التحقيق بنجاح");
      await refetch();
      navigate(-1);
    } catch {
      toast.error("فشل حذف التحقيق");
    } finally {
      setConfirmDelete(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="mb-4 flex gap-2">
        <Button onClick={() => navigate(-1)}>رجوع</Button>
        {hasPermission("edit investigations") && (
          <Button onClick={() => setIsModalOpen(true)}>تعديل</Button>
        )}
        {hasPermission("delete investigations") && (
          <Button variant="destructive" onClick={() => setConfirmDelete(true)}>حذف</Button>
        )}
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
        <InvestigationActionsTable investigationId={current.id} reloadInvestigations={refetch} />
      </Suspense>

      <Suspense fallback={null}>
        {isModalOpen && (
          <InvestigationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            initialData={current}
            onSubmit={handleSave}
          />
        )}
        {confirmDelete && (
          <GlobalConfirmDeleteModal
            isOpen={confirmDelete}
            onClose={() => setConfirmDelete(false)}
            onConfirm={handleDelete}
            itemName={current.employee_name}
          />
        )}
      </Suspense>
    </div>
  );
}
