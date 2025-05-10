import api from './axiosConfig';

// ====================
// 🟦 القضايا الرئيسية
// ====================

export const getLitigations = () => 
  api.get('/api/litigations');

export const getLitigationById = (id) =>
  api.get(`/api/litigations/${id}`);

export const createLitigation = (data) =>
  api.post('/api/litigations', data);

export const updateLitigation = (id, data) =>
  api.put(`/api/litigations/${id}`, data);

export const deleteLitigation = (id) =>
  api.delete(`/api/litigations/${id}`);


// =============================
// 🟩 الإجراءات المرتبطة بالقضايا
// =============================

export const getLitigationActions = (litigationId) =>
  api.get(`/api/litigations/${litigationId}/actions`);

export const getLitigationActionById = (litigationId, actionId) =>
  api.get(`/api/litigations/${litigationId}/actions/${actionId}`);

export const createLitigationAction = (litigationId, data) =>
  api.post(`/api/litigations/${litigationId}/actions`, data);

export const updateLitigationAction = (litigationId, actionId, data) =>
  api.put(`/api/litigations/${litigationId}/actions/${actionId}`, data);

export const deleteLitigationAction = (litigationId, actionId) =>
  api.delete(`/api/litigations/${litigationId}/actions/${actionId}`);
