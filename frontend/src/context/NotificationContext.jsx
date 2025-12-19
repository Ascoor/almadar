import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { toast } from 'sonner';
import { initEcho, subscribeToUserChannel } from '@/lib/echo';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  buildNotificationLink,
  formatNotification,
} from '@/utils/formatNotification';
import {
  getNotifications,
  markAsRead as markNotificationRead,
} from '@/services/api/notifications';

const NotificationContext = createContext(null);

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      'useNotifications must be used within NotificationProvider',
    );
  return ctx;
}

export function NotificationProvider({ children }) {
  const { user, token, updatePermissions } = useAuth();
  const { t, lang } = useLanguage();

  const [notifications, setNotifications] = useState([]);
  const [hasNew, setHasNew] = useState(false);

  const echoRef = useRef(null);
  const seenIds = useRef(new Set());

  // ✅ صوت: لا يعمل إلا بعد أول تفاعل
  const audioRef = useRef(null);
  const canPlaySound = useRef(false);
  useEffect(() => {
    const enable = () => (canPlaySound.current = true);
    window.addEventListener('click', enable, { once: true });
    return () => window.removeEventListener('click', enable);
  }, []);

  const playSound = () => {
    if (!canPlaySound.current) return;
    audioRef.current?.play().catch(() => {});
  };

  const normalize = (raw) => {
    const data = raw?.data ?? raw ?? {};
    const id = raw?.id ?? data?.id;
    if (!id) return null;

    const link = buildNotificationLink({ ...data, ...raw });

    return {
      id,
      created_at:
        raw?.created_at ?? data?.created_at ?? new Date().toISOString(),
      read:
        Boolean(raw?.read_at) || Boolean(data?.read_at) || Boolean(data?.read),
      link,
      key: data?.key ?? null,
      data,
    };
  };

  const add = (n) => {
    setNotifications((prev) => [{ ...n, read: n.read ?? false }, ...prev]);
    setHasNew(true);
  };

  const handleIncoming = (raw) => {
    const n = normalize(raw);
    if (!n) return;
    if (seenIds.current.has(n.id)) return;

    seenIds.current.add(n.id);
    add(n);
    playSound();
  };

  useEffect(() => {
    if (!user?.id) return;

    let mounted = true;
    (async () => {
      try {
        const res = await getNotifications();
        const list = Array.isArray(res?.data) ? res.data : res;
        if (!mounted || !Array.isArray(list)) return;
        const normalized = list
          .map((item) => normalize(item))
          .filter(Boolean);

        setNotifications(normalized);
        normalized.forEach((n) => seenIds.current.add(n.id));
        setHasNew(normalized.some((n) => !n.read));
      } catch (err) {
        console.error('Failed to load notifications', err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  // ✅ الاشتراك في Echo مرة واحدة فقط: يعتمد على user.id + token فقط
  useEffect(() => {
    if (!user?.id || !token) return;

    const echo = initEcho({
      auth: { headers: { Authorization: `Bearer ${token}` } },
    });
    echoRef.current = echo;

    const userChannel = subscribeToUserChannel(echo, user.id);
    userChannel.notification((n) => handleIncoming(n));

    userChannel.listen('.permissions.updated', (e) => {
      const permKey = `perm-${JSON.stringify(e.permissions)}`;
      if (seenIds.current.has(permKey)) return;
      seenIds.current.add(permKey);

      updatePermissions(e.permissions);

      add({
        id: `perm-${Date.now()}`,
        created_at: new Date().toISOString(),
        read: false,
        link: null,
        key: 'permissions.updated',
        data: { key: 'permissions.updated' },
      });

      toast.success(t('notifications.permissions.toast'));
      playSound();
    });

    let adminChannel = null;
    if (user.roles?.some((r) => r.name === 'Admin')) {
      adminChannel = echo.private(`admins.${user.id}`);
      adminChannel.listen('.NotificationAdmin', (e) =>
        handleIncoming(e?.notification),
      );
    }

    return () => {
      try {
        echo.leave(`private-user.${user.id}`);
        if (adminChannel) echo.leave(`private-admins.${user.id}`);
      } catch (_) {}
      echoRef.current = null;
      seenIds.current = new Set(); // reset if needed when user changes
    };
    // ✅ لا تضع lang هنا عشان ما يعيد الاشتراك
  }, [user?.id, token]);

  // ✅ عرض الإشعارات مترجمة حسب اللغة بدون reload
  const viewNotifications = useMemo(() => {
    return notifications
      .map((n) => {
        const formatted = formatNotification(n, t, lang);
        return formatted ? { ...n, ...formatted } : null;
      })
      .filter(Boolean);
  }, [notifications, lang]); // يتغير فورًا عند تغيير اللغة

  const markRead = async (id) => {
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      setHasNew(next.some((n) => !n.read));
      return next;
    });
    try {
      await markNotificationRead(id);
    } catch (_) {}
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setHasNew(false);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications: viewNotifications,
        hasNew,
        markRead,
        markAllAsRead,
      }}
    >
      {children}
      <audio ref={audioRef} src="/sounds/notif.mp3" preload="auto" />
    </NotificationContext.Provider>
  );
}
