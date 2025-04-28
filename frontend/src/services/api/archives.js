import api from './axiosConfig'; // تأكد أن ملف axiosConfig صحيح

// ✅ Contracts Endpoints
export const getArchiveFiles = () => api.get('/api/archives');
export const getArchiveFileById = (id) => api.get(`/api/archive-files/${id}`);
export const createArchiveFile = (formData) => {
  return api.post('/api/archive-files', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const updateArchiveFile = (id, formData) => {
  // انت ترسل _method: PUT داخل الفورم داتا من الفورم نفسه
  return api.post(`/api/archive-files/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}; 
