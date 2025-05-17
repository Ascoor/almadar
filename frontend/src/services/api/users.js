import api from './axiosConfig';

export const getUsers = async () => {
  try {
    const response = await api.get('/api/users');
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const assignRole = async (userId) => {
  try {
    const response = await api.get(`/api/users/${userId}/assign-role`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const removeRole = async (userId) => {
  try {
    const response = await api.get(`/api/users/${userId}/remove-role`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post('/api/users', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/api/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const userProfile = async () => {
  try {
    const response = await api.get('/api/user-profile');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPermissions = async () => {
  try {
    const response = await api.get('/api/permissions');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserPermissions = async (userId) => {
  try {
    const response = await api.get(`/api/users/${userId}/permissions`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveUserPermissions = async (userId, payload) => {
  try {
    const response = await api.post(`/api/users/${userId}`, {
      permissions: payload,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserPermissions = async (userId, payload) => {
  try {
    const response = await api.put(`/api/users/${userId}`, {
      permissions: payload,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
  
export const getRoles = async () => {
  try {
    const response = await api.get('/api/roles');
    return response.data;
  } catch (error) {
    throw error;
  }
};

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
