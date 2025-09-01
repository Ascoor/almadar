import api from './axiosConfig';

// --- Dashboard API calls ---

// جلب إحصائيات اللوحة (contracts, litigations, investigations, legal_advices)
export const getDashboardCounts = () => api.get('/api/dashboard/statistics');

// جلب أحدث البيانات المضافة والمحدثة
export const getAllRecentData = () => api.get('/api/dashboard/get-recent-data');

