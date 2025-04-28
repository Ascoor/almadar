import api from './axiosConfig'; // هنا المسار الصح
 
// Contracts CRUD
export const getContracts = () => api.get('/api/contracts');
export const getContractById = (id) => api.get(`/api/contracts/${id}`);
export const createContract = (data) => api.post('/api/contracts', data);
export const updateContract = (id, data) => api.put(`/api/contracts/${id}`, data);
export const deleteContract = (id) => api.delete(`/api/contracts/${id}`);

// Contract Categories CRUD
export const getContractCategories = () => api.get('/api/contract-categories');
export const getContractCategoryById = (id) => api.get(`/api/contract-categories/${id}`);
export const createContractCategory = (data) => api.post('/api/contract-categories', data);
export const updateContractCategory = (id, data) => api.put(`/api/contract-categories/${id}`, data);
export const deleteContractCategory = (id) => api.delete(`/api/contract-categories/${id}`);
