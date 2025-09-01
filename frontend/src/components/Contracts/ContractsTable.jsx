import React, { useState, useEffect } from "react";
import TableComponent from "@/components/common/TableComponent";
import { Button } from "@/components/ui/button";
import ContractModal from "./ContractModal";
import GlobalConfirmDeleteModal from "../common/GlobalConfirmDeleteModal";
import { deleteContract } from "../../services/api/contracts";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function ContractsTable({
  contracts = [],
  categories = [],
  reloadContracts,
  scope,
  autoOpen = false,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();

  const filteredContracts = Array.isArray(contracts)
    ? contracts.filter((c) => (scope ? c?.scope === scope : true))
    : [];

  useEffect(() => {
    if (autoOpen) setIsModalOpen(true);
  }, [autoOpen]);

  const openEdit = (row) => navigate(`/contracts/${row.id}`, { state: row });
  const confirmDelete = (row) => setDeleteTarget(row);

  const handleConfirmDelete = async () => {
    if (!deleteTarget?.id) return;
    try {
      await deleteContract(deleteTarget.id);
      toast.success("تم حذف العقد بنجاح");
      setDeleteTarget(null);
      reloadContracts?.();
    } catch (e) {
      toast.error("تعذر حذف العقد");
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
          category_name: (row) => row?.category?.name || "—",
        }}
        onEdit={openEdit}
        onDelete={confirmDelete}
        renderAddButton={{
          action: "create",
          render: () => (
            <Button onClick={() => setIsModalOpen(true)}>
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
        onRowClick={(row) => navigate(`/contracts/${row.id}`, { state: row })}
      />

      <ContractModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        reloadContracts={reloadContracts}
      />

      <GlobalConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="تأكيد حذف العقد"
        description={`هل تريد حذف العقد رقم ${deleteTarget?.number ?? ""}؟ لا يمكن التراجع عن هذه العملية.`}
        confirmText="حذف"
        cancelText="إلغاء"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
}
