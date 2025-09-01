import { lazy, Suspense, useState, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useContracts, useContractCategories } from "@/hooks/dataHooks";
import { deleteContract } from "@/services/api/contracts";
import { toast } from "sonner";
import { AuthContext } from "@/context/AuthContext";

const ContractDetails = lazy(() => import("../components/Contracts/ContractDetails"));
const ContractModal = lazy(() => import("../components/Contracts/ContractModal"));
const GlobalConfirmDeleteModal = lazy(() => import("../components/common/GlobalConfirmDeleteModal"));

export default function ContractDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { hasPermission } = useContext(AuthContext);
  const { data, refetch } = useContracts();
  const { data: categoriesData } = useContractCategories();
  const contracts = data?.data?.data || [];
  const initialContract = location.state || contracts.find((c) => c.id === Number(id));
  const [current, setCurrent] = useState(initialContract);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!current) {
    return <div className="p-4">لا توجد بيانات</div>;
  }

  const reloadContract = async () => {
    const res = await refetch();
    const list = res?.data?.data || [];
    const updated = list.find((c) => c.id === current.id);
    if (updated) setCurrent(updated);
  };

  const handleDelete = async () => {
    try {
      await deleteContract(current.id);
      toast.success("تم حذف العقد بنجاح");
      await refetch();
      navigate(-1);
    } catch {
      toast.error("فشل حذف العقد");
    } finally {
      setConfirmDelete(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="mb-4 flex gap-2">
        <Button onClick={() => navigate(-1)}>رجوع</Button>
        {hasPermission("edit contracts") && (
          <Button onClick={() => setIsModalOpen(true)}>تعديل</Button>
        )}
        {hasPermission("delete contracts") && (
          <Button variant="destructive" onClick={() => setConfirmDelete(true)}>حذف</Button>
        )}
      </div>
      <Suspense fallback={<div>تحميل التفاصيل...</div>}>
        <ContractDetails selected={current} onClose={() => navigate(-1)} />
      </Suspense>

      <Suspense fallback={null}>
        {isModalOpen && (
          <ContractModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            initialData={current}
            categories={categoriesData || []}
            reloadContracts={reloadContract}
          />
        )}
        {confirmDelete && (
          <GlobalConfirmDeleteModal
            isOpen={confirmDelete}
            onClose={() => setConfirmDelete(false)}
            onConfirm={handleDelete}
            itemName={current.number}
          />
        )}
      </Suspense>
    </div>
  );
}
