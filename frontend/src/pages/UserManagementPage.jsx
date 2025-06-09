import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';
import { toast } from "sonner";
import SectionHeader from '@/components/common/SectionHeader';
import TableComponent from '@/components/common/TableComponent';
import UserModalForm from '@/components/Users/UserModalForm';
import UserInfoCard from '@/components/Users/UserInfoCard';
import PermissionsSection from '@/components/Users/Sections/PermissionsSection';
import GlobalConfirmDeleteModal from '@/components/common/GlobalConfirmDeleteModal';
import { UsersIcon } from '@/assets/icons';
import { Button } from '@/components/ui/button';
import API_CONFIG from '@/config/config';

import {
  createUser,
  updateUser,
  deleteUser,
  changeUserPermission,
} from '@/services/api/users';

import { useUsers, useRoles, usePermissions } from '@/hooks/dataHooks';

export default function UsersManagementPage() {
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [loading, setLoading] = useState(false);
 const [showNewUserAlert, setShowNewUserAlert] = useState(false);
const [newUserDetails, setNewUserDetails] = useState({ name: '', password: 'الان12345678' });
 
  const permissionsRef = useRef(null);
  const tableRef = useRef(null);

  const {
    data: users = [],
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useUsers();
const { data: rolesData = [], isLoading: rolesLoading } = useRoles();

  const { data: allPerms = [] } = usePermissions();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !modalMode) {
          setExpandedUserId(null);
          setSelectedUser(null);
        }
      },
      { root: null, threshold: 0.5 }
    );

    const el = tableRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [modalMode]);

 const handleCreate = async (formData) => {
  setLoading(true);
  try {
    const newUser = await createUser(formData);
    toast('تم إضافة المستخدم');
    setNewUserDetails({ name: newUser.name, password: 'الان12345678' });
    setShowNewUserAlert(true);
    await refetchUsers();
    setModalMode(null);
  } catch {
    toast('فشل إضافة المستخدم');
  } finally {
    setLoading(false);
  }
};


  const handleUpdate = async (id, formData) => {
    setLoading(true);
    try {
      await updateUser(id, formData);
      toast('success', 'تم تعديل المستخدم');
      await refetchUsers();
      setModalMode(null);
    } catch {
      toast('error', 'فشل تعديل المستخدم');
    } finally {
      setLoading(false);
    }
  };  

const handlePermChange = async (permName, shouldEnable) => {
  setLoading(true);
  try {
    await changeUserPermission(
      selectedUser.id,
      permName,
      shouldEnable ? 'add' : 'remove'
    );

    toast( 'تم تحديث الصلاحية');

    // استخراج القسم
    const [action, ...sectionParts] = permName.toLowerCase().split(' ');
    const sectionPrefix = sectionParts.join(' ');

    // تعديل الصلاحيات محليًا
    let updatedPermissions;

    if (action === 'view' && !shouldEnable) {
      // عند إلغاء "عرض" → إزالة كل صلاحيات نفس القسم
      updatedPermissions = selectedUser.permissions.filter(
        p => !p.name.toLowerCase().includes(sectionPrefix)
      );
    } else {
      // تعديل صلاحية واحدة فقط
      const index = selectedUser.permissions.findIndex(p => p.name === permName);
      if (index > -1) {
        updatedPermissions = selectedUser.permissions.map(p =>
          p.name === permName ? { ...p, enabled: shouldEnable } : p
        );
      } else {
        updatedPermissions = [...selectedUser.permissions, { name: permName, enabled: shouldEnable }];
      }
    }

    setSelectedUser(prev => ({
      ...prev,
      permissions: updatedPermissions,
    }));

    await refetchUsers(); // احتياطيًا
  } catch (error) {
    toast(  'فشل في تحديث الصلاحية');
  } finally {
    setLoading(false);
  }
};




  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteUser(selectedUser.id);
      toast('success', 'تم حذف المستخدم');
      await refetchUsers();
      setShowDelete(false);
      setSelectedUser(null);
    } catch {
      toast('error', 'فشل حذف المستخدم');
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
          <img
            src={`${API_CONFIG.baseURL}/${user.image}`}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border"
          />
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
              loading={usersLoading}
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

      {(modalMode === 'add' || modalMode === 'edit') && (
        <UserModalForm
          isOpen
          onClose={() => setModalMode(null)}
          selectedUser={modalMode === 'edit' ? selectedUser : null}
          createUser={handleCreate}
          updateUser={handleUpdate}
  roles={rolesData} // التعديل هنا 👈
          refreshUsers={refetchUsers}
        />
      )}

      <AnimatePresence>
        {selectedUser && expandedUserId === selectedUser.id && !modalMode && (
          <motion.div
            key="user-details"
            ref={permissionsRef}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-6 space-y-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
{showNewUserAlert && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <h2 className="text-xl font-semibold mb-4">تم إضافة المستخدم الجديد</h2>
      <p className="mb-2">اسم المستخدم: <strong>{newUserDetails.name}</strong></p>
      <p className="mb-4">كلمة المرور الافتراضية: <strong>{newUserDetails.password}</strong></p>
      <Button onClick={() => setShowNewUserAlert(false)} className="mt-4">
        غلق
      </Button>
    </div>
  </div>
)}

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
