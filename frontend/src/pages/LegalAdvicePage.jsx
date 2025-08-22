import { useState, useContext, lazy, Suspense } from "react";
import { toast } from 'sonner';
import { deleteLegalAdvice } from "@/services/api/legalAdvices";
import { getAdviceTypes } from "../services/api/adviceTypes.js";
import TableComponent from "../components/common/TableComponent";
import SectionHeader from "../components/common/SectionHeader";
import { Button } from "../components/ui/button";
import { LegalAdviceIcon } from "../assets/icons";
import { AuthContext } from "@/components/auth/AuthContext";
import { motion } from 'framer-motion';

import { useLegalAdvices } from "@/hooks/dataHooks"; // ✅ من React Query
import { useQuery } from "@tanstack/react-query"; // لاستدعاء أنواع المشورة
import API_CONFIG  from "@/config/config";
const LegalAdviceModal = lazy(() => import("../components/LegalAdvices/LegalAdviceModal"));
const LegalAdviceDetails = lazy(() => import("../components/LegalAdvices/LegalAdviceDetails"));
const GlobalConfirmDeleteModal = lazy(() => import("../components/common/GlobalConfirmDeleteModal"));

export default function LegalAdvicePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdvice, setEditingAdvice] = useState(null);
  const [selectedAdvice, setSelectedAdvice] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { hasPermission } = useContext(AuthContext);
  const moduleName = "legaladvices";
  const can = (action) => hasPermission(`${action} ${moduleName}`);

  // ✅ جلب البيانات
  const { data: advicesData, refetch: refetchAdvices } = useLegalAdvices();
  const { data: adviceTypesData } = useQuery({
    queryKey: ['adviceTypes'],
    queryFn: getAdviceTypes
  });

  const advices = advicesData?.data || [];
  const adviceTypes = adviceTypesData?.data || [];

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteLegalAdvice(deleteTarget.id);
      toast.success("تم حذف المشورة بنجاح");
      await refetchAdvices(); // ✅ استخدم refetch من react-query
    } catch {
      toast.error("فشل حذف المشورة");
    } finally {
      setDeleteTarget(null);
    }
  };

  const getAdviceTypeName = (typeId) => {
    const type = adviceTypes.find((t) => t.id === typeId);
    return type ? type.type_name : "غير معروف";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen transition-colors">
      <motion.div
        key="header"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ type: 'spring', stiffness: 70, damping: 14 }}
      >
        <SectionHeader listName="قسم المشورة القانونية" icon={LegalAdviceIcon} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ type: 'spring', stiffness: 60, damping: 14, delay: 0.1 }}
        className="rounded-xl bg-card text-card-foreground p-4 shadow-md"
      >
        <TableComponent
          moduleName={moduleName}
          renderAddButton={can("create") ? {
            render: () => (
              <Button onClick={() => setIsModalOpen(true)}>
                إضافة مشورة / رأي
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </Button>
            )
          } : null}
          onEdit={can("edit") ? (row) => { setEditingAdvice(row); setIsModalOpen(true); } : null}
          onDelete={can("delete") ? (row) => setDeleteTarget(row) : null}
          data={advices}
          headers={[
            { key: 'type', text: 'نوع المشورة' },
            { key: 'topic', text: 'الموضوع' },
            { key: 'advice_date', text: 'تاريخ المشورة' },
            { key: 'advice_number', text: 'رقم المشورة' },
            { key: 'attachment', text: 'مرفق' },
          ]}
          customRenderers={{
            type: (row) => getAdviceTypeName(row.advice_type_id),
            attachment: (row) =>
              row.attachment ? (
                <a
                  href={`${API_CONFIG.baseURL}/storage/${row.attachment}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  عرض
                </a>
              ) : (
                <span className="text-gray-400">لا يوجد</span>
              )
          }}
          onRowClick={(row) =>
            setSelectedAdvice((prev) => (prev?.id === row.id ? null : row))
          }
          expandedRowRenderer={(row) =>
            selectedAdvice?.id === row.id && (
              <tr>
                <td colSpan={7} className="bg-muted/40 px-4 pb-6">
                       <Suspense fallback={<div>تحميل التفاصيل...</div>}>
                    <LegalAdviceDetails selected={selectedAdvice} onClose={() => setSelectedAdvice(null)} />
                  </Suspense>                </td>
              </tr>
            )
          }
        />
      </motion.div>

     <Suspense fallback={null}>
        {isModalOpen && (
          <LegalAdviceModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            adviceTypes={adviceTypes}
            initialData={editingAdvice}
            reload={refetchAdvices}
          />
        )}

        {deleteTarget && (
          <GlobalConfirmDeleteModal
            isOpen={!!deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleConfirmDelete}
            itemName={deleteTarget?.topic || "المشورة"}
          />
        )}
      </Suspense>
    </div>
  );
}
