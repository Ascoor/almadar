import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';

import { initEcho } from '@/lib/echo';

export default function AdminEchoListener() {
  const { user } = useAuth(); 
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!user?.id || !user.roles?.some(role => role.name === 'Admin')) return;
    const echo = initEcho();
    const adminChannel = echo.private(`admins.${user.id}`);

    console.log(`🛰 Subscribed to admins.${user.id}`);

    const adminHandler = (e) => {
      const notification = e.notification;
      console.log('📥 Received NotificationAdmin:', notification);
 
      addNotification({
        ...notification,
        icon: '📣',
      });
    };

    adminChannel.listen('.NotificationAdmin', adminHandler);

    return () => {
      adminChannel.stopListening('.NotificationAdmin', adminHandler);
      echo.leave(`admins.${user.id}`);
    };
  }, [user, addNotification]);

  return null;
}
