import { useEffect, useState, useContext } from "react";
import { toast } from "sonner";
import {
  getInvestigations,
  createInvestigation,
  updateInvestigation,
  deleteInvestigation,
} from "@/services/api/investigations";
import { ChevronDown, ChevronRight } from "lucide-react";
import { AuthContext } from "@/components/auth/AuthContext";

import TableComponent from "@/components/common/TableComponent";
import SectionHeader from "@/components/common/SectionHeader";
import InvestigationModal from "@/components/Investigations/InvestigationModal";
import AddButton from "@/components/common/AddButton";
import GlobalConfirmDeleteModal from "@/components/common/GlobalConfirmDeleteModal";
import { InvestigationSection } from "@/assets/icons";
import InvestigationActionsTable from "@/components/Investigations/InvestigationActionsTable";

export default function InvestigationsPage() {
  const [investigations, setInvestigations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const { hasPermission } = useContext(AuthContext);
  const moduleName = "investigations";

  const loadInvestigations = async () => {
    try {
      const res = await getInvestigations();
      const data = Array.isArray(res?.data?.data) ? res.data.data : [];
      setInvestigations(data);
    } catch {
      toast.error("فشل تحميل التحقيقات");
    }
  };

  useEffect(() => {
    loadInvestigations();
  }, []);

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await updateInvestigation(editingItem.id, formData);
        toast.success("تم التعديل بنجاح");
      } else {
        await createInvestigation(formData);
        toast.success("تمت الإضافة بنجاح");
      }
      setIsModalOpen(false);
      setEditingItem(null);
      await loadInvestigations();
    } catch {
      toast.error("فشل في الحفظ");
    }
  };

  const handleEdit = (row) => {
    setEditingItem(row);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteInvestigation(toDelete.id);
      toast.success("تم حذف التحقيق بنجاح");
      await loadInvestigations();
    } catch {
      toast.error("فشل حذف التحقيق");
    } finally {
      setToDelete(null);
    }
  };

  const toggleRowExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
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
      <button onClick={(e) => { e.stopPropagation(); toggleRowExpand(row.id); }}>
        {expandedId === row.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    ),
    status: (row) => (
      <span className="font-semibold text-red-600 dark:text-yellow-300">
        {row.status}
      </span>
    ),
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <SectionHeader icon={InvestigationSection} listName="وحدة التحقيقات" />

      <TableComponent
        title="وحدة التحقيقات القانونية"
        data={investigations}
        headers={headers}
        customRenderers={customRenderers}
        moduleName={moduleName}
        renderAddButton={{
          render: () => <AddButton label="تحقيق" onClick={() => setIsModalOpen(true)} />
        }}
        onEdit={handleEdit}
        onDelete={(row) => setToDelete(row)}
        expandedRowRenderer={(row) =>
          expandedId === row.id && (
            <tr>
              <td colSpan={headers.length + 2} className="p-4 bg-gray-50 dark:bg-gray-800">
                <InvestigationActionsTable
                  investigationId={row.id}
                  actions={row.actions || []}
                  onReload={loadInvestigations}
                />
              </td>
            </tr>
          )
        }
      />

      <InvestigationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        initialData={editingItem}
        onSubmit={handleSave}
      />

      <GlobalConfirmDeleteModal
        isOpen={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        itemName={toDelete?.employee_name}
      />
    </div>
  );
}
