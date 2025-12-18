import api from '@/services/api/axiosConfig';

export const fetchNotifications = async () => {
  const res = await api.get('/api/notifications');
  return res.data;
};

export const markNotificationRead = async (id) => {
  const res = await api.put(`/api/notifications/${id}/read`);
  return res.data;
};

export const markAllNotificationsRead = async () => {
  try {
    const res = await api.put('/api/notifications/read-all');
    return res.data;
  } catch (error) {
    if (error?.response?.status === 404) return null;
    throw error;
  }
};
