import api from './axiosConfig';


export const getUsers = async () => {
  const res = await api.get('/api/users');
  return res.data;
};

export const createUser = async (formData) => {
  const res = await api.post('/api/users', formData);
  return res.data;
};

export const updateUser = async (id, formData) => {
  const res = await api.post(`/api/users/${id}?_method=PUT`, formData);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/api/users/${id}`);
  return res.data;
};


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

 
 export const changeUserPermission = async (userId, permissionName, action) => {
  const res = await api.post(`/api/users/${userId}/permissions`, {
    permission: permissionName,
    action
  });
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
// جلب بيانات مستخدم واحد
export const getProfile = async (userId) => {
  const res = await api.get(`/api/users/${userId}`);
  return res.data;
};
  