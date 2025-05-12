import  { useState, useEffect } from "react"; 
import LegalAdviceModal from "../components/LegalAdvices/LegalAdviceModal";
import { getLegalAdvices, deleteLegalAdvice } from "@/services/api/legalAdvices";
import { getAdviceTypes } from "../services/api/adviceTypes.js"; // Add service to get types
import { toast } from 'sonner';
import SectionHeader from "../components/common/SectionHeader";
import { LegalAdviceIcon } from "../assets/icons";
import TableComponent from "../components/common/TableComponent";
import GlobalConfirmDeleteModal from "../components/common/GlobalConfirmDeleteModal"; 
import AddButton from "../components/common/AddButton";
import LegalAdviceDetails from "../components/LegalAdvices/LegalAdviceDetails";

export default function LegalAdvicePage() {
  const [advices, setAdvices] = useState([]);
  const [adviceTypes, setAdviceTypes] = useState([]);  // Store AdviceTypes here
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdvice, setEditingAdvice] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
  const [adviceToDelete, setAdviceToDelete] = useState(null); 
  const [selectedAdvice, setSelectedAdvice] = useState(null);

  // Load Legal Advices
  const loadLegalAdvices = async () => {
    try {
      const res = await getLegalAdvices();
      setAdvices(res?.data || []);
    } catch (err) {
      console.error("Failed to load legal advices:", err);
    }
  };

  // Load Legal Advice Types
  const loadAdviceTypes = async () => {
    try {
      const res = await getAdviceTypes();  // Assuming you have an API service for this
      setAdviceTypes(res?.data || []);
    } catch (err) {
      console.error("Failed to load advice types:", err);
    }
  };

  useEffect(() => {
    loadLegalAdvices();
    loadAdviceTypes();
  }, []);

  const handleAdd = () => {
    setEditingAdvice(null);
    setIsModalOpen(true);
  };

  // Handle delete action
  const handleDelete = async (advice) => {
    try {
      await deleteLegalAdvice(advice.id);
      toast.success("تم الحذف بنجاح");
      loadLegalAdvices(); 
    } catch (err) {
      toast.error("فشل في الحذف");
    }
  };

  const handleDeleteConfirmation = () => {
    if (adviceToDelete) {
      handleDelete(adviceToDelete);
    }
    setIsDeleteModalOpen(false); 
  };

  // Map advice_type_id to type_name
  const getAdviceTypeName = (typeId) => {
    const adviceType = adviceTypes.find(type => type.id === typeId);
    return adviceType ? adviceType.type_name : "غير معروف";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900 min-h-screen transition-colors">
      {/* Header Section */}
      <SectionHeader 
        listName={"وحدة الاستشارات القانونية"} 
        icon={LegalAdviceIcon} 
      />
 
      {/* Legal Advices Table */}
      <TableComponent
        renderAddButton={() => (
          <AddButton label="مشورة أو رأى" onClick={handleAdd} />
        )}
        data={advices}
        headers={[
          { key: 'type', text: 'نوع المشورة' },
          { key: 'topic', text: 'الموضوع' },
          { key: 'advice_date', text: 'تاريخ المشورة' },
          { key: 'advice_number', text: 'رقم المشورة' },
          { key: 'attachment', text: 'مرفق' },
        ]}
        customRenderers={{
          type: (row) => getAdviceTypeName(row.advice_type_id),  // Render the type name based on advice_type_id
          attachment: (row) => (
            row.attachment ? (
              <a href={`${API_CONFIG.baseURL}/storage/${row.attachment}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                عرض
              </a>
            ) : (
              <span className="text-gray-400">لا يوجد</span>
            )
          ),
        }}
        onEdit={(advice) => {
          setEditingAdvice(advice);
          setIsModalOpen(true);
        }}
        onDelete={(advice) => {
          setAdviceToDelete(advice); 
          setIsDeleteModalOpen(true);
        }}
        onRowClick={(row) =>
          setSelectedAdvice((prev) => (prev?.id === row.id ? null : row)) // Toggle
        }
        expandedRowRenderer={(row) =>
          selectedAdvice?.id === row.id && (
            <tr>
              <td colSpan={7} className="bg-muted/40 px-4 pb-6">
                <LegalAdviceDetails
                  selected={selectedAdvice}
                  onClose={() => setSelectedAdvice(null)}
                />
              </td>
            </tr>
          )
        }
      />

      {/* Modal for Adding/Editing Legal Advice */}
      <LegalAdviceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        adviceTypes={adviceTypes}
        initialData={editingAdvice}
        reload={loadLegalAdvices}
      />

      {/* Confirmation Modal for Deleting */}
      <GlobalConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirmation}
        itemName={adviceToDelete ? adviceToDelete.topic : ''}
      />
    </div>
  );
}
