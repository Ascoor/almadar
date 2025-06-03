import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeader from '@/components/common/SectionHeader';
import TableComponent from '@/components/common/TableComponent';
import UserModalForm from '@/components/Users/UserModalForm';
import UserInfoCard from '@/components/Users/UserInfoCard';
import PermissionsSection from '@/components/Users/Sections/PermissionsSection';
import GlobalConfirmDeleteModal from '@/components/common/GlobalConfirmDeleteModal';
import { UsersIcon } from '@/assets/icons';
import API_CONFIG from '../config/config';
import { Edit2, Trash2 } from 'lucide-react';
import {
  getUsers,
  getPermissions,
  createUser,
  updateUser,
  deleteUser,
  changeUserPermission,
  getRoles,
} from '@/services/api/users';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [allPerms, setAllPerms] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const permissionsRef = useRef(null);
const tableRef = useRef(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch {
      toast.error('فشل تحميل المستخدمين');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      setRoles(await getRoles());
    } catch {
      toast.error('فشل تحميل الأدوار');
    }
  }, []);

  const fetchPerms = useCallback(async () => {
    try {
      setAllPerms(await getPermissions());
    } catch {
      toast.error('فشل تحميل الصلاحيات');
    }
  }, []);
useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setExpandedUserId(null);
        setSelectedUser(null);
      }
    },
    {
      root: null,
      threshold: 0.5, // 50% من ظهور الجدول كافية للإغلاق
    }
  );

  if (tableRef.current) {
    observer.observe(tableRef.current);
  }

  return () => {
    if (tableRef.current) {
      observer.unobserve(tableRef.current);
    }
  };
}, []);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchPerms();
  }, [fetchUsers, fetchRoles, fetchPerms]);
 

  const handleCreate = async (formData) => {
    setLoading(true);
    try {
      await createUser(formData);
      toast.success('تم إضافة المستخدم');
      await fetchUsers();
      setModalMode(null);
    } catch {
      toast.error('فشل إضافة المستخدم');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, formData) => {
    setLoading(true);
    try {
      await updateUser(id, formData);
      toast.success('تم تعديل المستخدم');
      await fetchUsers();
      setModalMode(null);
    } catch {
      toast.error('فشل تعديل المستخدم');
    } finally {
      setLoading(false);
    }
  };

  const handlePermChange = async (permName, shouldEnable) => {
    setLoading(true);
    try {
      await changeUserPermission(selectedUser.id, permName, shouldEnable ? 'add' : 'remove');
      toast.success('تم تحديث الصلاحية');
      const updatedUsers = await getUsers();
      setUsers(updatedUsers);
      const updated = updatedUsers.find(u => u.id === selectedUser.id);
      if (updated) setSelectedUser(updated);
    } catch {
      toast.error('فشل في تحديث الصلاحية');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteUser(selectedUser.id);
      toast.success('تم حذف المستخدم');
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      setShowDelete(false);
      setSelectedUser(null);
    } catch {
      toast.error('فشل حذف المستخدم');
    } finally {
      setLoading(false);
    }
  };

  const customRenderers = {
    role: (user) => (
      <div className="text-center text-sm font-semibold text-green-700 dark:text-green-400">
        {user.roles?.[0]?.name || '—'}
      </div>
    ),
    image: (user) => (
      <div className="flex justify-center">
        {user.image ? (
          <img src={`${API_CONFIG.baseURL}/${user.image}`} alt={user.name} className="w-10 h-10 rounded-full object-cover border" />
        ) : (
          <span className="text-gray-500 text-xs">لا توجد صورة</span>
        )}
      </div>
    ),
    actions: (user) => (
      <div className="flex justify-center gap-2">
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedUser(user);
            setModalMode('edit');
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded shadow transition"
        >
          <Edit2 className="w-4 h-4" />
        </motion.button>
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedUser(user);
            setShowDelete(true);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded shadow transition"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>
    ),
  };

  return (
    <div className="p-6 sm:p-4 lg:p-6 bg-white dark:bg-royal-darker/10">
      <motion.div
        key="section-header"
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ type: 'spring', stiffness: 60, damping: 18, delay: 0.1 }}
      >
        <SectionHeader icon={UsersIcon} listName="إدارة المستخدمين والصلاحيات" />
      </motion.div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-zinc-700">
        <div className="w-full max-w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: 'spring', stiffness: 60, damping: 25 }}
          >
            <div ref={tableRef}>
  <TableComponent 
              moduleName="users"
              data={users}
              headers={[
                { key: 'id', text: 'الرقم' },
                { key: 'name', text: 'الاسم' },
                { key: 'email', text: 'البريد الإلكتروني' },
                { key: 'role', text: 'الدور' },
                { key: 'image', text: 'الصورة' },
                { key: 'actions', text: 'إجراءات' },
              ]}
              customRenderers={customRenderers}
              renderAddButton={{
                render: () => (
                  <Button variant="default" onClick={() => {
                    setSelectedUser(null);
                    setModalMode('add');
                  }}>
                    إضافة مستخدم
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </Button>
                ),
              }}
              onRowClick={(user) => {
                setExpandedUserId((prevId) => (prevId === user.id ? null : user.id));
                setSelectedUser(user);
                setTimeout(() => {
                  if (permissionsRef.current) {
                    permissionsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 300);
              }}
            />
            </div>
          </motion.div>
        </div>
      </div>

      {(modalMode === 'add' || modalMode === 'edit') && (
        <UserModalForm
          isOpen
          onClose={() => setModalMode(null)}
          selectedUser={modalMode === 'edit' ? selectedUser : null}
          createUser={handleCreate}
          updateUser={handleUpdate}
          refreshUsers={fetchUsers}
        />
      )}

      <AnimatePresence>
        {selectedUser && expandedUserId === selectedUser.id && !modalMode && (
<motion.div
  key="user-details"
  ref={permissionsRef} // هذا يغطي الآن كرت البيانات + الصلاحيات
  layout
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 20 }}
  transition={{ duration: 0.3 }}
  className="overflow-hidden"
>
  <div className="mt-6 space-y-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 ">
       <UserInfoCard user={selectedUser} />
              <h2 className="text-xl font-semibold text-center text-green-700 dark:text-green-400 mt-4">صلاحيات المستخدم</h2>
              <PermissionsSection
                allPermissions={allPerms}
                userPermissions={selectedUser.permissions}
                handlePermissionChange={handlePermChange}
                loading={loading}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showDelete && (
        <GlobalConfirmDeleteModal
          isOpen={showDelete}
          itemName={selectedUser?.name}
          onConfirm={handleDelete}
          onClose={() => setShowDelete(false)}
        />
      )}
    </div>
  );
}
