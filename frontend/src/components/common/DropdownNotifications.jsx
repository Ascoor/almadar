import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { markAsRead } from '@/services/api/notifications';
import { useNotifications } from '@/components/Notifications/NotificationContext';
import IconButton from './iconButton';
import { useNotificationQuery } from '@/hooks/dataHooks';

export default function DropdownNotifications() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [loadedNotifications, setLoadedNotifications] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);

  const dropdownRef = useRef(null);
  const { notifications, setNotifications, hasNew, setHasNew } = useNotifications();
  const { data: fetchedNotifications = [], isLoading, refetch } = useNotificationQuery();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !dropdownOpen) {
          setDropdownOpen(false);
        }
      },
      { root: null, threshold: 0.5 }
    );

    const el = dropdownRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [dropdownOpen]);

  const toggleDropdown = async () => {
    const nextOpen = !dropdownOpen;
    setDropdownOpen(nextOpen);

    if (nextOpen) {
      setLoading(true);
      try {
        const result = await refetch();
        if (result?.data) {
          setAllNotifications(result.data);
          setLoadedNotifications(result.data.slice(0, 5));
          setShowMore(result.data.length > 5);
        }
        setHasNew(false);
      } catch (error) {
        console.error('فشل تحميل الإشعارات:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleNotificationClick = async (id) => {
    try {
      await markAsRead(id);
      const updated = notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      );
      setNotifications(updated);
      if (!updated.some(n => !n.read)) setHasNew(false);
    } catch (e) {
      console.error('تعذر تعيين الإشعار كمقروء', e);
    }
    setDropdownOpen(false);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setHasNew(false);
  };

  const handleShowMore = () => {
    const more = allNotifications.slice(loadedNotifications.length);
    setLoadedNotifications(prev => [...prev, ...more]);
    setShowMore(false);
  };

  const formatDate = (date) => {
    try {
      return new Intl.DateTimeFormat('ar-EG', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(new Date(date));
    } catch {
      return '';
    }
  };

  return (
    <div className="relative" ref={dropdownRef} dir="rtl">
      <IconButton onClick={toggleDropdown} active={dropdownOpen}>
        <Bell className="w-6 h-6" />
        {hasNew && (
          <span className="absolute top-0 left-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-white dark:border-gray-800 animate-ping" />
        )}
      </IconButton>

      {dropdownOpen && (
        <div className="absolute left-0 z-50 w-72 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
            <span className="font-semibold text-sm text-gray-700 dark:text-gray-200">الإشعارات</span>
            {notifications.length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                تعيين الكل كمقروء
              </button>
            )}
          </div>

          <ul className="max-h-80 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-600">
            {isLoading || loading ? (
              <li className="p-4 text-center text-sm text-gray-400 dark:text-gray-500">جارٍ التحميل...</li>
            ) : loadedNotifications.length === 0 ? (
              <li className="p-4 text-center text-sm text-gray-400 dark:text-gray-500">لا توجد إشعارات</li>
            ) : (
              loadedNotifications.map((n) => (
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
                  <div className="text-xs text-gray-400 mt-1">{formatDate(n.created_at)}</div>
                </li>
              ))
            )}
          </ul>

          {showMore && (
            <div className="text-center mt-2">
              <button
                onClick={handleShowMore}
                className="text-blue-500 hover:text-blue-700 text-xs"
              >
                عرض المزيد
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
