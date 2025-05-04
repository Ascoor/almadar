import React, { useState } from "react";
import TableComponent from "../common/TableComponent";
import InvestigationActionsTable from "./InvestigationActionsTable";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";

export default function InvestigationsTable({ investigations = [], onEdit }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const headers = [
    { key: "employee_name", text: "الموظف" },
    { key: "source", text: "الجهة المحيلة" },
    { key: "subject", text: "الموضوع" },
    { key: "case_number", text: "رقم القضية" },
    { key: "status", text: "الحالة" },
  ];

  const customRenderers = {
    employee_name: (row) => (
      <div className="flex items-center justify-center gap-2">
        {expandedId === row.id ? <FaChevronDown /> : <FaChevronRight />}
        <span>{row.employee_name}</span>
      </div>
    ),
    status: (row) => (
      <span className="text-red-600 font-semibold">{row.status}</span>
    ),
  };

  return (
    <TableComponent
      data={investigations}
      headers={headers}
      customRenderers={customRenderers}
      onEdit={(row) => onEdit(row)}
      onRowClick={(row) => toggleExpand(row.id)}
      expandedRowRenderer={(row) =>
        expandedId === row.id ? (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-b-lg border-t border-gray-200 dark:border-gray-700">
            <InvestigationActionsTable
              actions={row.actions || []}
              investigationId={row.id}
            />
          </div>
        ) : null
      }
      title="وحدة التحقيقات القانونية"
    />
  );
}
