import { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [hasNew, setHasNew] = useState(false);

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    setHasNew(true);
  };

  const markAllAsRead = () => setHasNew(false);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, hasNew, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
