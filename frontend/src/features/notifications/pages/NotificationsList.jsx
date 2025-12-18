import { useEffect, useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import NotificationCard from '../components/NotificationCard';
import NotificationDetailsCard from '../components/NotificationDetailsCard';
import { useNotifications } from '@/context/NotificationContext';
import { useLanguage } from '@/context/LanguageContext';
import { markAllNotificationsRead } from '../api';

export default function NotificationsList() {
  const { notifications, markRead, markAllAsRead } = useNotifications();
  const { t } = useLanguage();
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const filtered = useMemo(() => {
    if (activeTab === 'unread') return notifications.filter((n) => !n.read);
    return notifications;
  }, [notifications, activeTab]);

  useEffect(() => {
    if (selected && notifications.every((n) => n.id !== selected.id)) {
      setSelected(null);
    }
  }, [notifications, selected]);

  const handleMarkAll = async () => {
    markAllAsRead();
    try {
      await markAllNotificationsRead();
    } catch (_) {}
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('notifications.ui.header')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('notifications.ui.description')}
          </p>
        </div>
        <Button variant="outline" onClick={handleMarkAll}>
          {t('notifications.ui.markAll')}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">{t('notifications.ui.all')}</TabsTrigger>
          <TabsTrigger value="unread">{t('notifications.ui.unread')}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-3">
          {filtered.length === 0 && (
            <div className="text-sm text-muted-foreground">
              {t('notifications.ui.empty')}
            </div>
          )}
          {filtered.map((n) => (
            <NotificationCard
              key={n.id}
              notification={n}
              onOpen={(item) => setSelected(item)}
              onMarkRead={(item) => markRead(item.id)}
            />
          ))}
        </TabsContent>

        <TabsContent value="unread" className="mt-4 space-y-3">
          {filtered.length === 0 && (
            <div className="text-sm text-muted-foreground">
              {t('notifications.ui.empty')}
            </div>
          )}
          {filtered.map((n) => (
            <NotificationCard
              key={n.id}
              notification={n}
              onOpen={(item) => setSelected(item)}
              onMarkRead={(item) => markRead(item.id)}
            />
          ))}
        </TabsContent>
      </Tabs>

      {selected && (
        <NotificationDetailsCard
          notification={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
