import api from './axiosConfig'; // تأكد أن ملف axiosConfig صحيح

// ✅ Contracts Endpoints
export const getContracts = () => api.get('/api/contracts');

export const getContractById = (id) => api.get(`/api/contracts/${id}`);

export const createContract = (formData) => {
  return api.post('/api/contracts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateContract = (id, formData) => {
  // انت ترسل _method: PUT داخل الفورم داتا من الفورم نفسه
  return api.post(`/api/contracts/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteContract = (id) => api.delete(`/api/contracts/${id}`);

// ✅ Contract Categories Endpoints
export const getContractCategories = () => api.get('/api/contract-categories');

export const getContractCategoryById = (id) => api.get(`/api/contract-categories/${id}`);

export const createContractCategory = (data) => api.post('/api/contract-categories', data);

export const updateContractCategory = (id, data) => api.put(`/api/contract-categories/${id}`, data);

export const deleteContractCategory = (id) => api.delete(`/api/contract-categories/${id}`);
