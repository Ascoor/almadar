import { useState, useEffect, useContext } from "react";
import { Pencil, Trash2, BookmarkPlus } from "lucide-react";
import LitigationActionModal from "./LitigationActionModal";
import GlobalConfirmDeleteModal from "../common/GlobalConfirmDeleteModal";
import { toast } from "sonner";
import {
  deleteLitigationAction,
  updateLitigationAction,
  createLitigationAction,
  getLitigationActions,
  getLitigationActionTypes,
} from "@/services/api/litigations";
import { AuthContext } from "@/components/auth/AuthContext"; 

export default function LitigationActionsTable({ litigationId, scope, reloadLitigations }) {
  const [showModal, setShowModal] = useState(false);
  const [editingAction, setEditingAction] = useState(null);
  const [actionToDelete, setActionToDelete] = useState(null);
  const [litigationActions, setLitigationActions] = useState([]);
  const [litigationActionTypes, setLitigationActionTypes] = useState([]);
  const [loadingActions, setLoadingActions] = useState(false);
  const [loadingActionTypes, setLoadingActionTypes] = useState(false);

  // Determine the module name based on the scope
  const moduleName = scope === "from" ? "litigation-from-actions" : "litigation-against-actions";
  const { hasPermission } = useContext(AuthContext);

  const can = (action) => hasPermission(`${action} ${moduleName}`);

  useEffect(() => {
    fetchLitigationActions();
    loadLitigationActionTypes();
  }, [litigationId]);

  const fetchLitigationActions = async () => {
    setLoadingActions(true);
    try {
      const res = await getLitigationActions(litigationId);
      const actions = Array.isArray(res?.data?.data) ? res.data.data : [];
      setLitigationActions(actions);
    } catch {
      toast.error("فشل في جلب البيانات، يرجى إعادة المحاولة.");
    } finally {
      setLoadingActions(false);
    }
  };

  const loadLitigationActionTypes = async () => {
    setLoadingActionTypes(true);
    try {
      const res = await getLitigationActionTypes();
      setLitigationActionTypes(Array.isArray(res?.data) ? res.data : []);
    } catch {
      toast.error("فشل تحميل أنواع الإجراءات");
    } finally {
      setLoadingActionTypes(false);
    }
  };

  const handleSave = async (data) => {
    try {
      if (editingAction) {
        await updateLitigationAction(litigationId, editingAction.id, data);
        toast.success("تم تعديل الإجراء بنجاح");
      } else {
        await createLitigationAction(litigationId, data);
        toast.success("تمت إضافة الإجراء بنجاح");
      }
      setShowModal(false);
      fetchLitigationActions();
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
      fetchLitigationActions();
      reloadLitigations();
    } catch {
      toast.error("فشل في حذف الإجراء");
    }
  };

  if (!can("view")) {
    return (
      <div className="p-4 mb-6 mt-6 bg-gray-200 dark:bg-royal-dark rounded-xl border border-gray-300 dark:border-gray-700 text-center text-red-600 dark:text-yellow-300 font-semibold">
        ليس لديك صلاحية الاطلاع على الإجراءات
      </div>
    );
  }

  return (
    <div className="mt-6 border rounded-xl text-center -center p-4 bg-white dark:bg-navy-dark/60">
        <h3 className="text-lg md:text-xl font-bold text-royal dark:text-gold/80">إجراءات الدعوى</h3>
 <div className="flex justify-between mb-4">
  {can("create") && (
    <button
      onClick={() => {
        setEditingAction(null);
        setShowModal(true);
      }}
      className="group relative overflow-hidden flex items-center gap-2 px-5 py-2.5 rounded-lg text-white dark:text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-yellow-400 dark:to-yellow-600 
        shadow-lg transition-all duration-300 hover:scale-[1.03] focus:outline-none"
    >
    
      <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition duration-300 rounded-lg pointer-events-none" />

     
      <BookmarkPlus className="w-5 h-5" />
      <span>إضافة إجراء</span>
    </button>
  )}
</div>


      {litigationActions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">لا توجد إجراءات مسجلة لهذه الدعوى.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center border-collapse text-gray-800 dark:text-gray-200">
            <thead className="bg-gray-100 dark:bg-gray-800/90 text-gray-600 dark:text-greenic-light  font-semibold">
              <tr>
                {can("edit") && <th className="px-2 py-3">تعديل</th>}
                {can("delete") && <th className="px-2 py-3">حذف</th>}
                <th className="px-2 py-3">تاريخ الإجراء</th>
                <th className="px-2 py-3">نوع الإجراء</th>
                <th className="px-2 py-3">المحامي / المستشار</th>
                <th className="px-2 py-3">المتطلبات</th>
                <th className="px-2 py-3">النتيجة</th>
                <th className="px-2 py-3">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {litigationActions.map((action) => (
                <tr key={action.id} className="border-t border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
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
                  <td className="px-2 py-2">{action.action_type?.action_name || "غير محدد"}</td>
                  <td className="px-2 py-2">{action.lawyer_name}</td>
                  <td className="px-2 py-2">{action.requirements || "—"}</td>
                  <td className="px-2 py-2">{action.results || "—"}</td>
                  <td className="px-2 py-2 font-medium text-green-600 dark:text-green-300">
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
