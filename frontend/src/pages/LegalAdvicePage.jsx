import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { toast } from "sonner";

import SectionHeader from "../components/common/SectionHeader";
import GlobalConfirmDeleteModal from "../components/common/GlobalConfirmDeleteModal";
import UnifiedLitigationsTable from "../components/Litigations/UnifiedLitigationsTable";
import { getLitigations, deleteLitigation } from "../services/api/litigations";
import { CaseIcon } from "../assets/icons";

export default function LitigationsPage() {
  const [activeTab, setActiveTab] = useState("against");
  const [litigations, setLitigations] = useState([]);
  const [litigationToDelete, setLitigationToDelete] = useState(null);

  useEffect(() => {
    loadLitigations();
  }, []);

  const loadLitigations = async () => {
    try {
      const res = await getLitigations();
      const litigationsData = Array.isArray(res?.data?.data) ? res.data.data : [];
      setLitigations(litigationsData);
    } catch (error) {
      toast.error("فشل تحميل الدعاوى");
      console.error(error);
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
    <div className="p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900 min-h-screen transition-colors">
      <SectionHeader listName="وحدة التقاضي" icon={CaseIcon} />

      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
        <Button
          variant={activeTab === "against" ? "default" : "outline"}
          onClick={() => setActiveTab("against")}
          className="rounded-full px-6 mb-2 sm:mb-0 sm:mr-2"
        >
          دعاوى ضد الشركة
        </Button>
        <Button
          variant={activeTab === "from" ? "default" : "outline"}
          onClick={() => setActiveTab("from")}
          className="rounded-full px-6"
        >
          دعاوى من الشركة
        </Button>
      </div>

      <Card className="p-6 rounded-xl shadow border">
        <UnifiedLitigationsTable
          litigations={filteredLitigations}
          reloadLitigations={loadLitigations}
          scope={activeTab}
          onDelete={setLitigationToDelete}
        />
      </Card>

      <GlobalConfirmDeleteModal
        isOpen={!!litigationToDelete}
        onClose={() => setLitigationToDelete(null)}
        onConfirm={handleConfirmDelete}
        itemName={litigationToDelete?.case_number || "الدعوى"}
      />
    </div>
  );
}
