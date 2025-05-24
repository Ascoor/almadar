import api from './axiosConfig';

/* ==== 🧩 إدارة المستخدمين ==== */

// جلب جميع المستخدمين
export const getUsers = async () => {
  const res = await api.get('/api/users');
  return res.data;
};

// إنشاء مستخدم جديد
export const createUser = async (formData) => {
  const res = await api.post('/api/users', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

// تحديث بيانات مستخدم
export const updateUser = async (userId, formData) => {
  const res = await api.post(`/api/users/${userId}?_method=PUT`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

// حذف مستخدم
export const deleteUser = async (userId) => {
  const res = await api.delete(`/api/users/${userId}`);
  return res.data;
};

/* ==== 🔐 إدارة الصلاحيات ==== */

// جلب كل الصلاحيات
export const getPermissions = async () => {
  const res = await api.get('/api/permissions');
  return res.data;
};

// جلب كل الأدوار
export const getRoles = async () => {
  const res = await api.get('/api/roles');
  return res.data;
};

// تغيير صلاحية مستخدم (ذكي)
export const changeUserPermission = async (userId, permission, action) => {
  const res = await api.post(`/api/users/${userId}/permission/change`, {
    permission,
    action,
  });
  return res.data;
};

// إعطاء صلاحية
export const givePermission = async (userId, permissionId) => {
  const res = await api.post(`/api/users/${userId}/give-permission`, {
    permission: permissionId,
  });
  return res.data;
};

// إلغاء صلاحية
export const revokePermission = async (userId, permissionId) => {
  const res = await api.post(`/api/users/${userId}/revoke-permission`, {
    permission: permissionId,
  });
  return res.data;
};

/* ==== 👤 إدارة الملف الشخصي ==== */

// جلب بيانات مستخدم واحد
export const getProfile = async (userId) => {
  const res = await api.get(`/api/users/${userId}`);
  return res.data;
};

// تحديث الملف الشخصي
export const updateProfile = async (userId, formData) => {
  const res = await api.post(`/api/users/${userId}?_method=PUT`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

// تغيير كلمة المرور
export const changePassword = async (userId, passwordData) => {
  const res = await api.post(`/api/users/${userId}/change-password`, passwordData);
  return res.data;
};
