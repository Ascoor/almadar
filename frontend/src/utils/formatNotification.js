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

const entityDictionary = {
  contract: {
    labelKey: 'notifications.entities.contract',
    path: 'contracts',
    fallbackLabel: 'العقد',
  },
  contracts: {
    labelKey: 'notifications.entities.contract',
    path: 'contracts',
    fallbackLabel: 'العقد',
  },
  session: {
    labelKey: 'notifications.entities.session',
    path: 'sessions',
    fallbackLabel: 'الجلسة',
  },
  hearing: {
    labelKey: 'notifications.entities.session',
    path: 'sessions',
    fallbackLabel: 'الجلسة',
  },
  case: {
    labelKey: 'notifications.entities.case',
    path: 'cases',
    fallbackLabel: 'القضية',
  },
  lawsuit: {
    labelKey: 'notifications.entities.case',
    path: 'cases',
    fallbackLabel: 'القضية',
  },
  consultation: {
    labelKey: 'notifications.entities.consultation',
    path: 'consultations',
    fallbackLabel: 'المشورة',
  },
  consultations: {
    labelKey: 'notifications.entities.consultation',
    path: 'consultations',
    fallbackLabel: 'المشورة',
  },
  investigation: {
    labelKey: 'notifications.entities.investigation',
    path: 'investigations',
    fallbackLabel: 'التحقيق',
  },
  investigations: {
    labelKey: 'notifications.entities.investigation',
    path: 'investigations',
    fallbackLabel: 'التحقيق',
  },
  procedures: {
    labelKey: 'notifications.entities.procedure',
    path: 'legal/investigation-action',
    fallbackLabel: 'الإجراء',
  },
  'investigation-action': {
    labelKey: 'notifications.entities.procedure',
    path: 'legal/investigation-action',
    fallbackLabel: 'الإجراء',
  },
  'legal-advice': {
    labelKey: 'notifications.entities.legalAdvice',
    path: 'legal-advices',
    fallbackLabel: 'الاستشارة القانونية',
  },
  'legal-advices': {
    labelKey: 'notifications.entities.legalAdvice',
    path: 'legal-advices',
    fallbackLabel: 'الاستشارة القانونية',
  },
  legaladvices: {
    labelKey: 'notifications.entities.legalAdvice',
    path: 'legal-advices',
    fallbackLabel: 'الاستشارة القانونية',
  },
  legaladvice: {
    labelKey: 'notifications.entities.legalAdvice',
    path: 'legal-advices',
    fallbackLabel: 'الاستشارة القانونية',
  },
  litigation: {
    labelKey: 'notifications.entities.litigation',
    path: 'litigations',
    fallbackLabel: 'الدعوى',
  },
  litigations: {
    labelKey: 'notifications.entities.litigation',
    path: 'litigations',
    fallbackLabel: 'الدعوى',
  },
  archive: {
    labelKey: 'notifications.entities.archive',
    path: 'archives',
    fallbackLabel: 'الأرشيف',
  },
  archives: {
    labelKey: 'notifications.entities.archive',
    path: 'archives',
    fallbackLabel: 'الأرشيف',
  },
  user: {
    labelKey: 'notifications.entities.user',
    path: 'users',
    fallbackLabel: 'المستخدم',
  },
  users: {
    labelKey: 'notifications.entities.user',
    path: 'users',
    fallbackLabel: 'المستخدم',
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
    payload.entity_id ||
    payload.entityId ||
    payload?.data?.entity_id ||
    payload?.data?.entityId ||
    payload?.params?.entity_id ||
    payload?.params?.entityId ||
    payload?.meta?.entity_id ||
    payload?.meta?.entityId;

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
      : meta?.fallbackLabel || sectionKey;

  const eventKey =
    payload.event || payload.key || payload?.meta?.event || 'generic';
  const eventLabelKey = `notifications.events.${eventKey}.label`;
  const eventLabel = t(eventLabelKey);

  const baseTitleKey =
    payload.title_key || `notifications.events.${eventKey}.title`;
  const baseMessageKey =
    payload.message_key || `notifications.events.${eventKey}.message`;

  const interpolation = {
    section: sectionLabel,
    entity_type: payload.entity_type || payload.entityType,
    entity_id: payload.entity_id,
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
