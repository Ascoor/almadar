import { useState, lazy, Suspense } from "react";
import { toast } from "sonner";
import { createInvestigation } from "@/services/api/investigations";
import { motion } from 'framer-motion';
import TableComponent from "@/components/common/TableComponent";
import SectionHeader from "@/components/common/SectionHeader";
import { Button } from "@/components/ui/button";
import { InvestigationSection } from "@/assets/icons";
import { useInvestigations } from "../hooks/dataHooks";
import { useNavigate } from 'react-router-dom';
const InvestigationModal = lazy(() => import("@/components/Investigations/InvestigationModal"));

export default function InvestigationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const moduleName = "investigations";
  const { data, refetch } = useInvestigations();
  const investigations = data?.data?.data || [];

  const handleSave = async (formData) => {
    try {
      await createInvestigation(formData);
      toast.success("تمت الإضافة بنجاح");
      setIsModalOpen(false);
      await refetch();
    } catch {
      toast.error("فشل في الحفظ");
    }
  };

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
              <Button variant="default" onClick={() => setIsModalOpen(true)}>
                إضافة تحقيق جديد
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </Button>
            ),
          }}
          onRowClick={(row) => navigate(`/legal/investigations/${row.id}`, { state: row })}
        />
      </motion.div>

      <Suspense fallback={null}>
        {isModalOpen && (
          <InvestigationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSave}
          />
        )}
      </Suspense>
    </div>
  );
}
