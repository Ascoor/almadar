//investigations endpoints
import api from './axiosConfig'; 

// ✅ Investigations Endpoints
export const getInvestigations = () => api.get('/api/investigations');
export const getInvestigationById = (id) => api.get(`/api/investigations/${id}`);
export const createInvestigation = (data) => api.post('/api/investigations', data);
export const updateInvestigation = (id, data) => api.put(`/api/investigations/${id}`, data);
export const deleteInvestigation = (id) => api.delete(`/api/investigations/${id}`);
export const createInvestigationAction = (investigationId, data) => 
  api.post(`/api/investigations/${investigationId}/actions`, data);
export const getInvestigationActions = (investigationId) =>
  api.get(`/api/investigations/${investigationId}/actions`);
export const getInvestigationActionById = (investigationId, actionId) =>
  api.get(`/api/investigations/${investigationId}/actions/${actionId}`);
export const updateInvestigationAction = (investigationId, actionId, data) =>
  api.put(`/api/investigations/${investigationId}/actions/${actionId}`, data);
export const deleteInvestigationAction = (investigationId, actionId) => 
  api.delete(`/api/investigations/${investigationId}/actions/${actionId}`); 