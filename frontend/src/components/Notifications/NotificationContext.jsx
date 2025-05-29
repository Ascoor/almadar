import { createContext, useContext, useState, useEffect } from 'react';
import { initEcho, subscribeToUserChannel } from '@/lib/echo'; // تأكد من استيراد echo بشكل صحيح

const NotificationContext = createContext();

export function useNotifications() {
  return useContext(NotificationContext);
}

export function useEcho({ userId = null, autoInit = true, config = {} } = {}) {
  const [initialized, setInitialized] = useState(false);
  const [userChannel, setUserChannel] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // تهيئة Echo عند تحميل الهوك
  useEffect(() => {
    if (autoInit) {
      initEcho(config);
      setInitialized(true);
    }
  }, [autoInit, config]);

  // الاشتراك في قناة المستخدم والاستماع للأحداث
  useEffect(() => {
    if (!initialized || !userId) return;

    const channel = subscribeToUserChannel(userId);
    setUserChannel(channel);

    const handler = (event) => {
      setNotifications((prev) => [event, ...prev].slice(0, 5)); // إضافة الإشعار الجديد وضمان عرض آخر 5 إشعارات فقط
    };

    // استماع لإشعار جديد عند إنشاءه
    channel.listen('NotificationCreated', handler); // الاستماع للحدث NotificationCreated

    // تنظيف بعد فك الاشتراك
    return () => {
      channel.stopListening('NotificationCreated', handler);
    };
  }, [initialized, userId]);

  const markAllAsRead = async () => {
    setLoading(true);
    try {
      // إرسال طلب لتحديد جميع الإشعارات كمقروءة
      await axios.post('/api/notifications/mark-all-read');
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    } finally {
      setLoading(false);
    }
  };

  return { notifications, loading, markAllAsRead };
}export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [hasNew, setHasNew] = useState(false);

  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setHasNew(true);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setHasNew(false);
  };

  const updateNotifications = (newList) => {
    setNotifications(newList);
    const newOnes = newList.filter((n) => !n.read).length;
    setHasNew(newOnes > 0);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications, // ✅ مهم جداً
        hasNew,
        setHasNew,        // ✅ مهم جداً
        addNotification,
        markAllAsRead,
        updateNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
