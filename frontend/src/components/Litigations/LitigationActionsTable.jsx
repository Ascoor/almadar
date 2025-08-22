import { useState, useContext } from "react";
import { Pencil, Trash2, BookmarkPlus } from "lucide-react";
import { toast } from "sonner";
import { AuthContext } from "@/components/auth/AuthContext";

import LitigationActionModal from "./LitigationActionModal";
import GlobalConfirmDeleteModal from "../common/GlobalConfirmDeleteModal";
import {
  deleteLitigationAction,
  updateLitigationAction,
  createLitigationAction,
} from "@/services/api/litigations";

import { useLitigationActions , useActionTypes } from "@/hooks/dataHooks";

export default function LitigationActionsTable({ litigationId, scope, reloadLitigations }) {
  const [showModal, setShowModal] = useState(false);
  const [editingAction, setEditingAction] = useState(null);
  const [actionToDelete, setActionToDelete] = useState(null);

  const { data: litigationActions = [], refetch } = useLitigationActions(litigationId);
  const { data: litigationActionTypes = [] } = useActionTypes("litigation");

  const { hasPermission } = useContext(AuthContext);
  const moduleName = scope === "from" ? "litigation-from-actions" : "litigation-against-actions";
  const can = (action) => hasPermission(`${action} ${moduleName}`);

  const handleSave = async (data) => {
    try {
      if (editingAction) {
        await updateLitigationAction(litigationId, editingAction.id, data);
        toast.success("تم تعديل الإجراء");
      } else {
        await createLitigationAction(litigationId, data);
        toast.success("تمت إضافة الإجراء");
      }
      setShowModal(false);
      refetch();
      reloadLitigations();
    } catch {
      toast.error("فشل في حفظ الإجراء");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteLitigationAction(litigationId, actionToDelete.id);
      toast.success("تم حذف الإجراء");
      setActionToDelete(null);
      refetch();
      reloadLitigations();
    } catch {
      toast.error("فشل في حذف الإجراء");
    }
  };

  if (!can("view")) {
    return (
      <div className="p-4 mt-6 mb-6 bg-gray-200 dark:bg-royal-dark rounded-xl border text-center text-red-600 dark:text-yellow-300 font-semibold">
        ليس لديك صلاحية الاطلاع على الإجراءات
      </div>
    );
  }

  return (
    <div className="mt-6 border rounded-xl text-center p-4 bg-white dark:bg-navy-dark/60">
      <h3 className="text-lg md:text-xl font-bold text-royal dark:text-gold/80">إجراءات الدعوى</h3>

      {can("create") && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              setEditingAction(null);
              setShowModal(true);
            }}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-lg text-white dark:text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-yellow-400 dark:to-yellow-600 shadow-lg hover:scale-[1.03] transition-all"
          >
            <BookmarkPlus className="w-5 h-5" />
            <span>إضافة إجراء</span>
          </button>
        </div>
      )}

      {litigationActions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">لا توجد إجراءات مسجلة لهذه الدعوى.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center border-collapse text-gray-800 dark:text-gray-200">
            <thead className="bg-gray-100 dark:bg-gray-800/90 text-gray-600 dark:text-greenic-light font-semibold">
              <tr>
                {can("edit") && <th>تعديل</th>}
                {can("delete") && <th>حذف</th>}
                <th>تاريخ الإجراء</th>
                <th>نوع الإجراء</th>
                <th>المحامي / المستشار</th>
                <th>المتطلبات</th>
                <th>النتيجة</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {litigationActions.map((action) => (
                <tr key={action.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-800">
                  {can("edit") && (
                    <td>
                      <button onClick={() => { setEditingAction(action); setShowModal(true); }} className="text-blue-600 hover:text-green-600 dark:text-yellow-300">
                        <Pencil className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                  {can("delete") && (
                    <td>
                      <button onClick={() => setActionToDelete(action)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                  <td>{action.action_date}</td>
                  <td>{action.action_type?.action_name || "غير محدد"}</td>
                  <td>{action.lawyer_name}</td>
                  <td>{action.requirements || "—"}</td>
                  <td>{action.results || "—"}</td>
                  <td className="font-medium text-green-600 dark:text-green-300">
                    {action.status === "pending"
                      ? "معلق"
                      : action.status === "in_review"
                      ? "قيد المراجعة"
                      : "منجز"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <LitigationActionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          reloadLitigations={reloadLitigations}
          actionTypes={litigationActionTypes}
          initialData={editingAction}
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
