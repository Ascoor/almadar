import React, { useEffect, useState } from "react";
import TableComponent from "../components/common/TableComponent";
import SectionHeader from "../components/common/SectionHeader";
import InvestigationModal from "../components/Investigations/InvestigationModal";
import InvestigationActionsTable from "../components/Investigations/InvestigationActionsTable";
import {
  getInvestigations,
  createInvestigation,
  updateInvestigation,
} from "../services/api/investigations";
import { FaChevronDown, FaChevronRight, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { InvestigationSection } from "../assets/icons";
import AddButton from "../components/common/AddButton";

export default function InvestigationsPage() {
  const [investigations, setInvestigations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const loadInvestigations = async () => {
    try {
      const res = await getInvestigations();
      setInvestigations(res.data?.data || []);
    } catch {
      toast.error("فشل تحميل التحقيقات");
    }
  };

  useEffect(() => {
    loadInvestigations();
  }, []);

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };
  const handleEdit = (row) => {
    setEditingItem(row); // فتح المودال على التحقيق المحدد
    setIsModalOpen(true);
  };
  

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await updateInvestigation(editingItem.id, formData);
        toast.success("تم التعديل بنجاح");
      } else {
        await createInvestigation(formData);
        toast.success("تمت الإضافة بنجاح");
      }
      await loadInvestigations();
      setIsModalOpen(false);
    } catch {
      toast.error("فشل في الحفظ");
    }
  };

  const toggleRowExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const headers = [
    { key: "expand", text: "" }, // ✅ هذا العمود مخصص للزر
    { key: "employee_name", text: "الموظف" },
    { key: "source", text: "الجهة المحيلة" },
    { key: "subject", text: "الموضوع" },
    { key: "case_number", text: "رقم القضية" },
    { key: "status", text: "الحالة" },
  ];

  const customRenderers = {
    expand: (row) => (
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleRowExpand(row.id);
        }}
        className="text-gray-700 dark:text-white"
        title="عرض الإجراءات"
      >
        {expandedId === row.id ? <FaChevronDown /> : <FaChevronRight />}
      </button>
    ),
    status: (row) => (
      <span className="text-red-600 font-semibold">{row.status}</span>
    ),
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
        
<SectionHeader icon={InvestigationSection} listName='وحدة التحقيقات'/>
    
      <TableComponent
        data={investigations}
        headers={headers}
        customRenderers={customRenderers}
        onEdit={handleEdit}
        onDelete={(row) => toast.warn("الحذف لم يُفعّل بعد")}
        expandedRowRenderer={(row) =>
          expandedId === row.id ? (
            <tr>
              <td colSpan={headers.length + 2} className="bg-gray-50 dark:bg-gray-800 p-4">
                <InvestigationActionsTable
                  investigationId={row.id}
                  actions={row.actions || []}
                  onReload={loadInvestigations}
                />
              </td>
            </tr>
          ) : null
        }
              renderAddButton={() => (
                <AddButton label="تحقيق" onClick={handleAdd} />
              )}
        title="وحدة التحقيقات القانونية"
      />

      <InvestigationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingItem}
        onSubmit={handleSave}
      />
    </div>
  );
}
