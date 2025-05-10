import React, { useState } from "react";
import TableComponent from "@/components/common/TableComponent";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import LitigationActionsTable from "./LitigationActionsTable";
import GlobalConfirmDeleteModal from "@/components/common/GlobalConfirmDeleteModal";
import LitigationModal from "./LitigationModal";
import { deleteLitigation } from "@/services/api/litigations";
import { toast } from 'sonner';

export default function FromCompanyLitigations({ litigations = [], reloadLitigations }) {
  const [expandedId, setExpandedId] = useState(null);
  const [selectedLitigation, setSelectedLitigation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const toggleExpand = (row) => {
    setExpandedId((prev) => (prev === row.id ? null : row.id));
  };

  const handleAdd = () => {
    setSelectedLitigation(null);
    setIsModalOpen(true);
  };

  const handleEdit = (litigation) => {
    setSelectedLitigation(litigation);
    setIsModalOpen(true);
  };

  const handleDelete = (litigation) => {
    setToDelete(litigation);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteLitigation(toDelete.id);
      toast.success("تم حذف الدعوى بنجاح");
      setIsDeleteModalOpen(false);
      reloadLitigations();
    } catch (err) {
      console.error(err);
      toast.error("فشل في حذف الدعوى");
    }
  };

  const renderExpanded = (row) =>
    expandedId === row.id ? (
      <tr>
        <td colSpan={6}>
          <LitigationActionsTable actions={row.actions || []} />
        </td>
      </tr>
    ) : null;

  return (
    <>
      <TableComponent
        data={litigations}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRowClick={toggleExpand}
        expandedRowRenderer={renderExpanded}
        headers={[
          { key: "case_number", text: "رقم الدعوى" },
          { key: "court", text: "المحكمة" },
          { key: "opponent", text: "الخصم" },
          { key: "subject", text: "الموضوع" },
          { key: "status", text: "الحالة" },
        ]}
        renderAddButton={() => (
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            إضافة دعوى
          </Button>
        )}
      />

      <LitigationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedLitigation}
        reloadLitigations={reloadLitigations} // تأكد من أن هذا هو اسم الدالة الفعلية
      />

      <GlobalConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={toDelete?.case_number || "الدعوى"}
      />
    </>
  );
}
