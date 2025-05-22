// components/Investigations/InvestigationActionsTable.jsx
import React, { useEffect, useState,useContext } from "react";
 
import { AuthContext } from "@/components/auth/AuthContext";
import { toast } from "sonner";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

import InvestigationActionModal from "./InvestigationActionModal";
import GlobalConfirmDeleteModal from "../common/GlobalConfirmDeleteModal";
import AddButton from "../common/AddButton";

import {
  getInvestigationActionTypes,
  updateInvestigationAction,
  createInvestigationAction,
  deleteInvestigationAction,
} from "@/services/api/investigations";
export default function InvestigationActionsTable({ actions = [], investigationId, onReload }) {
  const [showModal, setShowModal] = useState(false);
  const [editingAction, setEditingAction] = useState(null);
  const [actionToDelete, setActionToDelete] = useState(null);
  const [actionTypes, setActionTypes] = useState([]);

  const { hasPermission } = useContext(AuthContext);
  const moduleName = "investigation-actions";

  const can = (action) => {
    const parts = moduleName.split("-");
    const attempts = [moduleName, parts.slice(0, 2).join("-"), parts[0]];
    return attempts.some((mod) => hasPermission(`${action} ${mod}`));
  };

  useEffect(() => {
    loadActionTypes();
  }, []);

  const loadActionTypes = async () => {
    try {
      const res = await getInvestigationActionTypes();
      setActionTypes(Array.isArray(res?.data) ? res.data : []);
    } catch {
      toast.error("فشل تحميل أنواع الإجراءات");
    }
  };

  const handleSave = async (data) => {
    try {
      if (editingAction) {
        await updateInvestigationAction(investigationId, editingAction.id, data);
        toast.success("تم تعديل الإجراء بنجاح");
      } else {
        await createInvestigationAction(investigationId, data);
        toast.success("تمت إضافة الإجراء بنجاح");
      }
      setShowModal(false);
      onReload();
    } catch {
      toast.error("فشل في حفظ الإجراء");
    }
  };

  const handleConfirmDelete = async () => {
    if (!actionToDelete) return;
    try {
      await deleteInvestigationAction(investigationId, actionToDelete.id);
      toast.success("تم حذف الإجراء بنجاح");
      setActionToDelete(null);
      onReload();
    } catch {
      toast.error("فشل في حذف الإجراء");
    }
  };

  // ✅ إرجاع رسالة في حال عدم وجود صلاحية view
  if (!can("view")) {
    return (
      <div className="p-4 mb-6 mt-6 bg-gray-200 dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 text-center text-red-600 dark:text-yellow-300 font-semibold">
        ليس لديك صلاحية الاطلاع على الإجراءات
      </div>
    );
  }

  return (
    <div className="p-4 mb-6 mt-6 md:p-6 bg-gray-300/50 dark:bg-gray-700/50 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-almadar-blue dark:text-almadar-mint-light">
          إجراءات التحقيق
        </h2>
        {can("create") && (
          <AddButton
            label="إجراء"
            onClick={() => { setEditingAction(null); setShowModal(true); }}
            icon={<PlusCircle className="w-4 h-4" />}
          />
        )}
      </div>

      {actions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center border-collapse text-gray-800 dark:text-gray-200">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-yellow-200 font-semibold">
              <tr>
                  {can("edit") && (
                <th className="px-2 py-3">تعديل</th>
                  )}
                  {can("delete") && (
                    <th className="px-2 py-3">حذف</th>
                  )}
                <th className="px-2 py-3">التاريخ</th>
                <th className="px-2 py-3">النوع</th>
                <th className="px-2 py-3">القائم</th>
                <th className="px-2 py-3">المطلوب</th>
                <th className="px-2 py-3">النتيجة</th>
                <th className="px-2 py-3">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {actions.map((action) => (
                <tr
                  key={action.id}
                  className="border-t border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                    {can("edit") && (
                  <td className="px-2 py-2">
                      <button
                        onClick={() => { setEditingAction(action); setShowModal(true); }}
                        className="text-blue-600 hover:text-green-600 dark:text-yellow-300 dark:hover:text-yellow-100"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                  </td>
                    )}
                    {can("delete") && (
                  <td className="px-2 py-2">
                      <button
                        onClick={() => setActionToDelete(action)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                  </td>
                    )}
                  <td className="px-2 py-2">{action.action_date}</td>
                  <td className="px-2 py-2">{action.action_type?.action_name || "—"}</td>
                  <td className="px-2 py-2">{action.officer_name}</td>
                  <td className="px-2 py-2">{action.requirements || "—"}</td>
                  <td className="px-2 py-2">{action.results || "—"}</td>
                  <td className="px-2 py-2 font-medium text-green-600 dark:text-green-300">
                    {action.status === "pending" ? "معلق"
                      : action.status === "in_review" ? "قيد المراجعة"
                      : "منجز"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 mt-6 text-sm">
          لا توجد إجراءات مسجلة.
        </p>
      )}

      {showModal && (
        <InvestigationActionModal
          isOpen={showModal}
          actionTypes={actionTypes}
          initialData={editingAction}
          onClose={() => setShowModal(false)}
          onSubmit={handleSave}
        />
      )}

      <GlobalConfirmDeleteModal
        isOpen={!!actionToDelete}
        onClose={() => setActionToDelete(null)}
        onConfirm={handleConfirmDelete}
        itemName={actionToDelete?.action_type?.action_name || "الإجراء"}
      />
    </div>
  );
}
