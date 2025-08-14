import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getSocket } from '@/services/realtime/initSocket';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
};

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    // Load existing notifications
    loadNotifications();

    // Setup real-time notifications
    const socket = getSocket();
    
    socket.on('notification', (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
      
      // Show toast for new notification
      toast({
        title: notification.title,
        description: notification.message,
        variant: notification.type === 'error' ? 'destructive' : 'default',
      });
    });

    socket.on('notification:read', (notificationId: string) => {
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    });

    return () => {
      socket.off('notification');
      socket.off('notification:read');
    };
  }, [user, toast]);

  const loadNotifications = async () => {
    try {
      // This would typically fetch from an API
      // For now, we'll use mock data
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'عقد جديد',
          message: 'تم إضافة عقد جديد يتطلب مراجعتك',
          type: 'info',
          read: false,
          createdAt: new Date().toISOString(),
          actionUrl: '/contracts/new-contract-id'
        },
        {
          id: '2',
          title: 'موعد جلسة قريب',
          message: 'لديك جلسة محكمة غداً في تمام الساعة 10:00 صباحاً',
          type: 'warning',
          read: false,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          actionUrl: '/legal/litigations/litigation-id'
        }
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    
    // In real app, this would make an API call
    // api.put(`/notifications/${id}/read`);
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
    
    // In real app, this would make an API call
    // api.put('/notifications/read-all');
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    
    // In real app, this would make an API call
    // api.delete(`/notifications/${id}`);
  };

  const clearAll = () => {
    setNotifications([]);
    
    // In real app, this would make an API call
    // api.delete('/notifications');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAll,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};