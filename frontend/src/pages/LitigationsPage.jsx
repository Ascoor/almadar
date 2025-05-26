import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

import SectionHeader from "@/components/common/SectionHeader";
import GlobalConfirmDeleteModal from "@/components/common/GlobalConfirmDeleteModal";
import UnifiedLitigationsTable from "@/components/Litigations/UnifiedLitigationsTable";
import { getLitigations, deleteLitigation } from "@/services/api/litigations";
import { CaseIcon } from "@/assets/icons";

export default function LitigationsPage() {
  const [activeTab, setActiveTab] = useState("against");
  const [litigations, setLitigations] = useState([]);
  const [litigationToDelete, setLitigationToDelete] = useState(null);
  const [loadingLitigations, setLoadingLitigations] = useState(false);

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
      console.error(error);
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
    } catch (error) {
      toast.error("فشل الحذف");
      console.error(error);
    }
  };

  const filteredLitigations =
    activeTab === "against"
      ? litigations.filter((c) => c.scope === "against")
      : litigations.filter((c) => c.scope === "from");

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 ">
      <SectionHeader listName="وحدة التقاضي" icon={CaseIcon} />

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mt-6 mb-6 text-center">
        <Button
          variant={activeTab === "against" ? "default" : "outline"}
          onClick={() => setActiveTab("against")}
          className="rounded-full px-6 min-w-[200px]"
        >
          دعاوى ضد الشركة
        </Button>
        <Button
          variant={activeTab === "from" ? "default" : "outline"}
          onClick={() => setActiveTab("from")}
          className="rounded-full px-6 min-w-[200px]"
        >
          دعاوى من الشركة
        </Button>
      </div>

      {/* Table */}
      <Card className="p-4 sm:p-6 rounded-xl shadow border overflow-x-auto">
        <UnifiedLitigationsTable
          litigations={filteredLitigations}
          reloadLitigations={loadLitigations}
          scope={activeTab}
          onDelete={setLitigationToDelete}
          loading={loadingLitigations}
        />
      </Card>

      {/* Delete Modal */}
      <GlobalConfirmDeleteModal
        isOpen={!!litigationToDelete}
        onClose={() => setLitigationToDelete(null)}
        onConfirm={handleConfirmDelete}
        itemName={litigationToDelete?.case_number || "الدعوى"}
      />
    </div>
  );
}
