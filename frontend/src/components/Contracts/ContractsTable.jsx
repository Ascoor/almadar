import React, { useState } from "react";
import TableComponent from "@/components/common/TableComponent";
import {Button} from "@/components/ui/button";
import ContractModal from "./ContractModal";
import GlobalConfirmDeleteModal from "../common/GlobalConfirmDeleteModal";
import ContractDetails from "./ContractDetails";
import { deleteContract } from "../../services/api/contracts";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion"; // ✅ إضافة

export default function ContractsTable({ contracts = [], categories = [], reloadContracts, scope }) {
  const [editing, setEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);

  const filteredContracts = contracts.filter((c) => c.scope === scope);
 
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
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </Button>
    ),
  }}
  onRowClick={(row) =>
    setSelectedContract((prev) => (prev?.id === row.id ? null : row))
  }
  expandedRowRenderer={(row) =>
    selectedContract?.id === row.id && (
      <tr>
        <td colSpan={6} className="bg-muted/40">
          <AnimatePresence mode="wait">
            <motion.div
              key={row.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="p-6"
            >
              <div className="flex justify-center">
                <div className="w-full max-w-3xl">
                  <ContractDetails
                    selected={row}
                    onClose={() => setSelectedContract(null)}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </td>
      </tr>
    )
  }
/> {/* ✅ تم إغلاق TableComponent هنا */}

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
