import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { toast } from 'sonner';
import { initEcho } from '@/lib/echo';

export default function EchoListener() {
  const { user, updatePermissions } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!user?.id) return;

    const echo = initEcho();
    const channel = echo.private(`user.${user.id}`);

    const handler = (eventData) => {
      if (eventData.permissions) {
        updatePermissions(eventData.permissions);

        // ✅ 1. إشعار toast
        toast.success('✅ تم تحديث صلاحياتك بنجاح');

        // ✅ 2. أضف إشعارًا إلى القائمة
        addNotification({
          id: Date.now(),
          title: 'تم تحديث صلاحياتك',
          message: 'لديك صلاحيات جديدة الآن. الرجاء التحديث إذا لزم.',
          icon: '🔐',
          time: new Date().toLocaleTimeString(),
        });
      }
    };

    channel.listen('.permissions.updated', handler);

    return () => {
      channel.stopListening('.permissions.updated', handler);
    };
  }, [user]);

  return null;
}
