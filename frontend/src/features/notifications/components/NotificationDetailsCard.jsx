import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { formatNotification } from '@/utils/formatNotification';

export default function NotificationDetailsCard({ notification, onClose }) {
  const { t, lang } = useLanguage();
  const formatted = notification
    ? formatNotification(notification, t, lang)
    : null;

  if (!formatted) return null;

  return (
    <div className="p-6 rounded-2xl border border-border shadow-lg bg-white/80 dark:bg-zinc-900/80 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-blue-500">🔔</span>
            {formatted.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {formatted.message}
          </p>
        </div>
        <Badge variant={formatted.read ? 'outline' : 'destructive'}>
          {formatted.read ? t('notifications.ui.read') : t('notifications.ui.unread')}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <Badge variant="secondary">{formatted.section}</Badge>
        <Badge variant="outline">{formatted.event}</Badge>
        {formatted.formattedDate && <span>{formatted.formattedDate}</span>}
      </div>

      {(formatted.entityId || formatted.entityLabel) && (
        <div className="text-sm space-y-1">
          {formatted.entityLabel && (
            <div>
              {t('notifications.details.entity')}: {formatted.entityLabel}
            </div>
          )}
          {formatted.entityId && (
            <div>
              {t('notifications.details.id')}: {formatted.entityId}
            </div>
          )}
        </div>
      )}

      {formatted.link && (
        <Button asChild>
          <a href={formatted.link}>{t('notifications.ui.openDetails')}</a>
        </Button>
      )}

      <div className="flex justify-end">
        <Button variant="ghost" onClick={onClose} size="sm">
          {t('common.close') || 'Close'}
        </Button>
      </div>
    </div>
  );
}
