import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/components/Notifications/NotificationContext';
import IconButton from './iconButton';
import { markAsRead as apiMarkAsRead } from '@/services/api/notifications';

export default function DropdownNotifications() {
  const { notifications, hasNew, markRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const handleOutside = (e) => {
    if (ref.current && !ref.current.contains(e.target)) setOpen(false);
  };
  useEffect(() => {
    if (open) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  const onClickNotif = async (n) => {
    await apiMarkAsRead(n.id);
    markRead(n.id);
    setOpen(false);
  };

  return (
    <div className="relative" dir="rtl" ref={ref}>
      <IconButton onClick={() => setOpen((o) => !o)} active={open}>
        <Bell className="w-6 h-6" />
        {hasNew && (
          <span className="absolute top-0 left-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
        )}
      </IconButton>

      {open && (
        <div
          className={`
      sm:absolute fixed sm:left-0 top-[72px] left-1/2 transform -translate-x-1/2
      z-50 w-[90vw] max-w-sm sm:w-80 mt-2
      bg-card rounded-xl shadow-lg ring-1 ring-ring
    `}
        >
          <div className="flex justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-semibold text-fg">
              الإشعارات
            </span>
            {notifications.length > 0 && (
              <button
                className="text-xs text-accent hover:text-accent-hover"
                onClick={markAllAsRead}
              >
                تعيين الكل كمقروء
              </button>
            )}
          </div>
          <ul className="max-h-80 overflow-y-auto divide-y divide-border">
            {notifications.length === 0 ? (
              <li className="p-4 text-center text-sm text-muted-foreground">
                لا توجد إشعارات
              </li>
            ) : (
              notifications.map((n) => (
                <li
                  key={n.id}
                  onClick={() => onClickNotif(n)}
                  className={`p-4 cursor-pointer transition hover:bg-muted ${!n.read ? 'bg-primary/10' : ''}`}
                >
                  <div className="text-sm font-medium text-fg">
                    {n.icon} {n.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {n.message}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {new Intl.DateTimeFormat('ar-EG', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    }).format(new Date(n.created_at))}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
