  import { useState } from "react";
  import { getLitigations, createLitigation, updateLitigation, deleteLitigation } from "../../services/api/litigations";
  import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
  import { toast } from "sonner";
  import TableComponent from "@/components/common/TableComponent";
  import SectionHeader from "@/components/common/SectionHeader";
  import LitigationModal from "@/components/Litigations/LitigationModal"; 
  import AddButton from "@/components/common/AddButton";
  import GlobalConfirmDeleteModal from "@/components/common/GlobalConfirmDeleteModal";
  import { LegCaseSection } from "@/assets/icons";
  import LitigationActionsTable from "@/components/Litigations/LitigationActionsTable"; 

  export default function UnifiedLitigationsTable({
    litigations, 
    scope,
    reloadLitigations, 
  }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedId, setExpandedId] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [editingItem, setEditingItem] = useState(null);

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
          {expandedId === row.id ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      ),
      status: (row) => (
        <span className="text-red-600 dark:text-yellow-300 font-semibold">{row.status}</span>
      ),
      delete: (row) => (
        <button
          onClick={() => setDeleteTarget(row)}
          className="text-red-600 hover:text-red-800"
          title="حذف الدعوى"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    };

    const expandedRowRenderer = (row) =>
      expandedId === row.id ? (
        <tr>
          <td colSpan={headers.length + 2} className="bg-gray-50 dark:bg-gray-800 p-4">
            <LitigationActionsTable
              litigationId={row.id}
              actions={row.actions || []}
              
  reloadLitigations={() => reloadLitigations()} 
            />
          </td>
        </tr>
      ) : null;

    return (
      <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      
        <TableComponent
          data={litigations}
          headers={headers}
          customRenderers={customRenderers}
          onEdit={handleEdit}
          onDelete={(row) => setDeleteTarget(row)}
          expandedRowRenderer={expandedRowRenderer}
          renderAddButton={() => <AddButton label="إضافة دعوى" onClick={handleAdd} />}
          title="وحدة الدعاوى"
        />

        <LitigationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          reloadLitigations={reloadLitigations}
          initialData={editingItem}
          onSubmit={handleAdd} // Handle Add or Update
        />

        <GlobalConfirmDeleteModal
          isOpen={!!deleteTarget}
          itemName={deleteTarget?.case_number || "الدعوى"}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    );
  }
