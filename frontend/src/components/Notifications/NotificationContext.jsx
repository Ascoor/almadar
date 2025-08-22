import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { initEcho, subscribeToUserChannel } from '@/lib/echo';
import { useAuth } from '@/components/auth/AuthContext';
import { toast } from 'sonner';

const NotificationContext = createContext();

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const { user, token, updatePermissions } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [hasNew, setHasNew] = useState(false);
  const echoRef = useRef(null);
  const audioRef = useRef(null);
  const seenIds = useRef(new Set());

  useEffect(() => {
    if (!user?.id || !token) return;

    const echo = initEcho({ auth: { headers: { Authorization: `Bearer ${token}` } } });
    echoRef.current = echo;

    const userChannel = subscribeToUserChannel(user.id);
    userChannel.notification((n) => handleNotification(n));

    if (user.roles.some((r) => r.name === 'Admin')) {
      const adminChannel = echo.private(`admins.${user.id}`);
      adminChannel.listen('.NotificationAdmin', (e) =>
        handleNotification({ ...e.notification, icon: '📣' })
      );
    }

    const permChannel = echo.private(`user.${user.id}`);
    permChannel.listen('.permissions.updated', (e) => {
      const permKey = `perm-${JSON.stringify(e.permissions)}`;
      if (seenIds.current.has(permKey)) return;
      seenIds.current.add(permKey);
      updatePermissions(e.permissions);
      add({
        id: Date.now(),
        title: 'صلاحيات جديدة',
        message: 'تم استلام صلاحيات جديدة.',
        icon: '🔐',
        read: false,
        created_at: new Date().toISOString(),
      });
      toast.success('تم تحديث صلاحياتك');
      audioRef.current?.play();
    });

    return () => {
      if (!echoRef.current) return;
      Object.entries(echoRef.current?.channels || {}).forEach(([_, ch]) => ch?.unsubscribe?.());
      echoRef.current = null;
    };
  }, [user, token]);

  const handleNotification = (notification) => {
    if (!notification?.id || seenIds.current.has(notification.id)) return;
    seenIds.current.add(notification.id);
    add(notification);
    audioRef.current?.play();
  };

  const add = (n) => {
    setNotifications((prev) => [{ ...n, read: false }, ...prev]);
    setHasNew(true);
  };

  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    if (!notifications.some((n) => !n.read && n.id !== id)) setHasNew(false);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setHasNew(false);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, hasNew, add, markRead, markAllAsRead }}
    >
      {children}
      <audio ref={audioRef} src="/sounds/notif.mp3" preload="auto" />
    </NotificationContext.Provider>
  );
}
