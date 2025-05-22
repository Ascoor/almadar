import  { useState } from 'react';
 
import { Bell } from 'lucide-react'; 
import { useNotifications } from '@/components/notifications/NotificationContext';

export default function DropdownNotifications() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { notifications, hasNew, markAllAsRead } = useNotifications();

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
    if (!dropdownOpen) markAllAsRead(); // عند الفتح اعتبرها مقروءة
  };

  return (
    <div className="relative inline-flex">
      <button
        onClick={toggleDropdown}
        className={`relative w-12 h-12 flex items-center justify-center rounded-full shadow-md transition-all duration-300
          ${dropdownOpen
            ? 'bg-primary text-primary-foreground'
            : 'bg-background text-foreground hover:bg-accent hover:text-accent-foreground'}`}
      >
        <Bell className="w-6 h-6" />
        {hasNew && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-ping" />
        )}
      </button>

      {dropdownOpen && (
        <div className="absolute top-14 right-0 w-80 bg-popover text-popover-foreground border border-border py-2 rounded-xl shadow-xl z-50">
          <div className="text-sm font-bold px-4 py-2 border-b border-border">الإشعارات</div>
          <ul className="divide-y divide-border max-h-80 overflow-auto">
            {notifications.length === 0 && (
              <li className="p-4 text-center text-muted-foreground">لا توجد إشعارات</li>
            )}
            {notifications.map((n, idx) => (
              <li key={n.id || idx} className="flex gap-3 px-4 py-3 hover:bg-muted transition-colors">
                <span className="text-lg">{n.icon || '🔔'}</span>
                <div>
                  <p className="font-semibold">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
