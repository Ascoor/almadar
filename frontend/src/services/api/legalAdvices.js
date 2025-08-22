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

// ✅ Get all advice types
export const getAdviceTypes = () => {
  return api.get('/api/advice-types');
};

// ✅ Create a new advice type
export const createAdviceType = (data) => {
  return api.post('/api/advice-types', data);
};

// ✅ Update an advice type
export const updateAdviceType = (id, data) => {
  return api.put(`/api/advice-types/${id}`, data);
};

// ✅ Delete an advice type
export const deleteAdviceType = (id) => {
  return api.delete(`/api/advice-types/${id}`);
};