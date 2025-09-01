import api from './axiosConfig';
import crudFactory from './crudFactory';

const usersCrud = crudFactory('users');

export const getUsers = usersCrud.getAll;
export const getProfile = usersCrud.getOne;
export const createUser = usersCrud.create;
export const updateUser = usersCrud.update;
export const deleteUser = usersCrud.remove;

export const firstLoginPassword = async (id, data) => {
  try {
    const res = await api.post(`/api/users/${id}/first-login-password`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (id, data) => {
  try {
    const res = await api.post(`/api/users/${id}/change-password`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getRoles = async () => {
  try {
    const res = await api.get('/api/roles');
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const assignRole = async (userId, role) => {
  try {
    const res = await api.post(`/api/users/${userId}/roles/assign`, { role });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const removeRole = async (userId, role) => {
  try {
    const res = await api.post(`/api/users/${userId}/roles/remove`, { role });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getPermissions = async () => {
  try {
    const res = await api.get('/api/permissions');
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const changeUserPermission = async (userId, permissionName, action) => {
  try {
    const res = await api.post(`/api/users/${userId}/permission/change`, {
      permission: permissionName,
      action,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
