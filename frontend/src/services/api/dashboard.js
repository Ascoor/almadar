import api from './axiosConfig';
export const getDashboardCounts = () => api.get('/api/dashboard/statistics');
