import { useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { initEcho } from '@/lib/echo';

const DETAIL_KEY_ROOTS = {
  contracts: 'contract',
  'legal-advices': 'legalAdvice',
  investigations: 'investigation',
  litigations: 'litigation',
};

export const normalizeCommentsList = (source) => {
  const candidates = [
    source?.data?.data?.data,
    source?.data?.data,
    source?.data?.comments,
    source?.data,
    source?.comments,
    source,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
    if (Array.isArray(candidate?.data)) return candidate.data;
  }

  // react-query placeholderData sometimes passes undefined/null
  return [];
};

/**
 * Merge incoming comment into current list:
 * - prepends incoming
 * - removes duplicates by id
 * - optionally replaces an optimistic placeholder id (replaceId)
 */
export const mergeComments = (current, incoming, { replaceId } = {}) => {
  const list = normalizeCommentsList(current);

  if (!incoming) return list;

  const incomingId = incoming?.id != null ? String(incoming.id) : null;
  const replaceStr = replaceId != null ? String(replaceId) : null;

  // If we don't have any usable ids, just prepend safely
  if (!incomingId && !replaceStr) {
    return [incoming, ...list];
  }

  const removalIds = [incomingId, replaceStr].filter(Boolean);
  const filtered = list.filter((entry) => {
    const id = entry?.id != null ? String(entry.id) : '';
    return !removalIds.includes(id);
  });

  return [incoming, ...filtered];
};

export const updateReceipt = (current, payload) => {
  const list = normalizeCommentsList(current);

  if (!payload?.comment_id) return list;

  const targetId = String(payload.comment_id);
  const deliveredAt = payload.delivered_at;
  const readAt = payload.read_at;
  const recipientId = payload.recipient_id;

  return list.map((comment) => {
    if (String(comment?.id ?? '') !== targetId) return comment;
    if (!comment?.receipt) return comment;

    const nextReceipt = {
      ...comment.receipt,
      recipient_id: comment.receipt.recipient_id ?? recipientId,
      delivered_at: comment.receipt.delivered_at || deliveredAt,
      read_at: comment.receipt.read_at || readAt,
    };

    return { ...comment, receipt: nextReceipt };
  });
};

export const buildDetailQueryKey = (entityType, entityId) => {
  if (!entityType || entityId === undefined || entityId === null) return null;
  const root = DETAIL_KEY_ROOTS[entityType] || entityType;
  return [root, String(entityId)];
};

// ✅ ثابت ومباشر — يمنع mismatch بين fetch/mutation/realtime
export const buildCommentsQueryKey = (entityType, entityId) => {
  if (!entityType || entityId === undefined || entityId === null) return null;
  return [entityType, String(entityId), 'comments'];
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
    if (!entityType || entityId === undefined || entityId === null) return undefined;

    const echo = initEcho();
    const channelName = `entity.${entityType}.${entityId}`;
    const channel = echo.private(channelName);

    const handleCommentCreated = (event) => {
      const incomingComment = event?.comment;
      const delta = event?.commentCountDelta ?? 1;

      if (commentsKey && incomingComment) {
        queryClient.setQueryData(commentsKey, (previous) =>
          mergeComments(previous ?? [], incomingComment),
        );
      }

      if (detailKey && incomingComment) {
        queryClient.setQueryData(detailKey, (previous) =>
          incrementCommentCounters(previous, delta, incomingComment?.created_at),
        );
      }
    };

    const handleReceipt = (payload) => {
      if (!commentsKey) return;

      queryClient.setQueryData(commentsKey, (previous) =>
        updateReceipt(previous ?? [], payload),
      );
    };

    channel.listen('.CommentCreated', handleCommentCreated);
    channel.listen('.CommentReceiptDelivered', handleReceipt);
    channel.listen('.CommentReceiptRead', handleReceipt);

    return () => {
      channel.stopListening('.CommentCreated', handleCommentCreated);
      channel.stopListening('.CommentReceiptDelivered', handleReceipt);
      channel.stopListening('.CommentReceiptRead', handleReceipt);
      echo.leave(channelName);
    };
  }, [commentsKey, detailKey, entityId, entityType, queryClient]);

  return { commentsKey, detailKey };
}
