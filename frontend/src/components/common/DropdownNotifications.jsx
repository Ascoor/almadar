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

    // Auto-close after 10 seconds
    useEffect(() => {
      if (!dropdownOpen) return;
      const timer = setTimeout(() => setDropdownOpen(false), 10000);
      return () => clearTimeout(timer);
    }, [dropdownOpen]);

    // Close on outside click
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setDropdownOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = () => {
      setDropdownOpen(false);
    };

    return (
      <div className="relative inline-block text-right" ref={dropdownRef}>
        <IconButton onClick={toggleDropdown} active={dropdownOpen}>
          <Bell className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          {hasNew && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse" />
          )}
        </IconButton>

      {dropdownOpen && (
    <div
      className={`
        w-80 max-w-[90vw] z-50 animate-fade-in rounded-lg shadow-lg ring-1 ring-black ring-opacity-5
        bg-white dark:bg-gray-800
        absolute sm:top-12 sm:left-4
        sm:right-auto sm:translate-x-6
      top-16 left-1/2  -translate-x-1/3 -translate-y-1/6
      `}
    >  <div className="px-4 py-3 border-b border-greenic dark:border-greenic flex items-center justify-between">
              <span className="text-sm font-semibold text-greenic dark:text-greenic">الإشعارات</span>
              {notifications.length > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  تعيين الكل كمقروء
                </button>
              )}
            </div>

            <ul className="max-h-80 overflow-y-auto">
              {notifications.length === 0 && (
                <li className="p-4 text-center text-gray-500 dark:text-gray-400">
                  لا توجد إشعارات
                </li>
              )}
              {notifications.map((n, idx) => (
                <li
                  key={n.id || idx}
                  onClick={handleNotificationClick}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors` +
                    ` hover:bg-gray-100 dark:hover:bg-gray-700` +
                    ` border-l-4 ${
                      !n.read
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30'
                        : 'border-transparent'
                    }
                  `}
                >
                  <div className="text-xl text-green-600 dark:text-green-400">{n.icon || '🔔'}</div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium text-gray-800 dark:text-gray-100">{n.title}</p>
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
