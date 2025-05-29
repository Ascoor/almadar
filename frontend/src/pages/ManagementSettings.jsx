import React, { useState, useEffect } from 'react';
import { Plus, Trash, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import GlobalConfirmDeleteModal from '@/components/common/GlobalConfirmDeleteModal';
import SectionHeader from '@/components/common/SectionHeader';
import { useAuth } from '@/components/auth/AuthContext';
import {
  getContractCategories,
  deleteContractCategory,
  createContractCategory,
  updateContractCategory,
} from '../services/api/contracts';
import {
  getLitigationActionTypes,
  deleteLitigationActionType,
  createLitigationActionType,
  updateLitigationActionType,
} from '../services/api/litigations';
import {
  getInvestigationActionTypes,
  deleteInvestigationActionType,
  createInvestigationActionType,
  updateInvestigationActionType,
} from '../services/api/investigations';
import {
  getAdviceTypes,
  deleteAdviceType,
  createAdviceType,
  updateAdviceType,
} from '../services/api/legalAdvices';
import { MainProcedures } from '../assets/icons';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManagementSettings() {
  const [litigationTypes, setLitigationTypes] = useState([]);
  const [investigationTypes, setInvestigationTypes] = useState([]);
  const [contractCategories, setContractCategories] = useState([]);
  const [adviceTypes, setAdviceTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [modalType, setModalType] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const { hasPermission } = useAuth();
  const moduleName = 'managment-lists';
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null, name: '', type: '' });
  const [pageState, setPageState] = useState({});
  const itemsPerPage = 5;

  const can = (action) => hasPermission(`${action} ${moduleName}`);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [lits, invs, cats, advs] = await Promise.all([
        getLitigationActionTypes(),
        getInvestigationActionTypes(),
        getContractCategories(),
        getAdviceTypes(),
      ]);
      setLitigationTypes(Array.isArray(lits?.data) ? lits.data : []);
      setInvestigationTypes(Array.isArray(invs?.data) ? invs.data : []);
      setContractCategories(Array.isArray(cats?.data?.data) ? cats.data.data : []);
      setAdviceTypes(Array.isArray(advs?.data) ? advs.data : []);
      setPageState({ litigation: 1, investigation: 1, contract: 1, advice: 1 });
    } catch (err) {
      toast.error('فشل تحميل بيانات الإعدادات');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    const { id, type } = confirmDelete;
    try {
      switch (type) {
        case 'litigation': await deleteLitigationActionType(id); break;
        case 'investigation': await deleteInvestigationActionType(id); break;
        case 'contract': await deleteContractCategory(id); break;
        case 'advice': await deleteAdviceType(id); break;
      }
      toast.success('تم الحذف بنجاح');
      setConfirmDelete({ isOpen: false, id: null, name: '', type: '' });
      fetchAll();
    } catch (err) {
      toast.error('فشل في حذف العنصر');
    }
  };

  const handleAdd = async () => {
    if (!newItem.trim()) return toast.error('الرجاء إدخال اسم صالح');
    try {
      const payload =
        modalType === 'contract' ? { name: newItem } :
        modalType === 'advice' ? { type_name: newItem } :
        { action_name: newItem };

      if (editMode && editItemId !== null) {
        switch (modalType) {
          case 'litigation': await updateLitigationActionType(editItemId, payload); break;
          case 'investigation': await updateInvestigationActionType(editItemId, payload); break;
          case 'contract': await updateContractCategory(editItemId, payload); break;
          case 'advice': await updateAdviceType(editItemId, payload); break;
        }
        toast.success('تم التحديث بنجاح');
      } else {
        let res;
        switch (modalType) {
          case 'litigation': res = await createLitigationActionType(payload); setLitigationTypes(prev => [...prev, res.data]); break;
          case 'investigation': res = await createInvestigationActionType(payload); setInvestigationTypes(prev => [...prev, res.data]); break;
          case 'contract': res = await createContractCategory(payload); setContractCategories(prev => [...prev, res.data]); break;
          case 'advice': res = await createAdviceType(payload); setAdviceTypes(prev => [...prev, res.data]); break;
        }
        toast.success('تمت الإضافة بنجاح');
      }

      setShowModal(false);
      setNewItem('');
      setEditMode(false);
      setEditItemId(null);
      fetchAll();
    } catch (err) {
      toast.error('فشل في العملية');
    }
  };

  const getItemName = (item, type) =>
    type === 'contract' ? item.name :
    type === 'advice' ? item.type_name :
    item.action_name;

  const renderTable = (title, data, type, delay = 0.1) => {
    const currentPage = pageState[type] || 1;
    const pagedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, type: 'spring', stiffness: 80, damping: 14 }}
        className=" border shadow-greenic-light/20 shadow-lg mt-6 border-border rounded-xl   p-4"
      >
          <h3 className="text-xl font-bold text-center text-greenic-dark  dark:text-greenic-light   dark:bg-greenic-darker  dark:bg-navy-dark/70  shadow-md shadow-greenic-dark/70 p-6 ">{title}</h3>
        <div className="flex justify-between items-center mb-4">
          {can('create') && (
            <button
              onClick={() => {
                setShowModal(true);
                setModalType(type);
                setEditMode(false);
                setNewItem('');
              }}
              className="flex items-center gap-2 text-sm bg-greenic hover:bg-greenic-dark text-navy-darker px-4 py-2 rounded-lg hover:scale-105 transition"
            >
              <Plus />
              <span>إضافة</span>
            </button>
          )}
        </div>

        {pagedData.length === 0 ? (
          <p className="text-muted-foreground">لا توجد بيانات</p>
        ) : (
          <table className="min-w-full text-sm text-center table-auto text-foreground">
            <thead className="bg-greenic bg-greenic-dark/10 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 border-b border-border">الاسم</th>
                {can('edit') && <th>تعديل</th>}
                {can('delete') && <th>الإجراء</th>}
              </tr>
            </thead>
            <tbody>
              {pagedData.map(item => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="border-t border-border hover:bg-greenic-light/20"
                >
                  <td>{getItemName(item, type)}</td>
                  {can('edit') && (
                    <td>
                      <button onClick={() => {
                        setShowModal(true);
                        setModalType(type);
                        setEditMode(true);
                        setEditItemId(item.id);
                        setNewItem(getItemName(item, type));
                      }}><Pencil color="#4ef454"    />
                    
                      </button>
                    </td>
                  )}
                  {can('delete') && (
                    <td>
                      <button onClick={() => setConfirmDelete({ isOpen: true, id: item.id, name: getItemName(item, type), type })}>
                        <Trash  color="#f00f0f"    />
                      </button>
                    </td>
                  )}
                </motion.tr>
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
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 60, damping: 14 }}
      >
        <SectionHeader listName="قوائم البيانات" icon={MainProcedures} />
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6 mt-8">
        {renderTable('إجراءات التقاضي', litigationTypes, 'litigation', 0.1)}
        {renderTable('إجراءات التحقيق', investigationTypes, 'investigation', 0.2)}
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
            <div className="bg-white dark:bg-background w-full max-w-md p-6 rounded-xl shadow-xl">
              <h2 className="text-lg font-bold mb-4">
                {editMode ? 'تعديل العنصر' : 'إضافة عنصر جديد'}
              </h2>
              <input
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
                placeholder="أدخل الاسم هنا"
                className="w-full p-2 border border-greenic-light  dark:border-navy rounded mb-4"
              />
              <div className="flex justify-end gap-2">
                <button className="bg-muted px-4 py-2 rounded" onClick={() => setShowModal(false)}>إلغاء</button>
                <button className="bg-primary text-white px-4 py-2 rounded" onClick={handleAdd}>
                  {editMode ? 'حفظ' : 'إضافة'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <GlobalConfirmDeleteModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null, name: '', type: '' })}
        onConfirm={handleDelete}
        itemName={confirmDelete.name}
      />
    </motion.div>
  );
}
