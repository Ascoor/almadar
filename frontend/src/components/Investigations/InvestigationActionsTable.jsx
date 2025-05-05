import React, { useState } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import InvestigationActionModal from "./InvestigationActionModal";
import { updateInvestigationAction, createInvestigationAction } from "@/services/api/investigations";
import AddButton from "../common/AddButton";

export default function InvestigationActionsTable({ actions = [], investigationId, onReload }) {
  const [showModal, setShowModal] = useState(false);
  const [editingAction, setEditingAction] = useState(null);

  const handleEdit = (action) => {
    setEditingAction(action);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingAction(null);
    setShowModal(true);
  };

  const handleSave = async (data) => {
    try {
      if (editingAction) {
        await updateInvestigationAction(investigationId, editingAction.id, data);
        toast.success("تم تعديل الإجراء بنجاح");
      } else {
        await createInvestigationAction(investigationId, data);
        toast.success("تم إضافة الإجراء بنجاح");
      }
      setShowModal(false);
      onReload?.();
    } catch (err) {
      toast.error("فشل في حفظ الإجراء");
      console.error(err);
    }
  };

  return (
    <div className="p-4 mb-6 mt-6 md:p-6 bg-gray-300/50 dark:bg-gray-700/50 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition">
        <h2 className="text-xl font-bold text-almadar-blue dark:text-almadar-mint-light">
         إجراءات التحقيق
        </h2>
      <div className="flex justify-between items-center mb-4">
 
                 <AddButton label="إجراء" onClick={handleAdd} /> 
 
      </div>

      {/* جدول الإجراءات */}
      {actions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center border-collapse text-gray-800 dark:text-gray-200">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-yellow-200 font-semibold">
              <tr>
                <th className="px-2 py-3">تعديل</th>
                <th className="px-2 py-3">التاريخ</th>
                <th className="px-2 py-3">نوع الإجراء</th>
                <th className="px-2 py-3">القائم بالإجراء</th>
                <th className="px-2 py-3">المطلوب</th>
                <th className="px-2 py-3">النتيجة</th>
                <th className="px-2 py-3">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {actions.map((action) => (
                <tr key={action.id} className="border-t border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-almadar-mint-light/20">
                  <td className="px-2 py-2">
                    <button
                      onClick={() => handleEdit(action)}
                      className="text-almadar-blue dark:text-almadar-yellow hover:text-green-600 dark:hover:text-yellow-300"
                    >
                      <FaEdit />
                    </button>
                  </td>
                  <td className="px-2 py-2">{action.action_date}</td>
                  <td className="px-2 py-2">{action.action_type}</td>
                  <td className="px-2 py-2">{action.officer_name}</td>
                  <td className="px-2 py-2">{action.requirements || "—"}</td>
                  <td className="px-2 py-2">{action.results || "—"}</td>
                  <td className="px-2 py-2 font-medium text-green-600 dark:text-green-300">{action.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 mt-6 text-sm">لا توجد إجراءات مسجلة.</p>
      )}

      {/* نموذج الإضافة / التعديل */}
      {showModal && (
        <InvestigationActionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          initialData={editingAction}
          onSubmit={handleSave}
        />
      )}
    </div>
  );
}
