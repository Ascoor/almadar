import { useState, lazy, Suspense } from "react";
  import { toast } from "sonner";
  import {
    createInvestigation,
    updateInvestigation,
    deleteInvestigation,
  } from "@/services/api/investigations";
  import { ChevronDown, ChevronRight } from "lucide-react";
  import { motion } from 'framer-motion';
  import TableComponent from "@/components/common/TableComponent";
  import SectionHeader from "@/components/common/SectionHeader"; 
  import { Button } from "@/components/ui/button"; 
  import { InvestigationSection } from "@/assets/icons"; 
  import { useInvestigations } from "../hooks/dataHooks";
const InvestigationModal = lazy(() => import("@/components/Investigations/InvestigationModal"));
const InvestigationActionsTable = lazy(() => import("@/components/Investigations/InvestigationActionsTable"));
const GlobalConfirmDeleteModal = lazy(() => import("@/components/common/GlobalConfirmDeleteModal"));

  export default function InvestigationsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const [toDelete, setToDelete] = useState(null);

    const moduleName = "investigations";
    const { data, isLoading, refetch } = useInvestigations();
    const investigations = data?.data?.data || [];

    const handleSave = async (formData) => {
      try {
        if (editingItem) {
          await updateInvestigation(editingItem.id, formData);
          toast.success("تم التعديل بنجاح");
        } else {
          await createInvestigation(formData);
          toast.success("تمت الإضافة بنجاح");
        }
        setIsModalOpen(false);
        setEditingItem(null);
        await refetch();
      } catch {
        toast.error("فشل في الحفظ");
      }
    };

    const handleEdit = (row) => {
      setEditingItem(row);
      setIsModalOpen(true);
    };

    const handleDelete = async () => {
      if (!toDelete) return;
      try {
        await deleteInvestigation(toDelete.id);
        toast.success("تم حذف التحقيق بنجاح");
        await refetch();
      } catch {
        toast.error("فشل حذف التحقيق");
      } finally {
        setToDelete(null);
      }
    };

    const toggleRowExpand = (id) => {
      setExpandedId((prev) => (prev === id ? null : id));
    };

    const headers = [
      { key: "expand", text: "" },
      { key: "employee_name", text: "الموظف" },
      { key: "source", text: "الجهة المحيلة" },
      { key: "subject", text: "الموضوع" },
      { key: "case_number", text: "رقم القضية" },
      { key: "status", text: "الحالة" },
    ];

    const customRenderers = {
      expand: (row) => (
        <button onClick={(e) => { e.stopPropagation(); toggleRowExpand(row.id); }}>
          {expandedId === row.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      ),
      status: (row) => (
        <span className="font-semibold text-red-600 dark:text-yellow-300">
          {row.status}
        </span>
      ),
    };

    return (
      <div className="p-6 min-h-screen">
        <motion.div
          key="header"
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ type: 'spring', stiffness: 70, damping: 14 }}
        >
          <SectionHeader icon={InvestigationSection} listName="قسم التحقيقات" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: 'spring', stiffness: 60, damping: 14, delay: 0.1 }}
          className="rounded-xl bg-card text-card-foreground p-4 shadow-md"
        >
          <TableComponent
            title="قسم التحقيقات القانونية"
            data={investigations}
            headers={headers} 
            customRenderers={customRenderers}
            moduleName={moduleName}
            renderAddButton={{
              render: () => (
                <Button variant="default" onClick={() => setIsModalOpen(true)}>
                  إضافة تحقيق جديد
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </Button>
              ),
            }}
            onEdit={handleEdit}
            onDelete={(row) => setToDelete(row)}
            expandedRowRenderer={(row) =>
              expandedId === row.id && (
                <tr>
                  <td colSpan={headers.length + 2} className="p-4 bg-gray-50 dark:bg-gray-800">
                    <Suspense fallback={<div>تحميل البيانات...</div>}>
                    <InvestigationActionsTable
                      investigationId={row.id}
                      actions={row.actions || []}
                      reloadInvestigations={refetch}
                    />
                  </Suspense>
                  </td>
                </tr>
              )
            }
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
            initialData={editingItem}
            onSubmit={handleSave}
          />
        )}
        {toDelete && (
          <GlobalConfirmDeleteModal
            isOpen={!!toDelete}
            onClose={() => setToDelete(null)}
            onConfirm={handleDelete}
            itemName={toDelete?.employee_name}
          />
        )}
      </Suspense>
      </div>
    );
  }
