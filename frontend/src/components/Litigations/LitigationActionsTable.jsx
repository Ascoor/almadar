import  { useState,useEffect} from "react";
import { FaEdit, FaTrash, FaPlusCircle } from "react-icons/fa";
import LitigationActionModal from "./LitigationActionModal";
import GlobalConfirmDeleteModal from "../common/GlobalConfirmDeleteModal";
import { toast } from "sonner";
import { deleteLitigationAction, updateLitigationAction, createLitigationAction , getLitigationActionTypes,} from "@/services/api/litigations";

export default function LitigationActionsTable({
  actions,
  litigationId,
  reloadLitigations, 
}) {
  const [showModal, setShowModal] = useState(false);
  const [editingAction, setEditingAction] = useState(null);
  const [loadingActionTypes, setLoadingActionTypes] = useState(false);

  const [litigationActionTypes, setLitigationActionTypes] = useState([]);
  const [actionToDelete, setActionToDelete] = useState(null);
useEffect(() => {
    reloadLitigations();
    loadLitigationActionTypes();
  }, []);
  // Function to load litigation action types
  const loadLitigationActionTypes = async () => {
    setLoadingActionTypes(true);
    try {
      const res = await getLitigationActionTypes();
      const litigationActionTypesData = Array.isArray(res?.data) ? res.data : [];
      setLitigationActionTypes(litigationActionTypesData);
    } catch (error) {
      toast.error("فشل تحميل انواع الاجراءات");
      console.error(error);
    } finally {
      setLoadingActionTypes(false);
    }
  };
  const onEdit = (action) => {
    setEditingAction(action);
    setShowModal(true);
  };

  const onAdd = () => {
    setEditingAction(null);
    setShowModal(true);
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
      reloadLitigations(); // Refresh the actions after the save
    } catch (error) {
      toast.error("فشل في حفظ الإجراء");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteLitigationAction(litigationId, actionToDelete.id);
      toast.success("تم حذف الإجراء بنجاح");
      setActionToDelete(null); // Close the modal after deletion
      reloadLitigations(); // Optionally refresh actions
    } catch (error) {
      toast.error("فشل في حذف الإجراء");
    }
  };

  return (
    <div className="mt-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-4 md:p-6 transition">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg md:text-xl font-bold text-royal dark:text-gold">
          الإجراءات القضائية المرتبطة
        </h3>
      <button
  onClick={onAdd}
  className="
    flex items-center justify-center gap-2

    /* Padding متغير حسب الشاشة */
    px-4 py-2
    sm:px-5 sm:py-2.5
    md:px-6 md:py-3

    /* حجم الخط متغير */
    text-sm
    sm:text-base
    md:text-lg
    font-semibold

    /* دوائر حواف */
    rounded-2xl

    /* ألوان النص */
    text-white dark:text-gray-900

    /* تدرّج الألوان ليلاً ونهارًا */
    bg-gradient-to-r
      from-royal-light/90 to-royal/80
    dark:bg-gradient-to-r
      dark:from-gold/90 dark:to-gold-light/80

    /* ظلّ أولي */
    shadow-lg
    will-change-transform

    /* انتقالات */
    transition
      transform duration-300 ease-out,
      shadow 300ms ease-out,
      filter 300ms ease-out

    /* تأثيرات Hover */
    hover:shadow-2xl
    hover:-translate-y-1 hover:scale-105 hover:rotate-1
    hover:brightness-105

    /* تأثيرات Click */
    active:translate-y-0.5 active:scale-100 active:shadow-md

    /* إطار تركيز */
    focus:outline-none focus:ring-4
    focus:ring-royal/50 dark:focus:ring-gold/50

    /* حالة التعطيل */
    disabled:opacity-50 disabled:cursor-not-allowed
  "
>
  <FaPlusCircle className="w-5 h-5 flex-shrink-0" />
  <span className="whitespace-nowrap">إضافة إجراء</span>
</button>
 
      </div>

      {actions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">لا توجد إجراءات مسجلة لهذه الدعوى.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center border-collapse text-gray-800 dark:text-gray-200">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-yellow-200 font-semibold">
              <tr>
                <th className="px-2 py-3">تعديل</th>
                <th className="px-2 py-3">حذف</th>
                <th className="px-2 py-3">تاريخ الإجراء</th>
                <th className="px-2 py-3">نوع الإجراء</th>
                <th className="px-2 py-3">المحامي  </th>
                <th className="px-2 py-3">المتطلبات</th>
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
                  <td className="px-2 py-2">
                    <button
                      onClick={() => onEdit(action)} // Invoke onEdit function with the action object
                      className="text-blue-600 hover:text-green-600 dark:text-yellow-300 dark:hover:text-yellow-100"
                      title="تعديل"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="px-2 py-2">
                    <button
                      onClick={() => setActionToDelete(action)} // Set the action to delete
                      className="text-red-600 hover:text-red-800"
                      title="حذف"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </td>
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

      {/* Modal for editing/adding action */}
      {showModal && (
<LitigationActionModal
  isOpen={showModal}
  reloadLitigations={reloadLitigations}
  actionTypes={litigationActionTypes}
  onClose={() => setShowModal(false)}
  initialData={editingAction}
  onSubmit={handleSave}
/>

      )}

      {/* Global confirmation modal for delete */}
      <GlobalConfirmDeleteModal
        isOpen={!!actionToDelete}  // Show if actionToDelete is set
        onClose={() => setActionToDelete(null)}  // Reset onClose
        onConfirm={handleConfirmDelete}  // Call handleConfirmDelete when confirmed
        itemName={actionToDelete?.action_type?.action_name || "الإجراء"}  // Pass the action name for the modal
      />
    </div>
  );
}
