import React, { useState, useEffect, useCallback } from 'react';
import { Bell, User, Shield } from 'lucide-react';
import PermissionsSection from './PermissionsSection';   
import SectionHeader from '../../common/SectionHeader';
import LogoImageSpinner from '../../common/Spinners/GlobalSpinner';
import { RoleIcon } from '../../../assets/icons'; 
import debounce from 'lodash/debounce';
import UserInfoCard from './UserCard'; 

// استيراد دوال API
import { getUsers,getPermissions, getUserPermissions, saveUserPermissions } from '@/services/api/users';

const RoleManagement = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [errorMessage , setErrorMessage ] = useState({});

  const [userPermissions, setUserPermissions] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: '', type: '' });

  // دالة جلب المستخدمين مع تحكم في حالة التحميل والخطأ
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await getUsers(); // استدعاء API من ملف الخدمات
      if (!Array.isArray(data)) {
        throw new Error('خطأ في استجابة المستخدمين');
      }
      setUsers(data);
    } catch (error) {
      setErrorMessage(error.message || 'فشل في تحميل المستخدمين');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);


  const handleSelectUser = async e => {
    const userId = +e.target.value;
    const user = users.find(u => u.id === userId) || null;
    setSelectedUser(user);

    if (!user) return;

    setLoading(true);
    try {
      const up = await getUserPermissions(userId); // ترجع مصفوفة من { id, name, section, pivot:{enabled}}
      // نطبّق تمكين الصلاحيات
      const updated = Object.keys(permissions).reduce((acc, section) => {
        acc[section] = permissions[section].map(p => ({
          ...p,
          enabled: up.some(uperm => uperm.name === p.name && uperm.section === section && uperm.pivot.enabled)
        }));
        return acc;
      }, {});
      setUserPermissions(updated);
    } catch (err) {
      console.error('getUserPermissions:', err);
      setAlert({ message: 'خطأ في جلب صلاحيات المستخدم.', type: 'error' });
      setTimeout(() => setAlert({ message: '', type: '' }), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (section, name) => {
    setUserPermissions(prev => ({
      ...prev,
      [section]: prev[section].map(p =>
        p.name === name ? { ...p, enabled: !p.enabled } : p
      )
    }));
  };

  const handleSavePermissions = async () => {
    if (!selectedUser) {
      setAlert({ message: 'يرجى اختيار مستخدم أولاً.', type: 'error' });
      setTimeout(() => setAlert({ message: '', type: '' }), 3000);
      return;
    }

    setLoading(true);
    try {
      // نجهّز payload
      const payload = Object.entries(userPermissions).flatMap(([section, perms]) =>
        perms.map(p => ({ permission_id: p.id, enabled: p.enabled }))
      );

      await saveUserPermissions(selectedUser.id, payload);
      setAlert({ message: 'تم تحديث الصلاحيات بنجاح!', type: 'success' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      fetchData();
    } catch (err) {
      console.error('saveUserPermissions:', err);
      setAlert({ message: 'فشل في تحديث الصلاحيات.', type: 'error' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
      setTimeout(() => setAlert({ message: '', type: '' }), 3000);
    }
  };

  const handlePasswordReset = useCallback(async () => {
    if (!selectedUser) {
      setAlert({ message: 'يرجى اختيار مستخدم أولاً.', type: 'error' });
      return;
    }
    // ... يمكنك استدعاء API إعادة التعيين هنا
  }, [selectedUser]);

  return (
    <div className='container mx-auto h-full px-4'>
      <SectionHeader sectionTitle='إدارة الصلاحيات' imageSrc={RoleIcon} />

      <div className='mt-4 p-6 bg-gradient-to-br from-gray-300 to-gray-100 dark:from-green-700 dark:to-blue-900 rounded-xl text-white shadow-lg'>
        {/* اختيار المستخدم */}
        <div className='w-full text-center mb-4'>
          <select
            onChange={handleSelectUser}
            className='w-full md:w-1/2 p-3 bg-white text-gray-900 rounded shadow'
          >
            <option value=''>-- اختر مستخدم --</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>

        {selectedUser && (
          <>
            {/* زر إعادة التعيين */}
            <div className='flex justify-center mb-4'>
              <button
                onClick={handlePasswordReset}
                className='px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-full shadow text-white'
              >
                <Bell className='inline mr-2' /> إعادة تعيين كلمة السر
              </button>
            </div>

            {/* بطاقة معلومات المستخدم */}
            <div className='bg-white dark:bg-gray-700 mb-6 p-4 rounded shadow'>
              <h2 className='text-xl font-semibold mb-2 flex items-center'>
                <User className='mr-2 text-green-600' /> بيانات المستخدم
              </h2>
              <UserInfoCard user={selectedUser} />
            </div>

            {/* قسم الصلاحيات */}
            <div className='bg-white dark:bg-gray-700 p-4 rounded shadow'>
              <h2 className='text-xl font-semibold mb-4 flex items-center'>
                <Shield className='mr-2 text-purple-600' /> صلاحيات المستخدم
              </h2>

              {alert.message && (
                <div
                  className={`mb-4 p-3 rounded ${
                    alert.type === 'success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {alert.message}
                </div>
              )}

              {loading
                ? <LogoImageSpinner />
                : (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                    {Object.entries(userPermissions).map(([section, perms]) => (
                      <PermissionsSection
                        key={section}
                        section={section}
                        permissions={perms}
                        handlePermissionChange={handlePermissionChange}
                      />
                    ))}
                  </div>
                )
              }

              <div className='mt-6 flex justify-center'>
                <button
                  onClick={handleSavePermissions}
                  className='px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow'
                >
                  حفظ التغييرات
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RoleManagement;
