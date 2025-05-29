import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "@/components/common/SectionHeader";
import GlobalConfirmDeleteModal from "@/components/common/GlobalConfirmDeleteModal";
import UnifiedLitigationsTable from "@/components/Litigations/UnifiedLitigationsTable";
import { useNavigate } from "react-router-dom";
import { getLitigations, deleteLitigation } from "@/services/api/litigations";
import { CaseIcon } from "@/assets/icons";

export default function LitigationsPage() {
  const [activeTab, setActiveTab] = useState("against");
  const [litigations, setLitigations] = useState([]);
  const [litigationToDelete, setLitigationToDelete] = useState(null);
  const [loadingLitigations, setLoadingLitigations] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadLitigations();
  }, []);

  const loadLitigations = async () => {
    setLoadingLitigations(true);
    try {
      const res = await getLitigations();
      const litigationsData = Array.isArray(res?.data?.data) ? res.data.data : [];
      setLitigations(litigationsData);
    } catch (error) {
      toast.error("فشل تحميل الدعاوى");
    } finally {
      setLoadingLitigations(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!litigationToDelete) return;
    try {
      await deleteLitigation(litigationToDelete.id);
      toast.success("تم الحذف بنجاح");
      setLitigationToDelete(null);
      loadLitigations();
    } catch {
      toast.error("فشل الحذف");
    }
  };

  const filteredLitigations =
    activeTab === "against"
      ? litigations.filter((c) => c.scope === "against")
      : litigations.filter((c) => c.scope === "from");

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-10">

      {/* ✅ العنوان يتحرك من الأعلى */}
     <motion.div
  key="section-header"
  initial={{ opacity: 0, y: -80 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -40 }}
  transition={{
    type: "spring",
    stiffness: 60,
    damping: 18,
    delay: 0.1
  }}
>
  <SectionHeader listName="قسم التقاضي" icon={CaseIcon} />
</motion.div>


      {/* ✅ التبويبات بانتقال ناعم */}
      <motion.div
        className="flex justify-center gap-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.3 }}
      >
        {[
          { key: "from", label: "ضد الشركة" },
          { key: "against", label: "من الشركة" },
        ].map((tab) => (
          <motion.button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-2 rounded-full text-sm font-bold transition border ${
              activeTab === tab.key
                ? "bg-gold/90 text-black dark:bg-greenic dark:text-white shadow-md"
                : "bg-white text-gold dark:text-greenic border-gold dark:border-greenic hover:bg-gray-100 dark:hover:bg-zinc-700"
            }`}
          >
            {tab.label}
          </motion.button>
        ))}
      </motion.div>

  {/* ✅ التغليف الثابت بالموشن لعرض أولي */}
<motion.div
  key={`table-wrapper-${activeTab}`}
  initial={{ opacity: 0, y: 60 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -40 }}
  transition={{
    type: "spring",
    stiffness: 60,
    damping: 18,
    delay: 0.2
  }}
>
  <AnimatePresence mode="wait">
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{
        type: "spring",
        stiffness: 60,
        damping: 18,
        delay: 0.1
      }}
    >
      <Card className="p-4 sm:p-6 rounded-xl shadow border overflow-x-auto">
        <UnifiedLitigationsTable
          litigations={filteredLitigations}
          reloadLitigations={loadLitigations}
          scope={activeTab}
          onDelete={setLitigationToDelete}
          loading={loadingLitigations}
        />
      </Card>
    </motion.div>
  </AnimatePresence>
</motion.div>


      {/* ✅ نافذة تأكيد الحذف */}
      <GlobalConfirmDeleteModal
        isOpen={!!litigationToDelete}
        onClose={() => setLitigationToDelete(null)}
        onConfirm={handleConfirmDelete}
        itemName={litigationToDelete?.case_number || "الدعوى"}
      />
    </div>
  );
}
