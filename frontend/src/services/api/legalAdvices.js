import api from './axiosConfig'; // تأكد أن ملف axiosConfig صحيح

// ✅ legal-advices  Endpoints
export const getLegalAdvices = () => api.get('/api/legal-advices'); 

export const createLegalAdvice = (formData) => {
  return api.post('/api/legal-advices', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateLegalAdvice = (id, formData) => {
  // انت ترسل _method: PUT داخل الفورم داتا من الفورم نفسه
  return api.post(`/api/legal-advices/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteLegalAdvice = (id) => api.delete(`/api/legal-advices/${id}`);
