import { useEffect, useState } from "react";
import {
  getInvestigations,
  createInvestigation,
  updateInvestigation,
  deleteInvestigation,
} from "../services/api/investigations";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react"; // ✅
import { toast } from "sonner";

import TableComponent from "../components/common/TableComponent";
import SectionHeader from "../components/common/SectionHeader";
import InvestigationModal from "../components/Investigations/InvestigationModal"; 
import AddButton from "../components/common/AddButton";
import GlobalConfirmDeleteModal from "../components/common/GlobalConfirmDeleteModal";
import { InvestigationSection } from "../assets/icons";
import InvestigationActionsTable from "../components/Investigations/InvestigationActionsTable";
  
export default function InvestigationsPage() {
  const [investigations, setInvestigations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadInvestigations = async () => {
    try {
          const res = await getInvestigations();
        const investigationsData = Array.isArray(res?.data?.data) ? res.data.data : [];
        setInvestigations(investigationsData);
      } catch (error) {
        toast.error("فشل تحميل التحقيقات");
        console.error(error);
  };
}

  useEffect(() => {
    loadInvestigations();
  }, []);
const handleCreate = async (formData) => {
  try {
    await createInvestigation(formData);
    toast.success("تمت الإضافة بنجاح");
    await loadInvestigations();
    setIsModalOpen(false);
  } catch {
    toast.error("فشل في الإضافة");
  }
};

const handleUpdate = async (formData) => {
  try {
    await updateInvestigation(editingItem.id, formData);
    toast.success("تم التعديل بنجاح");
    await loadInvestigations();
    setIsModalOpen(false);
  } catch {
    toast.error("فشل في التعديل");
  }
};
 
 

  const toggleRowExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };
const handleAdd = () => {
  setEditingItem(null);
  setIsModalOpen(true);
};

const handleEdit = (row) => {
  setEditingItem(row);
  setIsModalOpen(true);
};
 

  const headers = [
    { key: "expand", text: "" },
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
      {expandedId === row.id ? (
        <ChevronDown className="w-4 h-4" />
      ) : (
        <ChevronRight className="w-4 h-4" />
      )}
    </button>
  ),
  status: (row) => (
    <span className="text-red-600 dark:text-yellow-300 font-semibold">{row.status}</span>
  ),
  delete: (row) => (
    <button
      onClick={() => setDeleteTarget(row)}
      className="text-red-600 hover:text-red-800"
      title="حذف التحقيق"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  ),
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

    await loadInvestigations(); // ✅ إعادة تحميل التحقيقات
    setIsModalOpen(false);
  } catch {
    toast.error("فشل في الحفظ");
  }
};

const handleConfirmDelete = async () => {
  if (!deleteTarget) return;

  try {
    await deleteInvestigation(deleteTarget.id);
    toast.success("تم حذف التحقيق بنجاح");
    await loadInvestigations(); // ✅ إعادة تحميل التحقيقات
  } catch {
    toast.error("فشل حذف التحقيق");
  } finally {
    setDeleteTarget(null);
  }
};

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <SectionHeader icon={InvestigationSection} listName="وحدة التحقيقات" />

      <TableComponent
        data={investigations}
        headers={headers}
        customRenderers={customRenderers}
        onEdit={handleEdit}
        onDelete={(row) => setDeleteTarget(row)}
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
        renderAddButton={() => <AddButton label="تحقيق" onClick={handleAdd} />}
        title="وحدة التحقيقات القانونية"
      />

      <InvestigationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingItem}
        onSubmit={handleSave}
      />

      <GlobalConfirmDeleteModal
        isOpen={!!deleteTarget}
        itemName={deleteTarget?.employee_name}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
