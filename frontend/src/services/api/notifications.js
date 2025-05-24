import api from './axiosConfig'; // تأكد أن ملف axiosConfig صحيح

// جلب الإشعارات
export const getNotifications = async () => {
  try {
    const response = await api.get('/api/notifications');
    if (response.data) {
      console.log('Fetched notifications:', response.data);  // تحقق من البيانات المستلمة
      return response.data;
    } else {
      console.error('No notifications found');
      return [];
    }
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// تحديث حالة الإشعار كمقروء
export const markAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/api/notifications/${notificationId}/read`);
    console.log('Marked as read:', response.data); // تحقق من الرد عند تغيير الحالة
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};
