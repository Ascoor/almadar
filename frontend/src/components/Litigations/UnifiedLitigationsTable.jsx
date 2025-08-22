import { useState, useContext } from "react";
import { toast } from "sonner";
import { deleteLitigation } from "@/services/api/litigations";
import TableComponent from "@/components/common/TableComponent";
import LitigationModal from "@/components/Litigations/LitigationModal";
import GlobalConfirmDeleteModal from "@/components/common/GlobalConfirmDeleteModal";
import {Button} from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import LitigationActionsTable from "@/components/Litigations/LitigationActionsTable";
import { AuthContext } from "@/components/auth/AuthContext";

export default function UnifiedLitigationsTable({ litigations, scope, reloadLitigations }) {
  const [expandedId, setExpandedId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { hasPermission } = useContext(AuthContext);
  const moduleName = `litigation-${scope}`;
  const can = (action) => {
    const parts = moduleName.split("-");
    const attempts = [moduleName, parts.slice(0, 2).join("-"), parts[0]];
    return attempts.some((mod) => hasPermission(`${action} ${mod}`));
  };

  const toggleRowExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleEdit = (row) => {
    setEditingItem(row);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteLitigation(deleteTarget.id);
      toast.success("تم حذف الدعوى بنجاح");
      await reloadLitigations();
    } catch {
      toast.error("فشل حذف الدعوى");
    } finally {
      setDeleteTarget(null);
    }
  };

  const headers = [
    { key: "expand", text: "" },
    { key: "case_number", text: "رقم الدعوى" },
    { key: "court", text: "المحكمة" },
    { key: "opponent", text: "الخصم" },
    { key: "subject", text: "الموضوع" },
    { key: "status", text: "الحالة" },
  ];

  const customRenderers = {
    expand: (row) => (
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleRowExpand(row.id);
        }}
        className="text-gray-700 dark:text-white"
        title="عرض الإجراءات"
      >
        {expandedId === row.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    ),
    status: (row) => {
      const statusMap = {
        open: "مفتوحة",
        in_progress: "قيد التنفيذ",
        closed: "مغلقة",
      };

      const statusColor = {
        open: "text-green-600",
        in_progress: "text-yellow-600",
        closed: "text-gray-500",
      }[row.status] || "text-gray-400";

      return (
        <span className={`font-semibold ${statusColor}`}>
          {statusMap[row.status] || "غير معروف"}
        </span>
      );
    },
  };

  const expandedRowRenderer = (row) =>
    expandedId === row.id ? (
      <tr key={`expanded-${row.id}`}>
        <td colSpan={headers.length + 2} className="bg-gray-50 dark:bg-navy-darker p-4">
          <LitigationActionsTable
            litigationId={row.id}
            scope={scope}
            reloadLitigations={reloadLitigations}
          />
        </td>
      </tr>
    ) : null;

  if (!can("view")) {
    return (
      <div className="p-6 bg-yellow-100 dark:bg-gray-800 text-center rounded-xl text-red-600 dark:text-yellow-300 font-semibold">
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
        expandedRowRenderer={expandedRowRenderer}
        renderAddButton={can("create") ? { render: () => (
                    <Button
                      onClick={handleAdd}
                       >
                      إضافة دعوى
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4 ml-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                              >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                   d="M12 4v16m8-8H4"
                              />
                        </svg>
                    </Button>
                  )
        } : null}
      />                                   



      <LitigationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingItem}
        reloadLitigations={reloadLitigations}
        onSubmit={reloadLitigations}
      />

      <GlobalConfirmDeleteModal
        isOpen={!!deleteTarget}
        itemName={deleteTarget?.case_number || "الدعوى"}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
