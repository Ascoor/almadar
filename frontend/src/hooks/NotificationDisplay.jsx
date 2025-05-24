// File: src/components/NotificationDisplay.jsx
import React, { useState, useEffect } from 'react';
import { Bell, XCircle } from 'lucide-react'; // Example icons
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications'; // Import your custom hook
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale'; // Arabic locale

export default function NotificationDisplay({ userId }) {
  // Use the hook to get notifications and related states/functions
  const {
    notifications,
    hasNewEvent,
    setHasNewEvent,
    markNotificationAsRead,
    deleteReadNotifications,
  } = useRealtimeNotifications({ userId }); // Pass userId to the hook

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showRead, setShowRead] = useState(false); // To toggle display of read notifications

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
    // When the dropdown opens, the user has seen the new event, so clear the red dot
    if (!dropdownOpen) {
      setHasNewEvent(false);
    }
  };

  // Filter notifications for display
  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read).slice(0, 5); // Show top 5 read by default

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the dropdown and the button
      if (dropdownOpen &&
          !event.target.closest('.relative.inline-block.text-left')) { // Ensure this selector matches the outer div
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);


  return (
    <div className="relative inline-block text-left" dir="rtl"> {/* Add dir="rtl" for the whole component */}
      {/* Bell icon button with red dot and unread count */}
      <button
        onClick={toggleDropdown}
        className={`relative p-3 rounded-full transition-colors duration-300
          ${dropdownOpen ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700'}`}
        aria-expanded={dropdownOpen}
        aria-haspopup="true"
        title="الإشعارات"
      >
        <Bell className="w-6 h-6" />
        {/* Red dot indicator */}
        {hasNewEvent && (
          <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse" aria-hidden="true" />
        )}
        {/* Unread count badge */}
        {unreadNotifications.length > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
            {unreadNotifications.length}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Panel */}
      {dropdownOpen && (
        <div
          className="absolute right-0 mt-3 w-96 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 transform origin-top-right animate-scale-in"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="notifications-menu-button"
        >
          {/* Dropdown Header */}
          <div className="flex items-center justify-between px-4 py-2 font-semibold text-sm border-b dark:border-gray-600">
            <span>📬 الإشعارات</span>
            <button
              onClick={() => unreadNotifications.forEach(n => markNotificationAsRead(n.id))}
              className="text-xs text-blue-600 hover:underline dark:text-blue-400"
              disabled={unreadNotifications.length === 0}
            >
              تحديد الكل كمقروء
            </button>
          </div>

          {/* Notifications List */}
          <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto custom-scrollbar">
            {/* Message if no unread notifications */}
            {unreadNotifications.length === 0 && !showRead && (
              <li className="p-4 text-center text-gray-400 dark:text-gray-500">لا توجد إشعارات جديدة</li>
            )}

            {/* Unread Notifications (always displayed first) */}
            {unreadNotifications.map((n, idx) => (
              <li
                key={n.id || `unread-${idx}`} // Use n.id for stable keys
                onClick={() => markNotificationAsRead(n.id)}
                className={`flex flex-col items-start p-4 gap-1 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800 bg-blue-50 dark:bg-blue-950 animate-fade-in`}
                role="menuitem"
              >
                <div className="font-bold text-base">{n.title}</div>
                <div className="text-sm text-gray-800 dark:text-gray-200">{n.message}</div>
                {n.link && (
                  <a
                    href={n.link}
                    className="text-blue-600 text-xs hover:underline mt-1"
                    onClick={(e) => { e.stopPropagation(); markNotificationAsRead(n.id); }} // Prevent dropdown close for link click
                  >
                    عرض التفاصيل →
                  </a>
                )}
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {n.created_at ? formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: ar }) : 'الآن'}
                </div>
              </li>
            ))}

            {/* Read Notifications (conditionally displayed) */}
            {showRead && readNotifications.map((n, idx) => (
              <li
                key={n.id || `read-${idx}`}
                className="flex flex-col items-start p-4 gap-1 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800"
                role="menuitem"
              >
                <div className="font-medium text-base text-gray-700 dark:text-gray-300">{n.title}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{n.message}</div>
                {n.link && (
                  <a href={n.link} className="text-blue-600 text-xs hover:underline mt-1">
                    عرض التفاصيل →
                  </a>
                )}
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {n.created_at ? formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: ar }) : 'الآن'}
                </div>
              </li>
            ))}
            {/* Message if no read notifications to show and no unread */}
            {readNotifications.length === 0 && showRead && unreadNotifications.length === 0 && (
                 <li className="p-4 text-center text-gray-400 dark:text-gray-500">لا توجد إشعارات مقروءة لعرضها.</li>
            )}
          </ul>

          {/* Dropdown Footer Buttons */}
          <div className="p-3 text-center border-t border-gray-200 dark:border-gray-700 flex justify-around gap-2">
            {!showRead && readNotifications.length > 0 && (
              <button
                onClick={() => setShowRead(true)}
                className="text-sm text-blue-600 hover:underline dark:text-blue-400 flex-1"
              >
                عرض الإشعارات المقروءة ({readNotifications.length})
              </button>
            )}
            {notifications.length > 0 && ( // Show delete button if any notifications exist
              <button
                onClick={deleteReadNotifications}
                className="text-sm text-red-600 hover:underline dark:text-red-400 flex-1"
                disabled={notifications.filter(n => n.read).length === 0} // Disable if no read notifs
              >
                حذف المقروءة
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}