import { useState, useEffect, useContext } from "react";
import { toast } from 'sonner';
import { getLegalAdvices, deleteLegalAdvice } from "@/services/api/legalAdvices";
import { getAdviceTypes } from "../services/api/adviceTypes.js";
import LegalAdviceModal from "../components/LegalAdvices/LegalAdviceModal";
import GlobalConfirmDeleteModal from "../components/common/GlobalConfirmDeleteModal";
import TableComponent from "../components/common/TableComponent";
import SectionHeader from "../components/common/SectionHeader";
import {Button} from "../components/ui/button";
import LegalAdviceDetails from "../components/LegalAdvices/LegalAdviceDetails";
import { LegalAdviceIcon } from "../assets/icons";
import { AuthContext } from "@/components/auth/AuthContext";

export default function LegalAdvicePage() {
  const [advices, setAdvices] = useState([]);
  const [adviceTypes, setAdviceTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdvice, setEditingAdvice] = useState(null); 
  const [selectedAdvice, setSelectedAdvice] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { hasPermission } = useContext(AuthContext);
  const moduleName = "legaladvices";
  const can = (action) => hasPermission(`${action} ${moduleName}`);

  const loadLegalAdvices = async () => {
    try {
      const res = await getLegalAdvices();
      setAdvices(res?.data || []);
    } catch {
      toast.error("فشل تحميل المشورات");
    }
  };

  const loadAdviceTypes = async () => {
    try {
      const res = await getAdviceTypes();
      setAdviceTypes(res?.data || []);
    } catch {
      toast.error("فشل تحميل أنواع المشورة");
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

  const handleEdit = (row) => {
    setEditingAdvice(row);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteLegalAdvice(deleteTarget.id);
      toast.success("تم حذف المشورة بنجاح");
      await loadLegalAdvices();
    } catch {
      toast.error("فشل حذف المشورة");
    } finally {
      setDeleteTarget(null);
    }
  };

  const getAdviceTypeName = (typeId) => {
    const adviceType = adviceTypes.find(type => type.id === typeId);
    return adviceType ? adviceType.type_name : "غير معروف";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900 min-h-screen transition-colors">
      <SectionHeader listName="وحدة المشورة القانونية" icon={LegalAdviceIcon} />

      <TableComponent
        moduleName={moduleName}
        renderAddButton={can("create") ? {   render: () => (
                    <Button onClick={() => setIsModalOpen(true)}>
                      إضافة مشورة / رأي
                
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
                  )
                  } : null}
        onEdit={can("edit") ? handleEdit : null}
        onDelete={can("delete") ? (row) => setDeleteTarget(row) : null}
        data={advices}
        headers={[
          { key: 'type', text: 'نوع المشورة' },
          { key: 'topic', text: 'الموضوع' },
          { key: 'advice_date', text: 'تاريخ المشورة' },
          { key: 'advice_number', text: 'رقم المشورة' },
          { key: 'attachment', text: 'مرفق' },
        ]}
        customRenderers={{
          type: (row) => getAdviceTypeName(row.advice_type_id),
          attachment: (row) =>
            row.attachment ? (
              <a
                href={`${API_CONFIG.baseURL}/storage/${row.attachment}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                عرض
              </a>
            ) : (
              <span className="text-gray-400">لا يوجد</span>
            )
        }}
        onRowClick={(row) =>
          setSelectedAdvice((prev) => (prev?.id === row.id ? null : row))
        }
        expandedRowRenderer={(row) =>
          selectedAdvice?.id === row.id && (
            <tr>
              <td colSpan={7} className="bg-muted/40 px-4 pb-6">
                <LegalAdviceDetails selected={selectedAdvice} onClose={() => setSelectedAdvice(null)} />
              </td>
            </tr>
          )
        }
      />

      <LegalAdviceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        adviceTypes={adviceTypes}
        initialData={editingAdvice}
        reload={loadLegalAdvices}
      />

      <GlobalConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        itemName={deleteTarget?.topic || "المشورة"}
      />
    </div>
  );
}
