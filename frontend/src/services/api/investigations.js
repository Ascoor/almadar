import api from './axiosConfig';

// ====================
// 🟦 التحقيقات الرئيسية
// ====================

export const getInvestigations = () =>
  api.get('/api/investigations');

export const getInvestigationById = (id) =>
  api.get(`/api/investigations/${id}`);

export const createInvestigation = (data) =>
  api.post('/api/investigations', data);

export const updateInvestigation = (id, data) =>
  api.put(`/api/investigations/${id}`, data);

export const deleteInvestigation = (id) =>
  api.delete(`/api/investigations/${id}`);


// =============================
// 🟩 الإجراءات المرتبطة بتحقيق
// =============================

export const getInvestigationActions = (investigationId) =>
  api.get(`/api/investigations/${investigationId}/actions`);

export const getInvestigationActionById = (investigationId, actionId) =>
  api.get(`/api/investigations/${investigationId}/actions/${actionId}`);

export const createInvestigationAction = (investigationId, data) =>
  api.post(`/api/investigations/${investigationId}/actions`, data);
export const updateInvestigationAction = (investigationId, actionId, data) =>
  api.put(`/api/investigations/${investigationId}/actions/${actionId}`, data);

export const deleteInvestigationAction = (investigationId, actionId) =>
  api.delete(`/api/investigations/${investigationId}/actions/${actionId}`);


// ====================
// API Calls for InvestigationActionType
// ====================

export const getInvestigationActionTypes = () =>
  api.get('/api/investigation-action-types');

export const getInvestigationActionTypeById = (id) =>
  api.get(`/api/investigation-action-types/${id}`);

export const createInvestigationActionType = (data) =>
  api.post('/api/investigation-action-types', data);

export const updateInvestigationActionType = (id, data) =>
  api.put(`/api/investigation-action-types/${id}`, data);

export const deleteInvestigationActionType = (id) =>
  api.delete(`/api/investigation-action-types/${id}`);
