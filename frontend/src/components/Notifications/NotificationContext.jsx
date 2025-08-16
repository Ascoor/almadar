import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { initEcho, subscribeToUserChannel } from '@/lib/echo';
import { useAuth } from '@/context/AuthContext';;
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

    // init once per auth change
    const echo = initEcho({
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      },
    });
    echoRef.current = echo;

    // user private channel (single instance)
    const channelName = `user.${user.id}`;
    const userChannel = subscribeToUserChannel(user.id);

    // 1) Laravel Notification::send() broadcasts arrive here
    userChannel.notification((n) => handleNotification(n));

    // 2) Your custom permissions event on the SAME channel
    userChannel.listen('.permissions.updated', (e) => {
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
      audioRef.current?.play?.();
    });

    // Optional admin-only extra channel
    let adminChannelName = null;
    if (user.roles?.some((r) => r.name === 'Admin')) {
      adminChannelName = `admins.${user.id}`;
      echo.private(adminChannelName).listen('.NotificationAdmin', (e) => {
        handleNotification({ ...e.notification, icon: '📣' });
      });
    }

    // helpful connection logs (optional)
    try {
      const pusher = echo.connector?.pusher;
      pusher?.connection?.bind('state_change', (states) => {
        // e.g., { previous: 'connecting', current: 'connected' }
        // console.debug('Echo state change', states);
      });
      pusher?.connection?.bind('error', (err) => {
        // console.error('Echo error', err);
      });
    } catch {}

    return () => {
      if (!echoRef.current) return;
      // Leave channels cleanly
      echoRef.current.leave(channelName);
      if (adminChannelName) echoRef.current.leave(adminChannelName);
      echoRef.current = null;
    };
  }, [user?.id, token]);

  const handleNotification = (notification) => {
    const id = notification?.id ?? notification?.uuid ?? notification?.created_at;
    if (!id || seenIds.current.has(id)) return;
    seenIds.current.add(id);
    add(notification);
    audioRef.current?.play?.();
  };

  const add = (n) => {
    setNotifications((prev) => [{ ...n, read: false }, ...prev]);
    setHasNew(true);
  };

  const markRead = (id) => {
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      const stillUnread = next.some((n) => !n.read);
      setHasNew(stillUnread);
      return next;
    });
  };

  const markAllAsRead = () => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      setHasNew(false);
      return next;
    });
  };

  return (
    <NotificationContext.Provider value={{ notifications, hasNew, add, markRead, markAllAsRead }}>
      {children}
      {/* Some browsers block autoplay; playing on user gesture will always work */}
      <audio ref={audioRef} src="/sounds/notif.mp3" preload="auto" />
    </NotificationContext.Provider>
  );
}
