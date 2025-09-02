import React, { useState, lazy, Suspense } from 'react';
import { Plus, Trash, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { MainProcedures } from '@/assets/icons';
import {
  useContractCategories,
  useAdviceTypes,
  useActionTypes,
} from '@/hooks/dataHooks';
import AuthSpinner from '@/components/common/Spinners/AuthSpinner';
import {
  deleteContractCategory,
  createContractCategory,
  updateContractCategory,
} from '@/services/api/contracts';
import {
  deleteLitigationActionType,
  createLitigationActionType,
  updateLitigationActionType,
} from '@/services/api/litigations';
import {
  deleteInvestigationActionType,
  createInvestigationActionType,
  updateInvestigationActionType,
} from '@/services/api/investigations';
import {
  deleteAdviceType,
  createAdviceType,
  updateAdviceType,
} from '@/services/api/legalAdvices';
import { useQueryClient } from '@tanstack/react-query';
const GlobalConfirmDeleteModal = lazy(
  () => import('@/components/common/GlobalConfirmDeleteModal'),
);
const SectionHeader = lazy(() => import('@/components/common/SectionHeader'));

const ITEMS_PER_PAGE = 5;

export default function ManagementSettings() {
  const { hasPermission } = useAuth();
  const moduleName = 'managment-lists';
  const queryClient = useQueryClient();

  const { data: litigationTypes = [] } = useActionTypes('litigation');
  const { data: investigationTypes = [] } = useActionTypes('investigation');
  const { data: contractCategories = [] } = useContractCategories();
  const { data: adviceTypes = [] } = useAdviceTypes();

  const [pageState, setPageState] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [modalType, setModalType] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    id: null,
    name: '',
    type: '',
  });
  const [expandedItem, setExpandedItem] = useState(null);

  const can = (action) => hasPermission(`${action} ${moduleName}`);

  const getItemName = (item, type) =>
    type === 'contract'
      ? item.name
      : type === 'advice'
        ? item.type_name
        : item.action_name;

  const handleDelete = async () => {
    const { id, type } = confirmDelete;
    try {
      switch (type) {
        case 'litigation':
          await deleteLitigationActionType(id);
          break;
        case 'investigation':
          await deleteInvestigationActionType(id);
          break;
        case 'contract':
          await deleteContractCategory(id);
          break;
        case 'advice':
          await deleteAdviceType(id);
          break;
      }
      toast.success('تم الحذف بنجاح');
      setConfirmDelete({ isOpen: false, id: null, name: '', type: '' });
      queryClient.invalidateQueries(['actionTypes', type]);
      queryClient.invalidateQueries({ queryKey: ['contractCategories'] });
      queryClient.invalidateQueries({ queryKey: ['adviceTypes'] });
    } catch {
      toast.error('فشل في حذف العنصر');
    }
  };

  const handleAdd = async () => {
    if (!newItem.trim()) return toast.error('الرجاء إدخال اسم صالح');
    const payload =
      modalType === 'contract'
        ? { name: newItem }
        : modalType === 'advice'
          ? { type_name: newItem }
          : { action_name: newItem };
    try {
      if (editMode && editItemId !== null) {
        switch (modalType) {
          case 'litigation':
            await updateLitigationActionType(editItemId, payload);
            break;
          case 'investigation':
            await updateInvestigationActionType(editItemId, payload);
            break;
          case 'contract':
            await updateContractCategory(editItemId, payload);
            break;
          case 'advice':
            await updateAdviceType(editItemId, payload);
            break;
        }
        toast.success('تم التحديث بنجاح');
      } else {
        switch (modalType) {
          case 'litigation':
            await createLitigationActionType(payload);
            break;
          case 'investigation':
            await createInvestigationActionType(payload);
            break;
          case 'contract':
            await createContractCategory(payload);
            break;
          case 'advice':
            await createAdviceType(payload);
            break;
        }
        toast.success('تمت الإضافة بنجاح');
      }
      setShowModal(false);
      setNewItem('');
      setEditMode(false);
      setEditItemId(null);
      queryClient.invalidateQueries(['actionTypes', modalType]);
      queryClient.invalidateQueries({ queryKey: ['contractCategories'] });
      queryClient.invalidateQueries({ queryKey: ['adviceTypes'] });
    } catch {
      toast.error('فشل في العملية');
    }
  };

  const renderTable = (title, data, type, delay = 0.1) => {
    const currentPage = pageState[type] || 1;
    const pagedData = Array.isArray(data)
      ? data.slice(
          (currentPage - 1) * ITEMS_PER_PAGE,
          currentPage * ITEMS_PER_PAGE,
        )
      : [];

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, type: 'spring', stiffness: 80, damping: 14 }}
        className="mt-6 border border-border rounded-xl p-4 shadow-lg shadow-primary/20"
      >
        <h3 className="p-6 text-xl font-bold text-center bg-secondary/20 text-fg shadow-md">
          {title}
        </h3>
        <div className="flex justify-between items-center mb-4">
          {can('create') && (
            <button
              onClick={() => {
                setShowModal(true);
                setModalType(type);
                setEditMode(false);
                setNewItem('');
              }}
              className="flex items-center gap-2 rounded-2xl px-4 py-2 text-sm bg-primary text-[color:var(--primary-foreground)] hover:shadow-glow hover:scale-105 transition"
            >
              <Plus />
              <span>إضافة</span>
            </button>
          )}
        </div>

        {pagedData.length === 0 ? (
          <p className="text-muted">لا توجد بيانات</p>
        ) : (
          <table className="min-w-full text-sm text-center table-auto border border-border rounded-xl overflow-hidden shadow-lg">
            <thead className="bg-/40 text-fg">
              <tr>
                <th className="px-4 py-3 border-b border-border">الاسم</th>
                {can('edit') && (
                  <th className="border-b border-border">تعديل</th>
                )}
                {can('delete') && (
                  <th className="border-b border-border">الإجراء</th>
                )}
              </tr>
            </thead>
            <tbody className="text-fg bg-card">
              {pagedData.map((item) => (
                <React.Fragment key={item.id}>
                  <motion.tr
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="border-t border-border transition-colors cursor-pointer hover:bg-primary/10"
                    onClick={() =>
                      setExpandedItem((prev) =>
                        prev?.id === item.id && prev?.type === type
                          ? null
                          : { id: item.id, type },
                      )
                    }
                  >
                    <td className="px-4 py-2">{getItemName(item, type)}</td>
                    {can('edit') && (
                      <td>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowModal(true);
                            setModalType(type);
                            setEditMode(true);
                            setEditItemId(item.id);
                            setNewItem(getItemName(item, type));
                          }}
                          className="hover:text-primary transition"
                        >
                          <Pencil
                            className="text-primary"
                            absoluteStrokeWidth
                            size={18}
                          />
                        </button>
                      </td>
                    )}
                    {can('delete') && (
                      <td>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDelete({
                              isOpen: true,
                              id: item.id,
                              name: getItemName(item, type),
                              type,
                            });
                          }}
                          className="hover:text-red-500 dark:hover:text-red-400 transition"
                        >
                          <Trash color="red" absoluteStrokeWidth size={18} />
                        </button>
                      </td>
                    )}
                  </motion.tr>

                  <AnimatePresence>
                    {expandedItem?.id === item.id &&
                      expandedItem?.type === type && (
                        <motion.tr
                          key={`expanded-${item.id}`}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td
                            colSpan={3}
                            className="p-4 bg-muted/30 dark:bg-navy/30 text-right rounded-b-xl text-gray-700 dark:text-navy-darker"
                          >
                            تفاصيل إضافية للعنصر:{' '}
                            <strong>{getItemName(item, type)}</strong>
                          </td>
                        </motion.tr>
                      )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    );
  };

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Suspense fallback={<AuthSpinner />}>
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 60, damping: 14 }}
        >
          <SectionHeader   showBackButton listName="قوائم البيانات" icon={MainProcedures} />
        </motion.div>
      </Suspense>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6 mt-8">
        {renderTable('إجراءات التقاضي', litigationTypes, 'litigation', 0.1)}
        {renderTable(
          'إجراءات التحقيق',
          investigationTypes,
          'investigation',
          0.2,
        )}
        {renderTable('فئات العقود', contractCategories, 'contract', 0.3)}
        {renderTable('أنواع الرأي والمشورة', adviceTypes, 'advice', 0.4)}
      </div>
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="bg-white dark:bg-bg w-full max-w-md p-6 rounded-xl shadow-xl">
              <h2 className="text-lg font-bold mb-4">
                {editMode ? 'تعديل العنصر' : 'إضافة عنصر جديد'}
              </h2>
              <input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="أدخل الاسم هنا"
                className="w-full p-2 border border-greenic-light dark:border-navy rounded mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  className="bg-muted px-4 py-2 rounded"
                  onClick={() => setShowModal(false)}
                >
                  إلغاء
                </button>
                <button
                  className="bg-primary text-white px-4 py-2 rounded"
                  onClick={handleAdd}
                >
                  {editMode ? 'حفظ' : 'إضافة'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Suspense fallback={null}>
        {confirmDelete.isOpen && (
          <GlobalConfirmDeleteModal
            isOpen={confirmDelete.isOpen}
            onClose={() =>
              setConfirmDelete({ isOpen: false, id: null, name: '', type: '' })
            }
            onConfirm={handleDelete}
            itemName={confirmDelete.name}
          />
        )}
      </Suspense>
    </motion.div>
  );
}
