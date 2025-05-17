// src/pages/UsersManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import SectionHeader from '@/components/common/SectionHeader';
import TableComponent from '@/components/common/TableComponent';
import UserModalForm from '@/components/Users/UserModalForm';
import UserInfoCard from '@/components/Users/UserInfoCard';
import PermissionsSection from '@/components/Users/Sections/PermissionsSection';
import GlobalConfirmDeleteModal from '@/components/common/GlobalConfirmDeleteModal';
import API_CONFIG from '../config/config';
import { Edit2, Trash2 } from 'lucide-react';
import {
  getUsers,
  getUserPermissions,
  getPermissions,
  createUser,
  updateUser,
  deleteUser,
  givePermission,
  revokePermission,
  assignRole,
  removeRole,
  getRoles,
} from '@/services/api/users';
import { Toaster, toast } from 'sonner';

export default function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [allPerms, setAllPerms] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit'
  const [showDelete, setShowDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  // — fetch data —
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUsers(); // توقع أن يعيد users مع علاقة role و permissions
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

  // — create / update user —
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

  // — delete user —
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

  // — permission change —
  const handlePermChange = async (permId, enabled) => {
    setLoading(true);
    try {
      const perm = allPerms.find(p => p.id === permId);
      if (enabled) {
        await givePermission(selectedUser.id, perm.name);
        toast.success('تم إضافة الصلاحية');
        setSelectedUser(u => ({
          ...u,
          permissions: [...u.permissions, perm],
        }));
      } else {
        await revokePermission(selectedUser.id, perm.name);
        toast.success('تم إزالة الصلاحية');
        setSelectedUser(u => ({
          ...u,
          permissions: u.permissions.filter(p => p.id !== permId),
        }));
      }
    } catch {
      toast.error('فشل في تحديث الصلاحية');
    } finally {
      fetchUsers()
      setLoading(false);
    }
  };

  // — table renderers —
  const customRenderers = {
    role: user => user.role?.name || 'غير محدد',
    image: user => (
      user.image
        ? <img
            src={`${API_CONFIG.baseURL}/${user.image}`}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        : <span className="text-gray-500">لا توجد صورة</span>
    ),
    actions: user => (
      <div className="flex gap-2">
        <button
          onClick={e => {
            e.stopPropagation();
            setSelectedUser(user);
            setModalMode('edit');
          }}
          className="p-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded transition"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={e => {
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
      <Toaster position="top-center" richColors />
      <div className="flex justify-between items-center">
        <SectionHeader sectionTitle="إدارة المستخدمين والصلاحيات" />
        <button
          onClick={() => { setSelectedUser(null); setModalMode('add'); }}
          className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-lg shadow hover:opacity-90 transition"
        >
          إضافة مستخدم
        </button>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
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

      {/* Add / Edit Modal */}
      {(modalMode === 'add' || modalMode === 'edit') && (
        <UserModalForm
          isOpen={true}
          onClose={() => setModalMode(null)}
          selectedUser={modalMode === 'edit' ? selectedUser : null}
          createUser={handleCreate}
          updateUser={handleUpdate}
        />
      )}

      {/* User Info + Permissions */}
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

      {/* Confirm Delete Modal */}
      {showDelete && (
        <GlobalConfirmDeleteModal
          onDelete={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  );
}
