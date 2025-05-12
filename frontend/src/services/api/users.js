import api from './axiosConfig'; // تأكد أن ملف axiosConfig صحيح
 
// ✅ Get all users (قائمة المستخدمين)
export const getUsers = async () => {
  try {
    const response = await api.get('/api/users'); // API endpoint في Laravel:/api/users
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Create new user (إنشاء مستخدم جديد)
export const createUser = async (userData) => {
  try {
    const response = await api.post('/api/users', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Update user by ID (تعديل بيانات مستخدم)
export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/api/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Get current user's profile (عرض بروفايل المستخدم المسجل)
export const userProfile = async () => {
  try {
    const response = await api.get('/user-profile'); // تأكد أن route هذا موجود في backend (ممكن /me أو /profile)
    return response.data;
  } catch (error) {
    throw error;
  }
};
// ✅ Get all roles from backend (جلب الأدوار)
export const getRoles = async () => {
  try {
    const response = await api.get('/roles'); // لازم يكون فيه route في Laravel: GET /api/roles
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✅ Delete user by ID (حذف مستخدم)
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
