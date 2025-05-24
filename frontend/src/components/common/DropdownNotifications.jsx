import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/components/Notifications/NotificationContext';
import IconButton from './iconButton';

export default function DropdownNotifications() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { notifications, hasNew, markAllAsRead } = useNotifications();

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
    if (!dropdownOpen) markAllAsRead();
  };

  // 🧠 إغلاق عند النقر خارج القائمة
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-right" ref={dropdownRef}>
     <IconButton onClick={toggleDropdown} active={dropdownOpen}>
  <Bell className="w-5 h-5" />
  {hasNew && (
    <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 animate-ping " />
  )}
</IconButton>

      {dropdownOpen && ( 
        <div className="absolute top-12 right-0 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-xl z-50 animate-fade-in">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-700 dark:text-gray-100">الإشعارات</span>
            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-gray-500 hover:text-primary dark:hover:text-white"
              >
                تعيين الكل كمقروء
              </button>
            )}
          </div>

          <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-80 overflow-y-auto">
            {notifications.length === 0 && (
              <li className="p-4 text-center text-muted-foreground dark:text-gray-400">
                لا توجد إشعارات
              </li>
            )}
            {notifications.map((n, idx) => (
              <li
                key={n.id || idx}
                className={`flex gap-3 px-4 py-3 transition-colors cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  !n.read ? 'bg-green-50 dark:bg-green-900/30' : ''
                }`}
              >
                <div className="text-xl">{n.icon || '🔔'}</div>
                <div className="text-sm">
                  <p className="font-semibold text-gray-800 dark:text-white">{n.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
