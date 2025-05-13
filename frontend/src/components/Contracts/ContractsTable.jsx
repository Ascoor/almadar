// components/Contracts/ContractsTable.jsx
import React, { useState } from "react";
import TableComponent from "../common/TableComponent";
import AddButton from "../common/AddButton";
import ContractModal from "./ContractModal";
import GlobalConfirmDeleteModal from "../common/GlobalConfirmDeleteModal";
import { deleteContract } from "../../services/api/contracts";
import { toast } from "sonner";

export default function ContractsTable({
  contracts = [],
  categories = [],
  reloadContracts,
  scope, // "local" or "international"
}) {
  // filter by scope
  const filtered = contracts.filter((c) => c.scope === scope);

  const [editing, setEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const openAdd = () => {
    setEditing(null);
    setIsModalOpen(true);
  };
  const openEdit = (row) => {
    setEditing(row);
    setIsModalOpen(true);
  };
  const confirmDelete = (row) => setToDelete(row);

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteContract(toDelete.id);
      toast.success("✅ تم حذف العقد بنجاح");
      reloadContracts();
    } catch {
      toast.error("❌ فشل حذف العقد");
    } finally {
      setToDelete(null);
    }
  };

  return (
    <>
      <TableComponent
        data={filtered}
        headers={[
          { key: "number", text: "رقم العقد" },
          { key: "category_name", text: "التصنيف" },
          { key: "contract_parties", text: "المتعاقد معه" },
          { key: "value", text: "القيمة" },
          { key: "attachment", text: "المرفق" },
          { key: "status", text: "الحالة" },
        ]}
        customRenderers={{
          category_name: (row) => row.category?.name || "—",
        }}
        onEdit={openEdit}
        onDelete={confirmDelete}
        renderAddButton={() => <AddButton label="عقد" onClick={openAdd} />}
      />

      <GlobalConfirmDeleteModal
        isOpen={!!toDelete}
        itemName={toDelete?.number}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
      />

      <ContractModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editing}
        categories={categories}
        reloadContracts={reloadContracts}
      />
    </>
  );
}
