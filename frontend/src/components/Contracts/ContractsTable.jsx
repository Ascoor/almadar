import React, { useState } from "react";
import TableComponent from "../common/TableComponent";
import AddButton from "../common/AddButton";
import ContractModal from "./ContractModal";
import GlobalConfirmDeleteModal from "../common/GlobalConfirmDeleteModal";
import ContractDetails from "./ContractDetails";
import { deleteContract } from "../../services/api/contracts";
import { toast } from "sonner";

export default function ContractsTable({ contracts = [], categories = [], reloadContracts, scope }) {
  const [editing, setEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);

  const filteredContracts = contracts.filter((c) => c.scope === scope);

  const openAdd = () => {
    setEditing(null);
    setIsModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setIsModalOpen(true);
  };

  const confirmDelete = (row) => {
    setDeleteTarget(row);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteContract(deleteTarget.id);
      toast.success("✅ تم حذف العقد بنجاح");
      reloadContracts?.();
    } catch {
      toast.error("❌ فشل حذف العقد");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <TableComponent
        moduleName="contracts"
        data={filteredContracts}
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
  renderAddButton={{
          action: "create",
          render: () => <AddButton label="عقد" onClick={openAdd} />,
        }}
        onRowClick={(row) =>
          setSelectedContract((prev) => (prev?.id === row.id ? null : row))
        }
        expandedRowRenderer={(row) =>
          selectedContract?.id === row.id && (
            <tr>
              <td colSpan={7} className="bg-muted/40 px-4 pb-6">
                <ContractDetails selected={row} onClose={() => setSelectedContract(null)} />
              </td>
            </tr>
          )
        }
        title="العقود"
      />

      {/* نافذة التعديل أو الإضافة */}
      <ContractModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editing}
        categories={categories}
        reloadContracts={reloadContracts}
      />

      {/* نافذة تأكيد الحذف */}
      <GlobalConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.number}
      />
    </>
  );
}
