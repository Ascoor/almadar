import React, { useState } from "react";
import TableComponent from "../common/TableComponent";
import { FaPlus, FaChevronDown, FaChevronRight } from "react-icons/fa";
import ContractModal from "./ContractModal";
import ContractDetails from "./ContractDetails";
import GlobalConfirmDeleteModal from "../common/GlobalConfirmDeleteModal";
import { toast } from "react-toastify";
import { deleteContract } from "../../services/api/contracts";

export default function International({ contracts = [], reloadContracts, categories }) {
  const [selectedContract, setSelectedContract] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contractToDelete, setContractToDelete] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

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

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <>
      <TableComponent
        data={contracts}
        headers={[
          { key: "expand", text: "" },
          { key: "number", text: "رقم العقد" },
          { key: "category_name", text: "التصنيف" },
          { key: "contract_parties", text: "المتعاقد معه" },
          { key: "value", text: "القيمة" },
          { key: "attachment", text: "المرفق" },
          { key: "status", text: "الحالة" },
        ]}
        customRenderers={{
          expand: (row) => (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(row.id);
              }}
              className="text-gray-700 dark:text-white"
              title="عرض التفاصيل"
            >
              {expandedId === row.id ? <FaChevronDown /> : <FaChevronRight />}
            </button>
          ),
          category_name: (row) => row?.category?.name || "—",
        }}
        onEdit={handleEdit}
        onDelete={confirmDelete}
        expandedRowRenderer={(row) =>
          expandedId === row.id && (
            <tr>
              <td colSpan={8}>
                <ContractDetails selected={row} onClose={() => setExpandedId(null)} />
              </td>
            </tr>
          )
        }
        renderAddButton={() => (
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-almadar-blue text-white dark:bg-almadar-blue-light dark:text-black rounded-lg shadow hover:scale-105 transition"
          >
            <FaPlus />
            إضافة عقد
          </button>
        )}
      />

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
