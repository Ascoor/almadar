import api from './axiosConfig';

// Get all users
export const getUsers = async () => {
  try {
    const response = await api.get('/api/users');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new user
export const createUser = async (userData) => {
  try {
    const response = await api.post('/api/users', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update an existing user
export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/api/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a user
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get permissions for all users
export const getPermissions = async () => {
  try {
    const response = await api.get('/api/permissions');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get permissions for a specific user
export const getUserPermissions = async (userId) => {
  try {
    const response = await api.get(`/api/users/${userId}/permissions`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all roles
export const getRoles = async () => {
  try {
    const response = await api.get('/api/roles');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Give permission to a user
export const givePermission = async (userId, permissionId) => {
  try {
    const response = await api.post(`/api/users/${userId}/give-permission`, {
      permission: permissionId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Revoke permission from a user
export const revokePermission = async (userId, permissionId) => {
  try {
    const response = await api.post(`/api/users/${userId}/revoke-permission`, {
      permission: permissionId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
// Smart permission manager
export const changeUserPermission = async (userId, permission, action) => {
  try {
    const response = await api.post(`/api/users/${userId}/permission/change`, {
      permission,
      action, // 'add' or 'remove'
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
