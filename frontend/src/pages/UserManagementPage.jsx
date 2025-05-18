// src/pages/UsersManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import SectionHeader from '@/components/common/SectionHeader';
import TableComponent from '@/components/common/TableComponent';
import UserModalForm from '@/components/Users/UserModalForm';
import UserInfoCard from '@/components/Users/UserInfoCard';
import { RoleIcon } from '@/assets/icons'; 
import PermissionsSection from '@/components/Users/Sections/PermissionsSection';
import GlobalConfirmDeleteModal from '@/components/common/GlobalConfirmDeleteModal';
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
import {  toast } from 'sonner';

export default function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [allPerms, setAllPerms] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit'
  const [showDelete, setShowDelete] = useState(false);
  const [loading, setLoading] = useState(false);

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
    fetchUsers();
    fetchRoles();
    fetchPerms();
  }, [fetchUsers, fetchRoles, fetchPerms]);
const handlePermChange = async (permName, shouldEnable) => {
  setLoading(true);
  try {
    await changeUserPermission(selectedUser.id, permName, shouldEnable ? 'add' : 'remove');
    toast.success('تم تحديث الصلاحية');

    const updatedUsers = await getUsers(); // بديل مباشر لـ fetchUsers()
    setUsers(updatedUsers); // تحديث users في الواجهة

    const updated = updatedUsers.find(u => u.id === selectedUser.id);
    if (updated) setSelectedUser(updated); // ✅ تحديث المستخدم الحالي نفسه

  } catch {
    toast.error('فشل في تحديث الصلاحية');
  } finally {
    setLoading(false);
  }
};

  const handleCreate = async formData => {
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

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteUser(selectedUser.id);
      toast.success('تم حذف المستخدم');
      setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
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
      <div className="flex justify-center">{user.role?.name || 'غير محدد'}</div>
    ),
    image: (user) => (
      <div className="flex justify-center">
        {user.image ? (
          <img
            src={`${API_CONFIG.baseURL}/${user.image}`}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <span className="text-gray-500">لا توجد صورة</span>
        )}
      </div>
    ),
    actions: (user) => (
      <div className="flex justify-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedUser(user);
            setModalMode('edit');
          }}
          className="p-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded transition"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedUser(user);
            setShowDelete(true);
          }}
          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ),
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <SectionHeader icon={RoleIcon} listName="إدارة المستخدمين والصلاحيات" />
      <div className="flex justify-between items-center">
        <button
          onClick={() => { setSelectedUser(null); setModalMode('add'); }}
          className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-lg shadow hover:opacity-90 transition"
        >
          إضافة مستخدم
        </button>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow min-w-full">
        <TableComponent
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
          onRowClick={user => setSelectedUser(user)}
        />
      </div>

      {(modalMode === 'add' || modalMode === 'edit') && (
        <UserModalForm
          isOpen={true}
          onClose={() => setModalMode(null)}
          selectedUser={modalMode === 'edit' ? selectedUser : null}
          createUser={handleCreate}
          updateUser={handleUpdate}
        />
      )}

      {selectedUser && !modalMode && (
        <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow space-y-4">
          <UserInfoCard user={selectedUser} />
          <h2 className="text-xl font-semibold text-center text-green-700 dark:text-green-400">
            صلاحيات المستخدم
          </h2>
          <PermissionsSection
            allPermissions={allPerms}
            userPermissions={selectedUser.permissions}
            handlePermissionChange={handlePermChange}
            loading={loading}
          />
        </div>
      )}

      {showDelete && (
        <GlobalConfirmDeleteModal
          onDelete={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  );
}
