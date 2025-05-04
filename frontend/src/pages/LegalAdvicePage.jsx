import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import LegalAdviceModal from "../components/LegalAdvices/LegalAdviceModal";
import { getLegalAdvices, deleteLegalAdvice } from "../services/api/legalAdvices"; // إضافة دالة الحذف
import { ToastContainer, toast } from 'react-toastify';
import SectionHeader from "../components/common/SectionHeader";
import { LegalAdviceIcon } from "../assets/icons";
import TableComponent from "../components/common/TableComponent";
import GlobalConfirmDeleteModal from "../components/common/GlobalConfirmDeleteModal"; // استيراد مكون التاكيد

export default function LegalAdvicePage() {
  const [advices, setAdvices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdvice, setEditingAdvice] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // حالة لفتح نافذة التاكيد
  const [adviceToDelete, setAdviceToDelete] = useState(null); // العنصر الذي سيتم حذفه

  // تحميل المشورات القانونية
  const loadLegalAdvices = async () => {
    try {
      const res = await getLegalAdvices();
      setAdvices(res?.data || []);
    } catch (err) {
      console.error("فشل في تحميل المنشورات:", err);
    }
  };

  useEffect(() => {
    loadLegalAdvices();
  }, []);

  const handleAdd = () => {
    setEditingAdvice(null);
    setIsModalOpen(true);
  };

  // دالة الحذف
  const handleDelete = async (advice) => {
    try {
      await deleteLegalAdvice(advice.id);
      toast.success("تم الحذف بنجاح");
      loadLegalAdvices(); // إعادة تحميل البيانات بعد الحذف
    } catch (err) {
      toast.error("فشل في الحذف");
    }
  };

  const handleDeleteConfirmation = () => {
    if (adviceToDelete) {
      handleDelete(adviceToDelete); // تنفيذ الحذف
    }
    setIsDeleteModalOpen(false); // غلق نافذة التاكيد
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900 min-h-screen transition-colors">
      {/* Header Section */}
      <SectionHeader 
        listName={"وحدة الاستشارات القانونية"} 
        icon={LegalAdviceIcon} 
      />

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Action Buttons */}
      <div className="flex justify-between gap-4 mt-6">
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-almadar-blue-light text-white dark:bg-almadar-yellow dark:text-black hover:scale-105 transition"
        >
          <FaPlus />
          <span className="text-sm font-semibold">إضافة مشورة</span>
        </button>
      </div>

      {/* Legal Advices Table */}
      <TableComponent
        data={advices}
        headers={[
          { key: 'type', text: 'نوع المشورة' },
          { key: 'topic', text: 'الموضوع' },
          { key: 'advice_date', text: 'تاريخ المشورة' },
          { key: 'advice_number', text: 'رقم المشورة' },
          { key: 'attachment', text: 'مرفق' },
        ]}
        customRenderers={{
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
          setAdviceToDelete(advice); // حفظ العنصر الذي سيتم حذفه
          setIsDeleteModalOpen(true); // فتح نافذة التاكيد
        }}
      />

      {/* Modal for Adding/Editing Legal Advice */}
      <LegalAdviceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
