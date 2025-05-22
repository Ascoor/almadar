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

const can = (action) => hasPermission(`${action} ${moduleName}`);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null, name: '', type: '' });
  const [pageState, setPageState] = useState({});
  const itemsPerPage = 5;

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
        default:
          return;
      }
      toast.success('تم الحذف بنجاح');
      setConfirmDelete({ isOpen: false, id: null, name: '', type: '' });
      fetchAll();
    } catch (err) {
      toast.error('فشل في حذف العنصر');
      console.error(err);
    }
  };

  const handleAdd = async () => {
    if (!newItem.trim()) {
      toast.error('الرجاء إدخال اسم صالح');
      return;
    }
    try {
      const payload =
        modalType === 'contract'
          ? { name: newItem }
          : modalType === 'advice'
          ? { type_name: newItem }
          : { action_name: newItem };

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
          default:
            return;
        }
        toast.success('تم التحديث بنجاح');
      } else {
        let res;
        switch (modalType) {
          case 'litigation':
            res = await createLitigationActionType(payload);
            setLitigationTypes(prev => [...prev, res.data]);
            break;
          case 'investigation':
            res = await createInvestigationActionType(payload);
            setInvestigationTypes(prev => [...prev, res.data]);
            break;
          case 'contract':
            res = await createContractCategory(payload);
            setContractCategories(prev => [...prev, res.data]);
            break;
          case 'advice':
            res = await createAdviceType(payload);
            setAdviceTypes(prev => [...prev, res.data]);
            break;
          default:
            return;
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
      console.error(err);
    }
  };

  const getItemName = (item, type) => {
    switch (type) {
      case 'litigation':
      case 'investigation':
        return item.action_name;
      case 'contract':
        return item.name;
      case 'advice':
        return item.type_name;
      default:
        return '';
    }
  };

  const renderTable = (title, data, type) => {
    const currentPage = pageState[type] || 1;
    const pagedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
      <div className="bg-card border mt-6 border-border rounded-xl shadow-md p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-primary">{title}</h3>
         {can('create') && (
  <button
    onClick={() => {
      setShowModal(true);
      setModalType(type);
      setEditMode(false);
      setNewItem('');
    }}
    className="flex items-center gap-2 text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:scale-105 transition"
  >
    <Plus />
    <span>إضافة</span>
  </button>
)}

        </div>

        {pagedData.length === 0 ? (
          <p className="text-muted-foreground">لا توجد بيانات</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-sm border border-border">
            <table className="min-w-full text-sm text-center table-auto text-foreground">
              <thead className="bg-muted text-muted-foreground font-semibold uppercase tracking-wide text-xs">
                <tr>
                  <th className="px-4 py-3 border-b border-border min-w-[200px]">الاسم</th>
                {can('edit') && (
      <th className="px-4 py-3 border-b border-border w-16">تعديل</th>
    )}
        {can('delete') && (
      <th className="px-4 py-3 border-b border-border w-20">الإجراء</th>
    )}
                </tr>
              </thead>
       <tbody>
  {pagedData.map(item => (
    <tr
      key={`${type}-${item.id}`}
      className="border-t border-border hover:bg-accent transition-colors duration-150"
    >
      <td className="px-3 py-2 break-words whitespace-pre-wrap text-sm font-medium">
        {getItemName(item, type)}
      </td>

      {can('edit') && (
        <td className="px-2 py-2">
          <button
            onClick={() => {
              setShowModal(true);
              setModalType(type);
              setEditMode(true);
              setEditItemId(item.id);
              setNewItem(getItemName(item, type));
            }}
            className="text-blue-600 hover:text-blue-800 transition"
            title="تعديل"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </td>
      )}

      {can('delete') && (
        <td className="px-2 py-2">
          <button
            onClick={() =>
              setConfirmDelete({
                isOpen: true,
                id: item.id,
                name: getItemName(item, type),
                type,
              })
            }
            className="text-reded hover:text-reded-dark transition"
            title="حذف"
          >
            <Trash className="w-4 h-4" />
          </button>
        </td>
      )}
    </tr>
  ))}
</tbody>

            </table>
            {/* Pagination controls */}
{data.length > itemsPerPage && (
  <div className="flex justify-center items-center gap-2 mt-4">
    <button
      className="px-3 py-1 text-sm rounded border border-border bg-background hover:bg-muted disabled:opacity-50"
      disabled={currentPage === 1}
      onClick={() =>
        setPageState((prev) => ({
          ...prev,
          [type]: currentPage - 1,
        }))
      }
    >
      السابق
    </button>

    <span className="text-sm font-medium text-muted-foreground">
      الصفحة {currentPage} من {Math.ceil(data.length / itemsPerPage)}
    </span>

    <button
      className="px-3 py-1 text-sm rounded border border-border bg-background hover:bg-muted disabled:opacity-50"
      disabled={currentPage === Math.ceil(data.length / itemsPerPage)}
      onClick={() =>
        setPageState((prev) => ({
          ...prev,
          [type]: currentPage + 1,
        }))
      }
    >
      التالي
    </button>
  </div>
)}

          </div>
        )}
      </div>
      
    );
  };

  return (
    <div className="bg-card border mt-6 border-border rounded-xl shadow-md p-4 mb-6">
      <SectionHeader listName="قوائم البيانات" icon={MainProcedures} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderTable('إجراءات التقاضي', litigationTypes, 'litigation')}
        {renderTable('إجراءات التحقيق', investigationTypes, 'investigation')}
        {renderTable('فئات العقود', contractCategories, 'contract')}
        {renderTable('أنواع الرأي والمشورة', adviceTypes, 'advice')}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-card p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-foreground">
              {editMode ? 'تعديل العنصر' : 'إضافة عنصر جديد'}
            </h2>
            <input
              type="text"
              value={newItem}
              onChange={e => setNewItem(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-border rounded bg-background text-foreground"
              placeholder="أدخل الاسم هنا"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-muted text-muted-foreground rounded hover:bg-muted/80"
                onClick={() => {
                  setShowModal(false);
                  setNewItem('');
                  setEditMode(false);
                  setEditItemId(null);
                }}
              >
                إلغاء
              </button>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90" onClick={handleAdd}>
                {editMode ? 'حفظ التعديلات' : 'إضافة'}
              </button>
            </div>
          </div>
        </div>
      )}

      <GlobalConfirmDeleteModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, id: null, name: '', type: '' })}
        onConfirm={handleDelete}
        itemName={confirmDelete.name}
      />
    </div>
  );
}
