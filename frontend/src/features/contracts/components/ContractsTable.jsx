import React, { useState, useEffect } from "react";
import TableComponent from "@/components/common/TableComponent";
import { Button } from "@/components/ui/button";
import ContractModal from "./ContractModal"; 
import GlobalConfirmDeleteModal from "@/components/common/GlobalConfirmDeleteModal";
import { useNavigate } from "react-router-dom";
import { deleteContract } from "@/services/api/contracts";
import { toast } from "sonner";

export default function ContractsTable({ contracts = [], categories = [], reloadContracts, scope, autoOpen = false }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false); 
  const navigate = useNavigate();

  const filteredContracts = Array.isArray(contracts)
    ? contracts.filter((c) => (scope ? c?.scope === scope : true))
    : [];

  useEffect(() => {
    if (autoOpen) setIsModalOpen(true);
  }, [autoOpen]); 

  const handleAdd = () => {
    setSelected(null);
    setIsModalOpen(true);
  };

  const handleEdit = (row) => {
    setSelected(row);
    setIsModalOpen(true);
  };

  const handleDelete = (row) => {
    setSelected(row);
    setConfirmDelete(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteContract(selected.id);
      toast.success("تم حذف العقد بنجاح");
      await reloadContracts?.();
    } catch {
      toast.error("فشل حذف العقد");
    } finally {
      setConfirmDelete(false); 
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
          { key: "assigned_to_user", text: "المُسند إليه" },
          { key: "value", text: "القيمة" },
          { key: "attachment", text: "المرفق" },
          { key: "status", text: "الحالة" },
        ]}
        customRenderers={{
          category_name: (row) => row.category?.name || "—",
          assigned_to_user: (row) =>
            row.assigned_to?.name || row.assigned_to?.name || "—",
        }}
        renderAddButton={{
          action: "create",
          render: () => (
            <Button onClick={handleAdd}> 
              إضافة عقد جديد
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
        }} 
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRowClick={(row) => navigate(`/contracts/${row.id}`, { state: row })}
      />

      {isModalOpen && (
        <ContractModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelected(null);
          }}
          initialData={selected}
          categories={categories}
          reloadContracts={reloadContracts}
        />
      )}

      {confirmDelete && (
        <GlobalConfirmDeleteModal
          isOpen={confirmDelete}
          onClose={() => setConfirmDelete(false)}
          onConfirm={handleDeleteConfirm}
          itemName={selected?.number}
        />
      )} 
    </>
  );
}
