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
  meta: {},
};

const extractEntityId = (payload = {}) => {
  const candidates = [
    payload.entity_id,
    payload.entityId,
    payload.contract_id,
    payload.contractId,
    payload?.data?.entity_id,
    payload?.data?.entityId,
    payload?.data?.contract_id,
    payload?.data?.contractId,
    payload?.params?.entity_id,
    payload?.params?.entityId,
    payload?.params?.contract_id,
    payload?.params?.contractId,
    payload?.meta?.entity_id,
    payload?.meta?.entityId,
    payload?.meta?.contract_id,
    payload?.meta?.contractId,
  ];

  const raw = candidates.find((value) => value !== undefined && value !== null);
  if (raw === undefined) return null;

  const normalized = String(raw)
    .trim()
    .match(/[0-9a-zA-Z-]+/g);

  return normalized ? normalized.join('') : null;
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
  consultations: {
    labelKey: 'notifications.entities.consultation',
    path: 'consultations',
  },
  investigation: {
    labelKey: 'notifications.entities.investigation',
    path: 'investigations',
  },
  investigations: {
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
  'legal-advice': {
    labelKey: 'notifications.entities.legalAdvice',
    path: 'legal-advices',
  },
  'legal-advices': {
    labelKey: 'notifications.entities.legalAdvice',
    path: 'legal-advices',
  },
  legaladvices: {
    labelKey: 'notifications.entities.legalAdvice',
    path: 'legal-advices',
  },
  legaladvice: {
    labelKey: 'notifications.entities.legalAdvice',
    path: 'legal-advices',
  },
  litigation: { labelKey: 'notifications.entities.litigation', path: 'litigations' },
  litigations: { labelKey: 'notifications.entities.litigation', path: 'litigations' },
  archive: { labelKey: 'notifications.entities.archive', path: 'archives' },
  archives: { labelKey: 'notifications.entities.archive', path: 'archives' },
  user: { labelKey: 'notifications.entities.user', path: 'users' },
  users: { labelKey: 'notifications.entities.user', path: 'users' },
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
    payload?.data?.action_url ||
    payload?.meta?.link ||
    payload?.meta?.action_url;

  if (directLink) return cleanPath(directLink);

  const sectionKey =
    payload.section ||
    payload.entity_type ||
    payload?.data?.entity_type ||
    payload?.meta?.section ||
    payload?.meta?.entity_type;
  const entityId =
    extractEntityId(payload) ||
    payload?.data?.entity_id ||
    payload?.params?.entity_id ||
    payload?.meta?.entity_id;

  if (!sectionKey || !entityId) return null;

  const meta = entityDictionary[String(sectionKey).toLowerCase()];
  if (!meta?.path) return null;

  return cleanPath(`${meta.path}/${entityId}`);
};

export function formatNotification(notification, t, lang = 'en') {
  if (!notification) return null;

  const metaPayload = notification?.data?.meta || notification?.meta || {};
  const payload = {
    ...defaultPayload,
    ...(notification.data || notification),
    ...metaPayload,
    meta: metaPayload,
  };

  const sectionKey = String(
    payload.section || payload.entity_type || payload.entityType || 'item',
  );
  const meta = entityDictionary[sectionKey.toLowerCase()];
  const sectionLabelKey = meta?.labelKey || 'notifications.entities.item';
  const sectionLabelRaw = t(sectionLabelKey);
  const sectionLabel =
    sectionLabelRaw && sectionLabelRaw !== sectionLabelKey
      ? sectionLabelRaw
      : sectionKey;

  const eventKey = payload.event || payload.key || payload?.meta?.event || 'generic';
  const eventLabelKey = `notifications.events.${eventKey}.label`;
  const eventLabel = t(eventLabelKey);

  const baseTitleKey = payload.title_key || `notifications.events.${eventKey}.title`;
  const baseMessageKey =
    payload.message_key || `notifications.events.${eventKey}.message`;

  const resolvedEntityId = extractEntityId(payload);

  const interpolation = {
    section: sectionLabel,
    entity_type: payload.entity_type || payload.entityType,
    entity_id: resolvedEntityId || payload.entity_id,
    actor_name: payload.actor_name,
    message: payload.message,
    ...payload.params,
  };

  const title = t(baseTitleKey, interpolation);

  const message = t(baseMessageKey, interpolation);

  const fallbackTitle =
    title && title !== baseTitleKey
      ? title
      : payload.title || t('notifications.events.generic.title');

  const fallbackMessage =
    message && message !== baseMessageKey
      ? message
      : payload.message || t('notifications.events.generic.message');

  const entityId =
    resolvedEntityId ||
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
    event: eventLabel && eventLabel !== eventLabelKey ? eventLabel : eventKey,
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
