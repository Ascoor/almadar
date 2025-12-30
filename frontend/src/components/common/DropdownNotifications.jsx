import { useEffect, useMemo, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import { useLanguage } from '@/context/LanguageContext';
import IconButton from './iconButton';
import { useNavigate } from 'react-router-dom';
import { buildNotificationLink } from '@/utils/formatNotification';

export default function DropdownNotifications() {
  const { notifications, hasNew, markRead, markAllAsRead } = useNotifications();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  const sorted = useMemo(() => {
    return [...notifications].sort((a, b) => Number(a.read) - Number(b.read));
  }, [notifications]);

  // ✅ لازم تكون موجودة لأنك تستخدمها في map + navigation
  const getNotifLink = (n) => {
    const directLink =
      buildNotificationLink(n) || buildNotificationLink(n?.data);
    if (!directLink) return null;

    if (/^https?:\/\//i.test(directLink)) return directLink;
    return directLink.startsWith('/') ? directLink : `/${directLink}`;
  };

  const onClickNotif = async (n) => {
    await markRead(n.id);

    setOpen(false);

    const to = getNotifLink(n);
    if (!to) return;

    if (/^https?:\/\//i.test(to)) {
      window.location.assign(to);
    } else {
      navigate(to);
    }
  };

  return (
    <div className="relative" dir={lang === 'ar' ? 'rtl' : 'ltr'} ref={ref}>
      <IconButton
        onClick={() => setOpen((o) => !o)}
        active={open}
        className="relative"
      >
        <Bell className="w-6 h-6" />
        {hasNew && (
          <>
            <span className="absolute top-0 left-0 w-2.5 h-2.5 bg-red-500 rounded-full" />
            <span className="absolute top-0 left-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping opacity-70" />
          </>
        )}
      </IconButton>

      {open && (
        <div
          className="
            sm:absolute fixed sm:left-0 top-[72px] left-1/2 -translate-x-1/2
            z-50 w-[92vw] max-w-sm sm:w-96 mt-2
            rounded-2xl border border-border shadow-xl
            bg-white/95 dark:bg-zinc-950/95 backdrop-blur
            text-zinc-900 dark:text-zinc-100
          "
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-sm font-semibold">
              {t('notifications.ui.header')}
            </span>

            {notifications.length > 0 && (
              <button
                className="text-xs px-2 py-1 rounded-lg border border-border hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                onClick={markAllAsRead}
                type="button"
              >
                {t('notifications.ui.markAll')}
              </button>
            )}
          </div>

          <ul className="max-h-[420px] overflow-y-auto divide-y divide-border">
            {sorted.length === 0 ? (
              <li className="p-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                {t('notifications.ui.empty')}
              </li>
            ) : (
              sorted.map((n) => {
                const to = getNotifLink(n);

                return (
                  <li
                    key={n.id}
                    onClick={() => onClickNotif(n)}
                    className={`
                      p-4 cursor-pointer transition
                      hover:bg-zinc-100 dark:hover:bg-zinc-900
                      ${!n.read ? 'bg-blue-50/70 dark:bg-blue-950/30' : ''}
                    `}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold truncate">
                          {n.icon} {n.title}
                        </div>

                        <div className="text-xs mt-1 text-zinc-600 dark:text-zinc-400 break-words">
                          {n.message}
                        </div>

                        <div className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-500">
                          {new Intl.DateTimeFormat(
                            lang === 'ar' ? 'ar-EG' : 'en-US',
                            {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            },
                          ).format(new Date(n.created_at))}
                        </div>

                        {to && (
                          <div className="mt-2 inline-flex text-xs text-blue-600 dark:text-blue-400 underline">
                            {lang === 'ar' ? 'فتح' : 'Open'}
                          </div>
                        )}
                      </div>

                      {!n.read && (
                        <span className="mt-1 w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 flex-shrink-0" />
                      )}
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
