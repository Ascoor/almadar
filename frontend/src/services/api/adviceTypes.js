import api from './axiosConfig'; // تأكد أن ملف axiosConfig صحيح

// ✅ legal-advices  Endpoints
export const getAdviceTypes = () => api.get('/api/advice-types'); 

export const createAdviceType = (formData) => {
  return api.post('/api/advice-types', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateAdviceType = (id, formData) => {
  return api.put(`/api/advice-types/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteAdviceType = (id) => {
  return api.delete(`/api/advice-types/${id}`);
};