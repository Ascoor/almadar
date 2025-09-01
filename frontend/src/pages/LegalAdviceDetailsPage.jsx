import { lazy, Suspense, useState, useContext } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useLegalAdvices, useAdviceTypes } from "@/hooks/dataHooks";
import { deleteLegalAdvice } from "@/services/api/legalAdvices";
import { toast } from "sonner";
import { AuthContext } from "@/context/AuthContext";

const LegalAdviceDetails = lazy(() =>
  import("../components/LegalAdvices/LegalAdviceDetails")
);
const LegalAdviceModal = lazy(() =>
  import("../components/LegalAdvices/LegalAdviceModal")
);
const GlobalConfirmDeleteModal = lazy(() =>
  import("../components/common/GlobalConfirmDeleteModal")
);

export default function LegalAdviceDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { hasPermission } = useContext(AuthContext);

  // البيانات الأساسية
  const { data, refetch } = useLegalAdvices();
  const { data: typesData } = useAdviceTypes();
  const advices = data?.data || [];

  // تحديد المشورة الحالية
  const initialAdvice = location.state || advices.find((a) => a.id === Number(id));
  const [current, setCurrent] = useState(initialAdvice);

  // مودالات
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!current) {
    return <div className="p-4">لا توجد بيانات</div>;
  }

  // إعادة تحميل بيانات المشورة بعد التعديل
  const reloadAdvice = async () => {
    try {
      const res = await refetch();
      const list = res?.data || [];
      const updated = list.find((a) => a.id === current.id);
      if (updated) setCurrent(updated);
    } catch {
      toast.error("فشل تحديث البيانات");
    }
  };

  // حذف المشورة
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
      {/* أزرار التحكم */}
      <div className="mb-4 flex gap-2">
        <Button onClick={() => navigate(-1)}>رجوع</Button>

        {hasPermission("edit legaladvices") && (
          <Button onClick={() => setIsModalOpen(true)}>تعديل</Button>
        )}

        {hasPermission("delete legaladvices") && (
          <Button variant="destructive" onClick={() => setConfirmDelete(true)}>
            حذف
          </Button>
        )}
      </div>

      {/* تفاصيل المشورة */}
      <Suspense fallback={<div>تحميل التفاصيل...</div>}>
        <LegalAdviceDetails selected={current} onClose={() => navigate(-1)} />
      </Suspense>

      {/* مودال تعديل وحذف */}
      <Suspense fallback={null}>
        {isModalOpen && (
          <LegalAdviceModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            adviceTypes={typesData || []}
            initialData={current}
            reload={reloadAdvice}
          />
        )}

        {confirmDelete && (
          <GlobalConfirmDeleteModal
            isOpen={confirmDelete}
            onClose={() => setConfirmDelete(false)}
            onConfirm={handleDelete}
            title="تأكيد حذف المشورة"
            description={`هل تريد حذف المشورة: ${current.topic ?? ""}؟ لا يمكن التراجع عن هذه العملية.`}
            confirmText="حذف"
            cancelText="إلغاء"
          />
        )}
      </Suspense>
    </div>
  );
}
