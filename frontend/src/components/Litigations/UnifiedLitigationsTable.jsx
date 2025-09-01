import { useState, useContext, useEffect } from "react";
import TableComponent from "@/components/common/TableComponent";
import LitigationModal from "@/components/Litigations/LitigationModal";
import GlobalConfirmDeleteModal from "@/components/common/GlobalConfirmDeleteModal";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UnifiedLitigationsTable({
  litigations = [],
  scope,
  reloadLitigations,
  autoOpen = false,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const navigate = useNavigate();
  const { hasPermission } = useContext(AuthContext);

  const moduleName = `litigation-${scope}`;
  const can = (action) => {
    const parts = moduleName.split("-");
    const attempts = [moduleName, parts.slice(0, 2).join("-"), parts[0]];
    return attempts.some((mod) => hasPermission(`${action} ${mod}`));
  };

  useEffect(() => {
    if (autoOpen) setIsModalOpen(true);
  }, [autoOpen]);

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (row) => {
    setEditingItem(row);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      // TODO: replace with your actual delete call, e.g. await deleteLitigation(deleteTarget.id)
      // await deleteLitigation(deleteTarget.id);
      setDeleteTarget(null);
      reloadLitigations?.();
    } catch (e) {
      console.error("Delete litigation failed:", e);
      setDeleteTarget(null);
    }
  };

  const headers = [
    { key: "case_number", text: "رقم الدعوى" },
    { key: "court", text: "المحكمة" },
    { key: "opponent", text: "الخصم" },
    { key: "subject", text: "الموضوع" },
    { key: "status", text: "الحالة" },
  ];

  const customRenderers = {
    status: (row) => {
      const map = { open: "مفتوحة", in_progress: "قيد التنفيذ", closed: "مغلقة" };
      const cls =
        {
          open: "text-emerald-600 dark:text-emerald-400",
          in_progress: "text-amber-600 dark:text-amber-400",
          closed: "text-slate-500 dark:text-slate-400",
        }[row?.status] || "text-slate-400";
      return <span className={`font-semibold ${cls}`}>{map[row?.status] || "غير معروف"}</span>;
    },
  };

  if (!can("view")) {
    return (
      <div className="p-6 bg-amber-50 dark:bg-slate-800 text-center rounded-xl text-red-600 dark:text-amber-300 font-semibold">
        ليس لديك صلاحية عرض الدعاوى.
      </div>
    );
  }

  return (
    <>
      <TableComponent
        data={litigations}
        moduleName={moduleName}
        headers={headers}
        customRenderers={customRenderers}
        onEdit={can("edit") ? handleEdit : null}
        onDelete={can("delete") ? (row) => setDeleteTarget(row) : null}
        onRowClick={(row) => navigate(`/legal/litigations/${row.id}`, { state: row })}
        renderAddButton={
          can("create")
            ? {
                render: () => (
                  <Button onClick={handleAdd}>
                    إضافة دعوى
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

      <LitigationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reloadLitigations={reloadLitigations}
        litigation={editingItem || undefined}
        scope={scope}
      />

      <GlobalConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="تأكيد حذف الدعوى"
        description={
          deleteTarget
            ? `هل تريد حذف الدعوى رقم ${deleteTarget.case_number ?? ""}؟ لا يمكن التراجع عن هذه العملية.`
            : ""
        }
        confirmText="حذف"
        cancelText="إلغاء"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}
