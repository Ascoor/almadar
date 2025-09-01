import { lazy, Suspense, useState, useContext } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useLegalAdvices, useAdviceTypes } from "@/hooks/dataHooks";
import { deleteLegalAdvice } from "@/services/api/legalAdvices";
import { toast } from "sonner";
import { AuthContext } from "@/context/AuthContext";

const LegalAdviceDetails = lazy(() => import("../components/LegalAdvices/LegalAdviceDetails"));
const LegalAdviceModal = lazy(() => import("../components/LegalAdvices/LegalAdviceModal"));
const GlobalConfirmDeleteModal = lazy(() => import("../components/common/GlobalConfirmDeleteModal"));

export default function LegalAdviceDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { hasPermission } = useContext(AuthContext);
  const { data, refetch } = useLegalAdvices();
  const { data: typesData } = useAdviceTypes();
  const advices = data?.data || [];
  const initialAdvice = location.state || advices.find((a) => a.id === Number(id));
  const [current, setCurrent] = useState(initialAdvice);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!current) {
    return <div className="p-4">لا توجد بيانات</div>;
  }

  const reloadAdvice = async () => {
    const res = await refetch();
    const list = res?.data || [];
    const updated = list.find((a) => a.id === current.id);
    if (updated) setCurrent(updated);
  };

  const handleDelete = async () => {
    try {
      await deleteLegalAdvice(current.id);
      toast.success("تم حذف المشورة بنجاح");
      await refetch();
      navigate(-1);
    } catch {
      toast.error("فشل حذف المشورة");
    } finally {
      setConfirmDelete(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="mb-4 flex gap-2">
        <Button onClick={() => navigate(-1)}>رجوع</Button>
        {hasPermission("edit legaladvices") && (
          <Button onClick={() => setIsModalOpen(true)}>تعديل</Button>
        )}
        {hasPermission("delete legaladvices") && (
          <Button variant="destructive" onClick={() => setConfirmDelete(true)}>حذف</Button>
        )}
      </div>
      <Suspense fallback={<div>تحميل التفاصيل...</div>}>
        <LegalAdviceDetails selected={current} onClose={() => navigate(-1)} />
      </Suspense>

      <Suspense fallback={null}>
        {isModalOpen && (
          <LegalAdviceModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            adviceTypes={typesData || []}
            initialData={current}
            reload={async () => {
              await reloadAdvice();
            }}
          />
        )}
        {confirmDelete && (
          <GlobalConfirmDeleteModal
            isOpen={confirmDelete}
            onClose={() => setConfirmDelete(false)}
            onConfirm={handleDelete}
            itemName={current.topic}
          />
        )}
      </Suspense>
    </div>
  );
}
