import React, { useState } from "react";
import TableComponent from "../common/TableComponent";
import AddButton from "@/components/common/AddButton";
import ContractModal from "./ContractModal";
import GlobalConfirmDeleteModal from "../common/GlobalConfirmDeleteModal";
import { deleteContract } from "../../services/api/contracts";
import { toast } from "react-toastify";

export default function Local({ contracts = [], reloadContracts, categories }) {
  const [selectedContract, setSelectedContract] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contractToDelete, setContractToDelete] = useState(null); // 🆕

  const handleAdd = () => {
    setSelectedContract(null);
    setIsModalOpen(true);
  };
  const handleEdit = (contract) => {
    setSelectedContract(contract); // لا حاجة للبحث مجددًا
    setIsModalOpen(true);
  };
  

  const confirmDelete = (contract) => {
    setContractToDelete(contract);
  };

  const handleConfirmDelete = async () => {
    if (!contractToDelete) return;

    try {
      await deleteContract(contractToDelete.id);
      toast.success("✅ تم حذف العقد بنجاح");
      reloadContracts();
    } catch (error) {
      console.error("Error deleting contract:", error);
      toast.error("❌ فشل حذف العقد، حاول مرة أخرى");
    } finally {
      setContractToDelete(null);
    }
  };

  return (
    <>
      <TableComponent
        data={contracts}
        headers={[
          { key: "number", text: "رقم العقد" },
          { key: "category_name", text: "التصنيف" },
          { key: "contract_parties", text: "المتعاقد معه" },
          { key: "value", text: "القيمة" },
          { key: "attachment", text: "المرفق" },
          { key: "status", text: "الحالة" },
        ]}
        customRenderers={{
          category_name: (row) => row?.category?.name || "—",
        }}
        onEdit={handleEdit}
        onDelete={confirmDelete} // 🆕
        renderAddButton={() => (
          <AddButton label="عقد" onClick={handleAdd} />
        )}
      />

      {/* 🧾 نافذة تأكيد الحذف */}
      <GlobalConfirmDeleteModal
        isOpen={!!contractToDelete}
        itemName={contractToDelete?.number}
        onClose={() => setContractToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      <ContractModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedContract}
        categories={categories}
        reloadContracts={reloadContracts}
      />
    </>
  );
}
