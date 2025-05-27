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
import { toast } from 'sonner';
import {Button} from '@/components/ui/button';

export default function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [allPerms, setAllPerms] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState(null);
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
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedUser(user);
            setModalMode('edit');
          }}
          className="p-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded shadow transition"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedUser(user);
            setShowDelete(true);
          }}
          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded shadow transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ),
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <SectionHeader icon={RoleIcon} listName="إدارة المستخدمين والصلاحيات" />

      <div className="flex justify-start">
        <Button
          onClick={() => {
            setSelectedUser(null);
            setModalMode('add');
          }}
          className="px-6 py-2 rounded-lg shadow bg-primary text-white hover:bg-primary/90 transition"
        >
          إضافة مستخدم
        </Button>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-zinc-700">
        <div className="min-w-[720px]">
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
  onRowClick={(user) => {
    setSelectedUser(user);
    setModalMode('edit');
  }}
/>

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

      {selectedUser && !modalMode && (
        <div className="mt-6 space-y-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-700">
          <UserInfoCard user={selectedUser} />
          <h2 className="text-xl font-semibold text-center text-green-700 dark:text-green-400 mt-4">
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
