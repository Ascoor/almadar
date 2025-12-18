import dayjs from 'dayjs';

const defaultPayload = {
  title: 'Notification',
  message: '',
  action_url: null,
  entity_type: null,
  entity_id: null,
  section: null,
  event: null,
  actor_name: null,
};

export function formatNotification(notification, t, lang = 'en') {
  if (!notification) return null;

  const payload = { ...defaultPayload, ...(notification.data || notification) };
  const eventKey = payload.event || payload.key || 'generic';
  const section = payload.section || payload.entity_type || 'item';

  const baseTitleKey = `notifications.events.${eventKey}.title`;
  const baseMessageKey = `notifications.events.${eventKey}.message`;

  const title = t(baseTitleKey, {
    section,
    entity_type: payload.entity_type,
    entity_id: payload.entity_id,
  });

  const message = t(baseMessageKey, {
    actor_name: payload.actor_name,
    section,
    entity_type: payload.entity_type,
    entity_id: payload.entity_id,
    message: payload.message,
  });

  const fallbackTitle =
    title && title !== baseTitleKey
      ? title
      : payload.title || t('notifications.events.generic.title');

  const fallbackMessage =
    message && message !== baseMessageKey
      ? message
      : payload.message || t('notifications.events.generic.message');

  const href = payload.action_url || payload.link;

  return {
    id: notification.id,
    created_at: notification.created_at || payload.created_at,
    read: Boolean(notification.read_at || payload.read_at || notification.read),
    title: fallbackTitle,
    message: fallbackMessage,
    section,
    event: eventKey,
    link: href,
    raw: notification,
    formattedDate: payload.created_at
      ? dayjs(payload.created_at).locale(lang).format('YYYY/MM/DD HH:mm')
      : null,
  };
}

export function filterByEntity(notifications, entityType, entityId) {
  if (!Array.isArray(notifications)) return [];
  return notifications.filter((n) => {
    const data = n.data || {};
    return (
      String(data.entity_type || data.section || '').toLowerCase() ===
        String(entityType || '').toLowerCase() &&
      String(data.entity_id || '').toString() === String(entityId || '')
    );
  });
}
