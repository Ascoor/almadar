import { useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { initEcho } from '@/lib/echo';

const DETAIL_KEY_ROOTS = {
  contracts: 'contract',
  'legal-advices': 'legalAdvice',
  investigations: 'investigation',
  litigations: 'litigation',
};

const normalizeList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data?.data)) return data.data.data;
  return [];
};

export const prependCommentIfMissing = (current, incoming) => {
  const list = normalizeList(current);
  if (!incoming?.id) return list;

  const exists = list.some((entry) => String(entry.id) === String(incoming.id));
  if (exists) return list;

  return [incoming, ...list];
};

export const buildDetailQueryKey = (entityType, entityId) => {
  if (!entityType || !entityId) return null;
  const root = DETAIL_KEY_ROOTS[entityType] || entityType;
  return [root, entityId];
};

export const buildCommentsQueryKey = (entityType, entityId) => {
  const detailKey = buildDetailQueryKey(entityType, entityId);
  return detailKey ? [...detailKey, 'comments'] : null;
};

const incrementCommentCounters = (entity, delta = 1, timestamp = null) => {
  if (!entity) return entity;

  const next = { ...entity };
  const change = Number.isFinite(delta) ? delta : 1;
  const stamp = timestamp || new Date().toISOString();

  if ('commentCount' in next) {
    next.commentCount = (next.commentCount ?? 0) + change;
  }

  if ('comment_count' in next) {
    next.comment_count = (next.comment_count ?? 0) + change;
  }

  if ('comments_count' in next) {
    next.comments_count = (next.comments_count ?? 0) + change;
  }

  next.lastUpdated = stamp;
  return next;
};

export function useRealtimeComments({ entityType, entityId }) {
  const queryClient = useQueryClient();
  const detailKey = useMemo(
    () => buildDetailQueryKey(entityType, entityId),
    [entityType, entityId],
  );
  const commentsKey = useMemo(
    () => buildCommentsQueryKey(entityType, entityId),
    [entityType, entityId],
  );

  useEffect(() => {
    if (!entityType || !entityId) return undefined;

    const echo = initEcho();
    const channelName = `entity.${entityType}.${entityId}`;
    const channel = echo.private(channelName);

    const handler = (event) => {
      const incomingComment = event?.comment;
      const delta = event?.commentCountDelta ?? 1;

      if (commentsKey) {
        queryClient.setQueryData(commentsKey, (previous) =>
          prependCommentIfMissing(previous, incomingComment),
        );
      }

      if (detailKey) {
        queryClient.setQueryData(detailKey, (previous) =>
          incrementCommentCounters(previous, delta, incomingComment?.created_at),
        );
      }
    };

    channel.listen('.CommentCreated', handler);

    return () => {
      channel.stopListening('.CommentCreated', handler);
      echo.leave(channelName);
    };
  }, [commentsKey, detailKey, entityId, entityType, queryClient]);

  return { commentsKey, detailKey };
}
