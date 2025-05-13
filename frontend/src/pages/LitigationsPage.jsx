// ### pages/LitigationsPage.jsx ###
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { getLitigations, deleteLitigation } from "@/services/api/litigations";
import SectionHeader from "@/components/common/SectionHeader";
import UnifiedLitigationsTable from "@/components/Litigations/UnifiedLitigationsTable";
import LitigationModal from "@/components/Litigations/LitigationModal";
import GlobalConfirmDeleteModal from "@/components/common/GlobalConfirmDeleteModal";
import { CaseIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LitigationsPage() {
  const [litigations, setLitigations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [activeTab, setActiveTab] = useState("against");

  // 1️⃣ دالة تحميل البيانات
  const loadLitigations = async () => {
    setLoading(true);
    try {
      const res = await getLitigations();
      setLitigations(res.data.data || []);
    } catch {
      toast.error("فشل تحميل الدعاوى");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLitigations();
  }, []);

  // 2️⃣ فتح المودال للإضافة أو التعديل
  const handleAdd = () => { setEditingItem(null); setIsModalOpen(true); };
  const handleEdit = (item) => { setEditingItem(item); setIsModalOpen(true); };

  // 3️⃣ تأكيد الحذف ثم إعادة تحميل
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteLitigation(deleteTarget.id);
      toast.success("تم الحذف بنجاح");
      setDeleteTarget(null);
      await loadLitigations(); // ← إعادة التحميل
    } catch {
      toast.error("فشل في الحذف");
    }
  };

  // 4️⃣ مرّر loadLitigations كمُعيد تحميل
  return (
    <div className="p-2 mt-6 bg-white w-full dark:bg-gray-900">
      <SectionHeader listName="وحدة التقاضي" icon={CaseIcon} />

      <div className="flex gap-4 my-4 justify-center">
        <Button
          variant={activeTab === "against" ? "default" : "outline"}
          onClick={() => setActiveTab("against")}
        >
          دعاوى ضد الشركة
        </Button>
        <Button
          variant={activeTab === "from" ? "default" : "outline"}
          onClick={() => setActiveTab("from")}
        >
          دعاوى من الشركة
        </Button>
      </div>
 
        <UnifiedLitigationsTable
          litigations={litigations.filter(l => l.scope === activeTab)}
          loading={loading}
          onEdit={handleEdit}
          onDelete={setDeleteTarget}
          reloadLitigations={loadLitigations}              // ← هنا
        />
 

      <div className="mt-4 flex justify-end">
        <Button onClick={handleAdd}>إضافة دعوى</Button>
      </div>

      <LitigationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingItem}
        reloadLitigations={loadLitigations}              // ← وهنا
      />

      <GlobalConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        itemName={deleteTarget?.case_number || "الدعوى"}
      />
    </div>
  );
}
