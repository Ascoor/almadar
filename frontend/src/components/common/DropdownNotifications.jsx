import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { getNotifications, markAsRead } from '@/services/api/notifications';
import { useNotifications } from '@/components/Notifications/NotificationContext';
import IconButton from './iconButton';

export default function DropdownNotifications() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const {
    notifications,
    setNotifications,
    hasNew,
    setHasNew,
  } = useNotifications();

  // ✅ جلب الإشعارات عند الفتح
  const toggleDropdown = async () => {
    const nextOpen = !dropdownOpen;
    setDropdownOpen(nextOpen);
    if (nextOpen) {
      await fetchNotifications();
      setHasNew(false); // ✅ أطفئ اللمبة
    }
  };

  // ✅ جلب الإشعارات من السيرفر
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('فشل في جلب الإشعارات', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ عند الضغط على إشعار
  const handleNotificationClick = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      const anyUnread = notifications.some((n) => !n.read);
      if (!anyUnread) setHasNew(false); // ✅ أطفئ اللمبة إذا الكل مقروء
    } catch (e) {
      console.error('تعذر تعيين الإشعار كمقروء', e);
    }
    setDropdownOpen(false);
  };

  // ✅ تعيين الكل كمقروء
  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
    setHasNew(false); // ✅ أطفئ اللمبة
  };

  // ✅ إغلاق عند الضغط خارج المكون
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <IconButton onClick={toggleDropdown} active={dropdownOpen}>
        <Bell className="w-6 h-6" />
        {hasNew && (
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-white dark:border-gray-800 animate-pulse" />
        )}
      </IconButton>

      {dropdownOpen && (
        <div className="absolute right-0 z-50 w-80 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
            <span className="font-semibold text-sm text-gray-700 dark:text-gray-200">الإشعارات</span>
            {notifications.length > 0 && (
              <button
                className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={handleMarkAllAsRead}
              >
                تعيين الكل كمقروء
              </button>
            )}
          </div>

          <ul className="max-h-80 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-600">
            {loading ? (
              <li className="p-4 text-center text-sm text-gray-400 dark:text-gray-500">جارٍ التحميل...</li>
            ) : notifications.length === 0 ? (
              <li className="p-4 text-center text-sm text-gray-400 dark:text-gray-500">لا توجد إشعارات</li>
            ) : (
              notifications.map((n) => (
                <li
                  key={n.id}
                  onClick={() => handleNotificationClick(n.id)}
                  className={`p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    !n.read ? 'bg-emerald-50 dark:bg-emerald-900/30' : ''
                  }`}
                >
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{n.title || 'إشعار'}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {n.message || n.body || (n.data && n.data.message) || '—'}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{n.time || n.created_at || ''}</div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
