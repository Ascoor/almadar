import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { formatNotification } from '@/utils/formatNotification';
import { useMemo } from 'react';

export default function NotificationCard({ notification, onOpen, onMarkRead }) {
  const { t, lang } = useLanguage();

  const formatted = useMemo(
    () => formatNotification(notification, t, lang),
    [notification, t, lang],
  );

  if (!formatted) return null;

  return (
    <div
      className={`p-4 rounded-xl border border-border shadow-sm bg-white/70 dark:bg-zinc-900/70 flex flex-col gap-2 ${formatted.read ? '' : 'ring-1 ring-blue-200 dark:ring-blue-900'}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-base flex items-center gap-2">
            <span className="text-blue-500">🔔</span>
            {formatted.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {formatted.message}
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            <Badge variant="secondary">{formatted.section}</Badge>
            <Badge variant="outline">{formatted.event}</Badge>
            {formatted.formattedDate && <span>{formatted.formattedDate}</span>}
          </div>
        </div>
        {!formatted.read && (
          <Badge variant="destructive">{t('notifications.ui.unread')}</Badge>
        )}
      </div>

      <div className="flex gap-2 justify-end pt-2">
        {!formatted.read && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMarkRead?.(notification)}
          >
            {t('notifications.ui.markRead')}
          </Button>
        )}
        <Button size="sm" onClick={() => onOpen?.(notification)}>
          {t('notifications.ui.open')}
        </Button>
      </div>
    </div>
  );
}
