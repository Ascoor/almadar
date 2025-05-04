import api from './axiosConfig';

// ========== ✅ القضايا القضائية الرئيسية ==========

// جلب كل القضايا
export const getLitigations = () => api.get('/api/litigations');

// جلب قضية محددة (عند الحاجة لاحقًا)
export const getLitigationById = (id) => api.get(`/api/litigations/${id}`);

// إنشاء قضية جديدة
export const createLitigation = (data) => api.post('/api/litigations', data);

// تحديث قضية موجودة
export const updateLitigation = (id, data) => api.put(`/api/litigations/${id}`, data);

// حذف قضية
export const deleteLitigation = (id) => api.delete(`/api/litigations/${id}`);


// ========== ✅ الإجراءات المرتبطة بقضية ==========

// جلب جميع الإجراءات المرتبطة بقضية
export const getLitigationActions = (litigationId) =>
  api.get(`/api/litigations/${litigationId}/actions`);

// إضافة إجراء لقضية
export const createLitigationAction = (litigationId, data) =>
  api.post(`/api/litigations/${litigationId}/actions`, data);

// تعديل إجراء لقضية
export const updateLitigationAction = (litigationId, actionId, data) =>
  api.put(`/api/litigations/${litigationId}/actions/${actionId}`, data);

// حذف إجراء لقضية
export const deleteLitigationAction = (litigationId, actionId) =>
  api.delete(`/api/litigations/${litigationId}/actions/${actionId}`);
