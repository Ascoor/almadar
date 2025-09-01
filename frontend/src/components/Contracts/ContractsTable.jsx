import React, { useState, useEffect } from "react";
import TableComponent from "@/components/common/TableComponent";
import { Button } from "@/components/ui/button";
import ContractModal from "./ContractModal";
import { useNavigate } from "react-router-dom";

export default function ContractsTable({ contracts = [], categories = [], reloadContracts, scope, autoOpen = false }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const filteredContracts = contracts.filter((c) => c.scope === scope);

  useEffect(() => {
    if (autoOpen) setIsModalOpen(true);
  }, [autoOpen]);

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
        onRowClick={(row) => navigate(`/contracts/${row.id}`, { state: row })}
      />

      <ContractModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        reloadContracts={reloadContracts}
      />
    </>
  );
}
