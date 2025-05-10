import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getLitigationActions, deleteLitigationAction } from "@/services/api/litigations";
import LitigationActionsTable from "@/components/LitigationActionsTable";
import LitigationActionModal from "@/components/LitigationActionModal";

export default function LitigationActionsPage() {
  const { litigationId } = useParams();
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAction, setEditAction] = useState(null);

  const fetchActions = async () => {
    setLoading(true);
    try {
      const data = await getLitigationActions(litigationId);
      setActions(data);
    } catch (err) {
      console.error(err);
      toast.error("فشل في جلب البيانات، يرجى إعادة المحاولة.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
  }, []);

  const handleEditAction = (action) => {
    setEditAction(action);
    setModalOpen(true);
  };

  const handleAddAction = () => {
    setEditAction(null);
    setModalOpen(true);
  };

  const handleDeleteAction = async (actionId) => {
    try {
      await deleteLitigationAction(litigationId, actionId);
      toast.success("تم حذف الإجراء بنجاح.");
      fetchActions();
    } catch (err) {
      console.error(err);
      toast.error("فشل في حذف الإجراء، يرجى إعادة المحاولة.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-almadar-blue dark:text-almadar-yellow">
          إدارة الإجراءات القضائية
        </h1>
        <button
          onClick={handleAddAction}
          className="flex items-center gap-2 text-sm md:text-base text-white bg-almadar-blue dark:bg-almadar-yellow dark:text-black px-4 py-2 rounded-lg hover:scale-105 transition"
        >
          <FaPlusCircle />
          <span>إضافة إجراء</span>
        </button>
      </div>

      <LitigationActionsTable
        actions={actions}
        onEdit={handleEditAction}
        onDelete={handleDeleteAction}
      />

      <LitigationActionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditAction(null);
        }}
        initialData={editAction}
        litigationId={litigationId}
        onSuccess={fetchActions}
      />
    </div>
  );
}
