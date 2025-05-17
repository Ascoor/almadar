import React, { useState, useEffect, useCallback } from 'react';
import SectionHeader from '../common/SectionHeader';
import TableComponent from '../common/TableComponent';
import UserInfoCard from './UserInfoCard';
import PermissionsSection from './Sections/PermissionsSection';
import UserModalForm from './UserModalForm';
import GlobalConfirmDeleteModal from '../common/GlobalConfirmDeleteModal';
import { useAuth } from '../auth/AuthContext';
import { UserSectionIcon } from '../../assets/icons';
import {
  getUsers,
  getUserPermissions,
  updateUserPermissions,
  updateUser,
  createUser,
  deleteUser
} from '@/services/api/users';

const UsersList = () => {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // === Fetch users ===
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await getUsers();
      if (!Array.isArray(data)) throw new Error('بيانات المستخدمين غير صحيحة');
      setUsers(data);
    } catch (error) {
      setErrorMessage(error.message || 'فشل تحميل المستخدمين');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // === Fetch permissions for selected user ===
  const fetchUserPermissions = async (userId) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await getUserPermissions(userId);
      // استجابة API قد تحتوي على مصفوفة permissions داخل كائن أو مصفوفة مباشرة
      if (response && Array.isArray(response.permissions)) {
        setUserPermissions(response.permissions);
      } else if (Array.isArray(response)) {
        setUserPermissions(response);
      } else {
        throw new Error('بيانات الصلاحيات غير صحيحة');
      }
    } catch (err) {
      setErrorMessage('فشل في تحميل صلاحيات المستخدم');
      setUserPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  // === Toggle permission ===
  const handlePermissionChange = async (section, action) => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      const updatedPermissions = userPermissions.map((perm) => {
        if (perm.name === `${action} ${section}`) {
          return { ...perm, enabled: !perm.enabled };
        }
        return perm;
      });
      setUserPermissions(updatedPermissions);

      const payload = updatedPermissions.map((perm) => ({
        permission_id: perm.id,
        enabled: perm.enabled,
      }));
      await updateUserPermissions(selectedUser.id, payload);

      setSuccessMessage('تم تحديث الصلاحيات بنجاح');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch {
      setErrorMessage('فشل في تحديث الصلاحيات');
      setTimeout(() => setErrorMessage(''), 3000);
      fetchUserPermissions(selectedUser.id);
    } finally {
      setLoading(false);
    }
  };

  // === Delete user handler ===
  const handleDelete = async (userId) => {
    if (userId === user.id) {
      setErrorMessage('لا يمكنك حذف حسابك الخاص');
      setTimeout(() => setErrorMessage(''), 3000);
      setShowDeleteModal(false);
      return;
    }
    setLoading(true);
    try {
      await deleteUser(userId);
      setSuccessMessage('تم حذف المستخدم بنجاح');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeleteModal(false);
      setSelectedUser(null);
      setUserPermissions([]);
      fetchUsers();
    } catch {
      setErrorMessage('فشل في حذف المستخدم');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // === Handle table row click to select user and load permissions ===
  const handleRowClick = (user) => {
    setSelectedUser(user);
    fetchUserPermissions(user.id);
    setErrorMessage('');
    setSuccessMessage('');
  };

  // === Handle edit click to open modal with user data ===
  const handleEditClick = (userId) => {
    const userToEdit = users.find(u => u.id === userId);
    if (userToEdit) {
      setSelectedUser(userToEdit);
      setShowModal(true);
    }
  };

  // === Prompt delete modal ===
  const promptDelete = (userId) => {
    const userToDelete = users.find(u => u.id === userId);
    if (userToDelete) {
      setSelectedUser(userToDelete);
      setShowDeleteModal(true);
    }
  };

  // === Table column renderers ===
  const customRenderers = {
    image: (row) =>
      row.image ? (
        <img
          src={row.image}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover"
        />
      ) : (
        <span>لا توجد صورة</span>
      ),
    position: (row) => (
      <div>
        <div>{row.position}</div>
        {row.position === 'موظف إدارى' && row.employee_position && (
          <div className="text-sm text-gray-500">{row.employee_position}</div>
        )}
      </div>
    ),
  };

  // === Table headers ===
  const headers = [
    { key: 'id', text: 'الرقم' },
    { key: 'name', text: 'الاسم' },
    { key: 'email', text: 'البريد الإلكتروني' },
    { key: 'role', text: 'الدور' },
    { key: 'position', text: 'الوظيفة', render: customRenderers.position },
    { key: 'image', text: 'الصورة', render: customRenderers.image },
  ];

  return (
    <>
      <SectionHeader icon={UserSectionIcon} listName="الأدوار و المستخدمين" />

      {/* تنبيهات النجاح والخطأ */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-200 text-green-800 rounded text-center font-semibold">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-200 text-red-800 rounded text-center font-semibold">
          {errorMessage}
        </div>
      )}

      <div className="p-5 bg-gradient-to-r from-blue-200 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg min-h-[60vh]">


{showModal && (
  <UserModalForm
    isOpen={showModal}
    selectedUser={selectedUser}
    onClose={() => setShowModal(false)}
    refreshUsers={fetchUsers}
    createUser={createUser}
    updateUser={updateUser}
  />
)}


        {/* عرض مودال تأكيد الحذف */}
        {showDeleteModal && (
          <GlobalConfirmDeleteModal
            onDelete={() => handleDelete(selectedUser.id)}
            onCancel={() => setShowDeleteModal(false)}
          />
        )}

        {/* جدول المستخدمين أو عرض تفاصيل المستخدم */}
        {!selectedUser ? (
          loading ? (
            <div className="flex items-center justify-center h-48 text-lg font-semibold text-gray-600 dark:text-gray-300">
              جاري التحميل...
            </div>
          ) : (
 

<TableComponent
  data={users}
  headers={headers}
  onRowClick={handleRowClick}
  onEdit={handleEditClick}   
  onDelete={promptDelete}
  customRenderers={customRenderers}
/>
          )
        ) : (
          <>
            <button
              onClick={() => {
                setSelectedUser(null);
                setUserPermissions([]);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className="mb-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
            >
              الرجوع إلى القائمة
            </button>

            <UserInfoCard user={selectedUser} />

            <h3 className="text-xl font-semibold mt-6 mb-3">
              صلاحيات المستخدم : {selectedUser.name}
            </h3>

            <PermissionsSection
              section="all"
              permissions={userPermissions}
              handlePermissionChange={handlePermissionChange}
            />
          </>
        )}
      </div>
    </>
  );
};

export default UsersList;
