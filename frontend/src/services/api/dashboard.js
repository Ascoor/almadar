import api from './axiosConfig';
export const getDashboardCounts = () => api.get('/api/dashboard/statistics');


export const getAllRecentData = async () => {
  try {
    const response = await api.get('/api/dashboard/get-recent-data');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return {};
  }
};