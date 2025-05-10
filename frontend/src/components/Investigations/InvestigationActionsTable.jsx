import  {useEffect , useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

import InvestigationActionModal from "./InvestigationActionModal";
import GlobalConfirmDeleteModal from "../common/GlobalConfirmDeleteModal";
import {
  getInvestigationActions,
  updateInvestigationAction,
  createInvestigationAction,
  deleteInvestigationAction,
} from "@/services/api/investigations";
import AddButton from "../common/AddButton";

export default function InvestigationActionsTable({ actions = [], investigationId, onReload }) {
  const [showModal, setShowModal] = useState(false);
  const [editingAction, setEditingAction] = useState(null);
  const [actionToDelete, setActionToDelete] = useState(null);
const [localActions, setLocalActions] = useState([]);

useEffect(() => {
  const fetchActions = async () => {
    if (!investigationId) return;
    try {
      const res = await getInvestigationActions(investigationId);
      setLocalActions(res.data);
    } catch {
      toast.error("فشل تحميل إجراءات التحقيق");
    }
  };
  fetchActions();
}, [investigationId, showModal]); // reload on modal open

  const handleEdit = (action) => {
    setEditingAction(action);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingAction(null);
    setShowModal(true);
  };
  const reloadLocalActions = async () => {
  try {
    const res = await getInvestigationActions(investigationId);
    setLocalActions(res.data);
  } catch {
    toast.error("فشل تحديث الإجراءات");
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
    await reloadLocalActions(); // ⬅️ هنا
    onReload?.(); // إن أردت إعادة تحميل التحقيقات من الأعلى
  } catch {
    toast.error("فشل في حفظ الإجراء");
  }
};

const handleConfirmDelete = async () => {
  try {
    await deleteInvestigationAction(investigationId, actionToDelete.id);
    toast.success("تم حذف الإجراء بنجاح");
    setActionToDelete(null);
    await reloadLocalActions(); // ⬅️ هنا
    onReload?.();
  } catch {
    toast.error("فشل في حذف الإجراء");
  }
};


  return (
    <div className="p-4 mb-6 mt-6 md:p-6 bg-gray-300/50 dark:bg-gray-700/50 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-almadar-blue dark:text-almadar-mint-light">
          إجراءات التحقيق
        </h2>
        <AddButton label="إجراء" onClick={handleAdd} icon={<PlusCircle className="w-4 h-4" />} />
      </div>

  {localActions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center border-collapse text-gray-800 dark:text-gray-200">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-yellow-200 font-semibold">
              <tr>
                <th className="px-2 py-3">تعديل</th>
                <th className="px-2 py-3">حذف</th>
                <th className="px-2 py-3">التاريخ</th>
                <th className="px-2 py-3">نوع الإجراء</th>
                <th className="px-2 py-3">القائم بالإجراء</th>
                <th className="px-2 py-3">المطلوب</th>
                <th className="px-2 py-3">النتيجة</th>
                <th className="px-2 py-3">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {localActions.map((action) => (
                <tr
                  key={action.id}
                  className="border-t border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-almadar-mint-light/20"
                >
                  <td className="px-2 py-2">
                    <button
                      onClick={() => handleEdit(action)}
                      className="text-blue-600 hover:text-green-600 dark:text-yellow-300 dark:hover:text-yellow-100"
                      title="تعديل"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="px-2 py-2">
                    <button
                      onClick={() => setActionToDelete(action)}
                      className="text-red-600 hover:text-red-800"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="px-2 py-2">{action.action_date}</td>
                  <td className="px-2 py-2">{action.action_type}</td>
                  <td className="px-2 py-2">{action.officer_name}</td>
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
      ) : (
        <p className="text-gray-500 dark:text-gray-400 mt-6 text-sm">لا توجد إجراءات مسجلة.</p>
      )}

      {showModal && (
        <InvestigationActionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          initialData={editingAction}
          onSubmit={handleSave}
        />
      )}

      <GlobalConfirmDeleteModal
        isOpen={!!actionToDelete}
        onClose={() => setActionToDelete(null)}
        onConfirm={handleConfirmDelete}
        itemName={actionToDelete?.action_type || "الإجراء"}
      />
    </div>
  );
}
