import { useState, useContext, lazy, Suspense } from "react";
import TableComponent from "@/components/common/TableComponent";
import SectionHeader from "@/components/common/SectionHeader";
import { Button } from "@/components/ui/button";
import { LegalAdviceIcon } from "@/assets/icons";
import { AuthContext } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { useLegalAdvices, useAdviceTypes } from "@/hooks/dataHooks";
import API_CONFIG from "@/config/config";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteLegalAdvice } from "@/services/api/legalAdvices";
import { toast } from "sonner";

const LegalAdviceModal = lazy(() => import("@/features/legal-advices/components/LegalAdviceModal"));
const GlobalConfirmDeleteModal = lazy(() => import("@/components/common/GlobalConfirmDeleteModal"));

export default function LegalAdvicePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasPermission } = useContext(AuthContext);
  const moduleName = "legaladvices";
  const can = (action) => hasPermission(`${action} ${moduleName}`);

  const [isModalOpen, setIsModalOpen] = useState(location.state?.openModal || false);
  const [current, setCurrent] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: advicesData, refetch: refetchAdvices } = useLegalAdvices();
  const { data: adviceTypesData } = useAdviceTypes();

  const advices = advicesData?.data || [];
  const adviceTypes = adviceTypesData || [];

  const getAdviceTypeName = (typeId) => {
    const type = adviceTypes.find((t) => t.id === typeId);
    return type ? type.type_name : "غير معروف";
  };

  const handleDelete = async () => {
    if (!current) return;
    try {
      await deleteLegalAdvice(current.id);
      toast.success("تم حذف المشورة بنجاح");
      await refetchAdvices();
      setCurrent(null);
    } catch {
      toast.error("فشل حذف المشورة");
    } finally {
      setConfirmDelete(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen transition-colors">
      <motion.div
        key="header"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ type: "spring", stiffness: 70, damping: 14 }}
      >
        <SectionHeader   showBackButton listName="قسم المشورة القانونية" icon={LegalAdviceIcon} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ type: "spring", stiffness: 60, damping: 14, delay: 0.1 }}
        className="rounded-xl bg-card text-fg p-4 shadow-md"
      >
        <TableComponent
          moduleName={moduleName}
          data={advices}
          headers={[
            { key: "type", text: "نوع المشورة" },
            { key: "topic", text: "الموضوع" },
            { key: "advice_date", text: "تاريخ المشورة" },
            { key: "assigned_to_user", text: "المُسند إليه" },
            { key: "advice_number", text: "رقم المشورة" },
            { key: "attachment", text: "مرفق" },
          ]}
          customRenderers={{
            type: (row) => getAdviceTypeName(row.advice_type_id),
            assigned_to_user: (row) =>
              row.assigned_user?.name || row.assigned_to_user?.name || "—",
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
              ),
          }}
          onEdit={(row) => { setCurrent(row); setIsModalOpen(true); }}
          onDelete={(row) => { setCurrent(row); setConfirmDelete(true); }}
          onRowClick={(row) => navigate(`/legal/legal-advices/${row.id}`, { state: row })}
          renderAddButton={
            can("create")
              ? {
                  render: () => (
                    <Button onClick={() => { setCurrent(null); setIsModalOpen(true); }}>
                      إضافة مشورة / رأي
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
                }
              : null
          }
        />
      </motion.div>

      <Suspense fallback={null}>
        {isModalOpen && (
          <LegalAdviceModal
            isOpen={isModalOpen}
            onClose={() => { setIsModalOpen(false); setCurrent(null); }}
            adviceTypes={adviceTypes}
            initialData={current}
            reload={refetchAdvices}
          />
        )}
        {confirmDelete && (
          <GlobalConfirmDeleteModal
            isOpen={confirmDelete}
            onClose={() => setConfirmDelete(false)}
            onConfirm={handleDelete}
            itemName={current?.topic}
          />
        )}
      </Suspense>
    </div>
  );
}
