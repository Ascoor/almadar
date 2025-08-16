import { createContext, useContext, useState, useRef } from 'react';

const NotificationContext = createContext();

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [hasNew, setHasNew] = useState(false);
  const audioRef = useRef(null);
  const seenIds = useRef(new Set());

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
