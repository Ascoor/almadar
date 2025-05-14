// src/services/api/users.js
import api from './axiosConfig'; // تأكد أن المسار لملف axiosConfig صحيح

// —————— Users ——————

/**
 * جلب جميع المستخدمين
 * GET /api/users
 */
export const getUsers = async () => {
  try {
    const response = await api.get('/api/users');
    return response.data; // تأكد من شكل البيانات المرسل من السيرفر
  } catch (error) {
    throw error;
  }
};

/**
 * إنشاء مستخدم جديد
 * POST /api/users
 */
export const createUser = async (userData) => {
  try {
    const response = await api.post('/api/users', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * تعديل مستخدم موجود
 * PUT /api/users/:id
 */
export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/api/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * حذف مستخدم
 * DELETE /api/users/:id
 */
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * جلب بروفايل المستخدم الحالي
 * GET /api/user-profile (أو أي مسار يستخدَم في الbackend)
 */
export const userProfile = async () => {
  try {
    const response = await api.get('/api/user-profile');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// —————— Roles & Permissions ——————

/**
 * جلب كل الصلاحيات من السيرفر
 * GET /api/permissions
 */
export const getPermissions = async () => {
  try {
    const response = await api.get('/api/permissions');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * جلب صلاحيات مستخدم معيّن
 * GET /api/permissions/:userId
 */
export const getUserPermissions = async (userId) => {
  try {
    const response = await api.get(`/api/permissions/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * حفظ صلاحيات مستخدم
 * POST /api/permissions/:userId
 * @param {number} userId
 * @param {Array<{permission_id: number, enabled: boolean}>} payload
 */
export const saveUserPermissions = async (userId, payload) => {
  try {
    const response = await api.post(`/api/permissions/${userId}`, {
      permissions: payload,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * جلب الأدوار (إذا تحتاجها في الواجهة)
 * GET /api/roles
 */
export const getRoles = async () => {
  try {
    const response = await api.get('/api/roles');
    return response.data;
  } catch (error) {
    throw error;
  }
};
