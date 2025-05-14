import React, { useState, useEffect, useCallback } from 'react';
import TableComponent from '../common/TableComponent';
import SectionHeader from '../common/SectionHeader';
import UserModalForm from './userModalForm';
import {useAuth} from '../auth/AuthContext';
import GlobalConfirmDeleteModal from '../common/GlobalConfirmDeleteModal';
import { UserManager } from '../../assets/images';

const UsersList = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [Users, setUsers] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { http, user } = useAuth();

  // Fetch  users - memoized to avoid recreating the function unnecessarily
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setErrorMessage(''); // Clear any previous error
    try {

      await new Promise(resolve => setTimeout(resolve, 2000));

      const { data } = await http.get('/api/-users');
      if (data && Array.isArray(data.Users)) {
        setUsers(data.Users);
      } else {
        throw new Error('Invalid data format: expected an array');
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setUsers([]); // Clear the state if an error occurs
      setErrorMessage(error.message || 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Custom rendering logic for the table
  const customRenderers = {
    image: row => (
      row.image ? (
        <img
          src={row.image}
          alt='Profile'
          style={{ width: 50, height: 50, borderRadius: '50%' }}
        />
      ) : (
        <span>لا توجد صورة</span>
      )
    ),
    position: row => (
      <div>
        <div>{row.position}</div>
        {row.position === 'موظف إدارى' && row._position && (
          <div style={{ fontSize: 'smaller', color: 'gray' }}>
            {row._position}
          </div>
        )}
      </div>
    ),
  };

  const headers = [
    { key: 'id', text: 'الرقم' },
    { key: 'name', text: 'الاسم' },
    { key: 'email', text: 'البريد الإلكتروني' },
    { key: 'role', text: 'الدور' },
    { key: 'position', text: 'الوظيفة', render: customRenderers.position },
    { key: 'image', text: 'الصورة', render: customRenderers.image },
  ];

  const handleDelete = async userId => {
    if (userId === user.id) {
      setShowDeleteModal(false);
      setErrorMessage('لا تستطيع حذف الحساب الخاص بك');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    try {
      await http.delete(`/api/-users/${userId}`);
      setShowDeleteModal(false);
      fetchUsers();
      setSuccessMessage('تم الحذف بنجاح!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting user:', error);
      setErrorMessage('Error deleting user.');
    }
  };

  const handleEditClick = userId => {
    const userToEdit = Users.find(User => User.id === userId);
    setSelectedUser(userToEdit);
    setShowModal(true);
  };

  const promptDelete = userId => {
    const userToDelete = Users.find(User => User.id === userId);
    setSelectedUser(userToDelete);
    setShowDeleteModal(true);
  };

  return (
    <>
      <SectionHeader
        imageSrc={UserManager}
        sectionTitle='الأدوار و المستخدمين'
      />

      {/* Notification messages */}
      {successMessage && (
        <div className='mb-4 p-2 bg-green-400 font-bold text-center text-green-800 rounded'>
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className='mb-4 p-2 bg-red-400 font-bold text-center text-gray-100 rounded'>
          {errorMessage}
        </div>
      )}

      {/* Main content */}
      <div className='p-5 bg-gradient-to-r from-blue-200 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl'>
        {showModal && (
          <UserModalForm
            isOpen={showModal}
            selectedUser={selectedUser}
            onClose={() => setShowModal(false)}
            refreshUsers={fetchUsers}
          />
        )}

        {showDeleteModal && (
          <GlobalConfirmDeleteModal
            onDelete={() => handleDelete(selectedUser.id)}
            onCancel={() => setShowDeleteModal(false)}
          />
        )}

        {/* Table rendering */}
        <div className='overflow-auto'>
          {loading ? (
               <div className="flex items-center justify-center overflow-auto">
      
       <svg class="pl" width="240" height="240" viewBox="0 0 240 240">
         <circle class="pl__ring pl__ring--a" cx="120" cy="120" r="105" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 660" stroke-dashoffset="-330" stroke-linecap="round"></circle>
         <circle class="pl__ring pl__ring--b" cx="120" cy="120" r="35" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 220" stroke-dashoffset="-110" stroke-linecap="round"></circle>
         <circle class="pl__ring pl__ring--c" cx="85" cy="120" r="70" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round"></circle>
         <circle class="pl__ring pl__ring--d" cx="155" cy="120" r="70" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round"></circle>
       </svg>     
       </div>
          ) : (
            <TableComponent
              customRenderers={customRenderers}
              data={Users}
              onEdit={handleEditClick}
              onDelete={promptDelete}
              headers={headers}
              sectionName='Users'
            />
          )}
        </div>
      </div>
    </>
  );
};

export default UsersList;