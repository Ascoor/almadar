import React, { useState, useEffect } from 'react';
import useAuth from '../../Auth/Authentication/AuthUser';
import api from '../../../services/api/axiosConfig'; // تأكد أن ملف axiosConfig صحيح

const RolePermissionsManager = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [permissions, setPermissions] = useState([]);
 

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await api.get('/api/roles');
      setRoles(response.data);
      setSelectedRole(response.data[0].id);
      fetchPermissions(response.data[0].id);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  const fetchPermissions = async roleId => {
    try {
      const response = await http.get(`/api/roles/${roleId}/permissions`);
      setPermissions(response.data);
    } catch (error) {
      console.error('Failed to fetch permissions for role:', error);
    }
  };

  const handleRoleChange = e => {
    const roleId = e.target.value;
    setSelectedRole(roleId);
    fetchPermissions(roleId);
  };

  const handlePermissionToggle = permissionId => {
    setPermissions(prevPermissions =>
      prevPermissions.map(permission =>
        permission.id === permissionId
          ? { ...permission, enabled: !permission.enabled }
          : permission
      )
    );
  };

  return (
    <div className='container mx-auto px-4 pt-12'>
      <div className='mb-6'>
        <label
          htmlFor='roleSelect'
          className='block text-lg font-semibold mb-2 text-gray-900 dark:text-gray-200'
        >
          Select Role:
        </label>
        <select
          id='roleSelect'
          value={selectedRole}
          onChange={handleRoleChange}
          className='form-select w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          {roles.map(role => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

      <div className='space-y-4'>
        {permissions.map(permission => (
          <div
            key={permission.id}
            className='flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg'
          >
            <span className='text-gray-700 dark:text-gray-300'>
              {permission.name}
            </span>
            <input
              type='checkbox'
              checked={permission.enabled}
              onChange={() => handlePermissionToggle(permission.id)}
              className='form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400 focus:ring-2 focus:ring-blue-500'
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RolePermissionsManager;