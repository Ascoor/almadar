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
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const filtered = useMemo(() => {
    if (activeTab === 'unread') return notifications.filter((n) => !n.read);
    return notifications;
  }, [notifications, activeTab]);

  const selectedNotification = useMemo(() => {
    if (!selectedId) return null;
    return notifications.find((n) => n.id === selectedId) || null;
  }, [notifications, selectedId]);

  useEffect(() => {
    if (selectedId && notifications.every((n) => n.id !== selectedId)) {
      setSelectedId(null);
    }
  }, [notifications, selectedId]);

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
              onOpen={(item) => setSelectedId(item.id)}
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
              onOpen={(item) => setSelectedId(item.id)}
              onMarkRead={(item) => markRead(item.id)}
            />
          ))}
        </TabsContent>
      </Tabs>

      {selectedNotification && (
        <NotificationDetailsCard
          notification={selectedNotification}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
