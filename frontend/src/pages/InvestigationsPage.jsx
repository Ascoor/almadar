import { useState, lazy, Suspense } from "react";
import { toast } from "sonner";
import {
  createInvestigation,
  updateInvestigation,
  deleteInvestigation,
} from "@/services/api/investigations";
import { motion } from "framer-motion";
import TableComponent from "@/components/common/TableComponent";
import SectionHeader from "@/components/common/SectionHeader";
import { Button } from "@/components/ui/button";
import { InvestigationSection } from "@/assets/icons";
import { useInvestigations } from "@/hooks/dataHooks";
import { useNavigate } from "react-router-dom";

const InvestigationModal = lazy(() =>
  import("@/components/Investigations/InvestigationModal")
);
const GlobalConfirmDeleteModal = lazy(() =>
  import("@/components/common/GlobalConfirmDeleteModal")
);

export default function InvestigationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const navigate = useNavigate();

  const moduleName = "investigations";
  const { data, refetch } = useInvestigations();
  const investigations = data?.data?.data || [];

  const headers = [
    { key: "employee_name", text: "الموظف" },
    { key: "source", text: "الجهة المحيلة" },
    { key: "subject", text: "الموضوع" },
    { key: "case_number", text: "رقم القضية" },
    { key: "status", text: "الحالة" },
  ];

  const customRenderers = {
    status: (row) => (
      <span className="font-semibold text-red-600 dark:text-yellow-300">
        {row.status}
      </span>
    ),
  };

  const openCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (row) => {
    setEditingItem(row);
    setIsModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem?.id) {
        await updateInvestigation(editingItem.id, formData);
        toast.success("تم تحديث التحقيق بنجاح");
      } else {
        await createInvestigation(formData);
        toast.success("تمت إضافة التحقيق بنجاح");
      }
      setIsModalOpen(false);
      setEditingItem(null);
      await refetch();
    } catch {
      toast.error("حدث خطأ أثناء الحفظ");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteInvestigation(toDelete.id);
      toast.success("تم حذف التحقيق بنجاح");
      setToDelete(null);
      await refetch();
    } catch {
      toast.error("فشل حذف التحقيق");
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <motion.div
        key="header"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ type: "spring", stiffness: 70, damping: 14 }}
      >
        <SectionHeader icon={InvestigationSection} listName="قسم التحقيقات" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ type: "spring", stiffness: 60, damping: 14, delay: 0.1 }}
        className="rounded-xl bg-card text-fg p-4 shadow-md"
      >
        <TableComponent
          title="قسم التحقيقات القانونية"
          data={investigations}
          headers={headers}
          customRenderers={customRenderers}
          moduleName={moduleName}
          renderAddButton={{
            render: () => (
              <Button variant="default" onClick={openCreate}>
                إضافة تحقيق جديد
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </Button>
            ),
          }}
          onEdit={handleEdit}
          onDelete={(row) => setToDelete(row)}
          onRowClick={(row) => navigate(`/legal/investigations/${row.id}`, { state: row })}
        />
      </motion.div>

      <Suspense fallback={null}>
        {isModalOpen && (
          <InvestigationModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingItem(null);
            }}
            initialData={editingItem || undefined}
            onSubmit={handleSave}
          />
        )}

        {toDelete && (
          <GlobalConfirmDeleteModal
            isOpen
            onClose={() => setToDelete(null)}
            onConfirm={handleDelete}
            title="تأكيد حذف التحقيق"
            description={`هل تريد حذف تحقيق الموظف ${toDelete.employee_name ?? ""}؟ لا يمكن التراجع عن هذه العملية.`}
            confirmText="حذف"
            cancelText="إلغاء"
          />
        )}
      </Suspense>
    </div>
  );
}
