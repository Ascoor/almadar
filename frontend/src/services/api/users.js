import api from './axiosConfig';

// بيانات المستخدم
export const getUsers = () => api.get('/api/users').then(res => res.data);
export const getProfile = (id) => api.get(`/api/users/${id}`).then(res => res.data);

// إنشاء/تحديث مستخدم
export const createUser = (formData) =>
  api.post('/api/users', formData).then(res => res.data);

export const updateUser = (id, formData) =>
  api.post(`/api/users/${id}?_method=PUT`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(res => res.data);

// حذف مستخدم
export const deleteUser = (id) => api.delete(`/api/users/${id}`).then(res => res.data);

// كلمة المرور
export const firstLoginPassword = (id, data) =>
  api.post(`/api/users/${id}/first-login-password`, data).then(res => res.data);
export const changePassword = (id, data) =>
  api.post(`/api/users/${id}/change-password`, data).then(res => res.data);
// الأدوار
export const getRoles = () => api.get('/api/roles').then(res => res.data);
export const assignRole = (userId, role) =>
  api.post(`/api/users/${userId}/roles/assign`, { role }).then(res => res.data);
export const removeRole = (userId, role) =>
  api.post(`/api/users/${userId}/roles/remove`, { role }).then(res => res.data);

// الصلاحيات
export const getPermissions = () => api.get('/api/permissions').then(res => res.data); 
 export const changeUserPermission = async (userId, permissionName, action) => {
  const res = await api.post(`/api/users/${userId}/permission/change`, {
    permission: permissionName,
    action
  });
  return res.data;
};