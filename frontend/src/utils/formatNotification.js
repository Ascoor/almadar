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
  params: {},
};

const entityDictionary = {
  contract: { labelKey: 'notifications.entities.contract', path: 'contracts' },
  contracts: { labelKey: 'notifications.entities.contract', path: 'contracts' },
  session: { labelKey: 'notifications.entities.session', path: 'sessions' },
  hearing: { labelKey: 'notifications.entities.session', path: 'sessions' },
  case: { labelKey: 'notifications.entities.case', path: 'cases' },
  lawsuit: { labelKey: 'notifications.entities.case', path: 'cases' },
  consultation: {
    labelKey: 'notifications.entities.consultation',
    path: 'consultations',
  },
  investigation: {
    labelKey: 'notifications.entities.investigation',
    path: 'investigations',
  },
  procedures: {
    labelKey: 'notifications.entities.procedure',
    path: 'legal/investigation-action',
  },
  'investigation-action': {
    labelKey: 'notifications.entities.procedure',
    path: 'legal/investigation-action',
  },
};

const cleanPath = (path) => {
  const value = String(path || '');
  if (/^https?:\/\//i.test(value)) return value;
  return `/${value.replace(/^\/+/, '')}`;
};

export const buildNotificationLink = (payload = {}) => {
  const directLink =
    payload.action_url ||
    payload.link ||
    payload?.params?.link ||
    payload?.data?.link ||
    payload?.data?.action_url;

  if (directLink) return cleanPath(directLink);

  const sectionKey =
    payload.section || payload.entity_type || payload?.data?.entity_type;
  const entityId =
    payload.entity_id ||
    payload.entityId ||
    payload?.data?.entity_id ||
    payload?.data?.entityId ||
    payload?.params?.entity_id ||
    payload?.params?.entityId;

  if (!sectionKey || !entityId) return null;

  const meta = entityDictionary[String(sectionKey).toLowerCase()];
  if (!meta?.path) return null;

  return cleanPath(`${meta.path}/${entityId}`);
};

export function formatNotification(notification, t, lang = 'en') {
  if (!notification) return null;

  const payload = { ...defaultPayload, ...(notification.data || notification) };
  const sectionKey = String(payload.section || payload.entity_type || 'item');
  const meta = entityDictionary[sectionKey.toLowerCase()];
  const sectionLabelKey = meta?.labelKey || 'notifications.entities.item';
  const sectionLabelRaw = t(sectionLabelKey);
  const sectionLabel =
    sectionLabelRaw && sectionLabelRaw !== sectionLabelKey
      ? sectionLabelRaw
      : sectionKey;

  const eventKey = payload.event || payload.key || 'generic';

  const baseTitleKey = `notifications.events.${eventKey}.title`;
  const baseMessageKey = `notifications.events.${eventKey}.message`;

  const title = t(baseTitleKey, {
    section: sectionLabel,
    entity_type: payload.entity_type,
    entity_id: payload.entity_id,
  });

  const message = t(baseMessageKey, {
    actor_name: payload.actor_name,
    section: sectionLabel,
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

  const entityId =
    payload.entity_id ||
    payload.entityId ||
    payload.contractId ||
    payload.contract_id ||
    payload?.params?.entityId ||
    payload?.params?.entity_id;

  const href = buildNotificationLink(payload);

  return {
    id: notification.id,
    created_at: notification.created_at || payload.created_at,
    read: Boolean(notification.read_at || payload.read_at || notification.read),
    title: fallbackTitle,
    message: fallbackMessage,
    section: sectionLabel,
    event: eventKey,
    link: href,
    entityId,
    entityLabel: sectionLabel,
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
