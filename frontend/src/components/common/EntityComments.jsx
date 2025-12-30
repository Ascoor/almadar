import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Check,
  CheckCheck,
  Loader2,
  Lock,
  MessageCircle,
  Send,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  createEntityComment,
  getEntityComments,
  markCommentsAsRead,
} from '@/services/api/comments';
import { useAuth } from '@/context/AuthContext';
import {
  mergeComments,
  normalizeCommentsList,
  useRealtimeComments,
} from '@/hooks/useRealtimeComments';

const formatDateTime = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const COMMENT_FORBIDDEN = 'لا تملك الصلاحية لإضافة تعليق.';

const PERMISSION_MAP = {
  contracts: 'contracts',
  'legal-advices': 'legaladvices',
  investigations: 'investigations',
  litigations: 'litigations',
};

export default function EntityComments({
  entityType,
  entityId,
  title = 'التعليقات',
}) {
  const queryClient = useQueryClient();
  const [body, setBody] = useState('');
  const { hasPermission, user } = useAuth();

  // IMPORTANT: this hook should also wire realtime events and update cache via mergeComments
  const { commentsKey, detailKey } = useRealtimeComments({
    entityType,
    entityId,
  });

  const permissionKey = useMemo(() => {
    if (!entityType) return null;
    const normalized = PERMISSION_MAP[entityType] || entityType;
    return `edit ${normalized}`;
  }, [entityType]);

  const hasCommentPermission = permissionKey
    ? hasPermission(permissionKey) ||
      hasPermission(permissionKey.replace('edit', 'create'))
    : true;

  const [canComment, setCanComment] = useState(hasCommentPermission);

  useEffect(() => {
    setCanComment(hasCommentPermission);
  }, [hasCommentPermission]);

  const canFetch =
    Boolean(entityType) && entityId !== undefined && entityId !== null;

  const {
    data: comments = [],
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: commentsKey ?? ['comments', 'disabled'],
    queryFn: () => getEntityComments(entityType, entityId),
    select: normalizeCommentsList,
    enabled: Boolean(commentsKey) && canFetch,
    retry: false,
    // Prevent UI wipe / empty flicker during refetch & invalidations
    placeholderData: (previousData) =>
      normalizeCommentsList(previousData) ?? [],
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: markCommentsAsRead,
    onSuccess: (_data, variables) => {
      if (!commentsKey) return;

      const ids = (variables?.comment_ids ?? []).map((id) => String(id));
      const stamp = new Date().toISOString();

      queryClient.setQueryData(commentsKey, (current) => {
        const list = normalizeCommentsList(current);

        return list.map((comment) => {
          const commentId = String(comment?.id ?? '');
          if (!ids.includes(commentId)) return comment;
          if (!comment?.receipt) return comment;

          if (comment.receipt.read_at) return comment;

          const nextReceipt = { ...comment.receipt, read_at: stamp };
          return { ...comment, receipt: nextReceipt };
        });
      });
    },
  });

  const { mutate: submitComment, isPending } = useMutation({
    mutationFn: (payload) => createEntityComment(entityType, entityId, payload),

    // Optimistic add without wiping, and keep a snapshot for rollback
    onMutate: async (variables) => {
      if (!commentsKey) return {};

      await queryClient.cancelQueries({ queryKey: commentsKey });

      const previous = queryClient.getQueryData(commentsKey);

      const optimisticId = `optimistic-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const optimisticComment = {
        id: optimisticId,
        body: variables?.body,
        user: user ? { id: user.id, name: user.name } : undefined,
        created_at: new Date().toISOString(),
        receipt: user
          ? {
              recipient_id: user.id,
              delivered_at: new Date().toISOString(),
            }
          : undefined,
        optimistic: true,
      };

      queryClient.setQueryData(commentsKey, (current) =>
        mergeComments(current ?? [], optimisticComment),
      );

      return { previous, optimisticId };
    },

    onSuccess: (response, _variables, context) => {
      setBody('');
      setCanComment(true);

      const createdComment = response?.data?.comment ?? response?.comment;

      if (commentsKey && createdComment) {
        queryClient.setQueryData(commentsKey, (previous) =>
          mergeComments(previous ?? [], createdComment, {
            replaceId: context?.optimisticId,
          }),
        );
      }

      if (detailKey && createdComment) {
        queryClient.setQueryData(detailKey, (previous) => {
          if (!previous) return previous;
          const next = { ...previous };
          if ('commentCount' in next)
            next.commentCount = (next.commentCount ?? 0) + 1;
          if ('comment_count' in next)
            next.comment_count = (next.comment_count ?? 0) + 1;
          if ('comments_count' in next)
            next.comments_count = (next.comments_count ?? 0) + 1;
          next.lastUpdated =
            createdComment?.created_at || new Date().toISOString();
          return next;
        });
      }

      toast.success('تم إضافة التعليق بنجاح.');
    },

    onError: (err, _vars, context) => {
      // rollback comments snapshot only (no wipe)
      if (commentsKey && context?.previous !== undefined) {
        queryClient.setQueryData(commentsKey, context.previous);
      }

      const status = err?.response?.status;
      if (status === 403) {
        setCanComment(false);
        toast.error('لا تملك الصلاحية', { description: COMMENT_FORBIDDEN });
        return;
      }

      const message =
        err?.response?.data?.message || err?.message || 'حدث خطأ غير متوقع.';
      toast.error('تعذر إضافة التعليق', { description: message });
    },

    // Optional: ensure full consistency after success/error without wiping UI
    onSettled: () => {
      if (commentsKey) queryClient.invalidateQueries({ queryKey: commentsKey });
      if (detailKey) queryClient.invalidateQueries({ queryKey: detailKey });
    },
  });

  const trimmed = useMemo(() => body.trim(), [body]);
  const disabledSubmit = !entityId || !canComment || isPending || !trimmed;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (disabledSubmit) return;
    submitComment({ body: trimmed });
  };

  // Mark as read for current viewer (batch)
  useEffect(() => {
    if (!user?.id || !Array.isArray(comments) || comments.length === 0) return;

    const unreadIds = comments
      .filter(
        (comment) =>
          comment?.receipt?.recipient_id === user.id &&
          comment?.receipt?.delivered_at &&
          !comment?.receipt?.read_at,
      )
      .map((comment) => comment.id);

    if (unreadIds.length > 0) {
      markAsRead({ comment_ids: unreadIds });
    }
  }, [comments, markAsRead, user]);

  useEffect(() => {
    if (isError && error?.response?.status === 403) {
      setCanComment(false);
    }
  }, [error, isError]);

  const errorMessage = useMemo(() => {
    if (!isError) return '';
    if (error?.response?.status === 403)
      return 'لا تملك الصلاحية لعرض التعليقات.';
    return 'تعذر تحميل التعليقات، يرجى المحاولة لاحقًا.';
  }, [error, isError]);

  const viewerId = user?.id ? String(user.id) : null;

  const renderReceipt = (receipt, authorId) => {
    if (!receipt) return null;

    // احترام الصلاحيات: لا نعرض حالة التسليم/المشاهدة إلا للطرف المعني
    const recipientId =
      receipt.recipient_id != null ? String(receipt.recipient_id) : null;
    const canSeeReceipt =
      viewerId && (viewerId === authorId || viewerId === recipientId);

    if (!canSeeReceipt) return null;

    const isRead = Boolean(receipt.read_at);
    const isDelivered = Boolean(receipt.delivered_at);

    if (!isDelivered) return null;

    return (
      <span
        className="flex items-center gap-1 text-primary text-xs"
        title={isRead ? 'تمت المشاهدة' : 'تم التسليم'}
      >
        {isRead ? (
          <CheckCheck className="w-4 h-4" />
        ) : (
          <Check className="w-4 h-4" />
        )}
      </span>
    );
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-[var(--comments-panel)] p-4 shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between gap-2">
        {!canComment && (
          <div className="flex items-center gap-2 text-xs px-2 py-1 rounded-full border border-border bg-muted/40 text-muted-foreground">
            <Lock className="w-3.5 h-3.5" />
            لا تملك الصلاحية للإضافة
          </div>
        )}
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {(isLoading || isFetching) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            جاري تحميل التعليقات...
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {errorMessage}
          </div>
        )}

        {!isLoading && !isFetching && !isError && comments.length === 0 && (
          <p className="text-sm text-muted-foreground">
            لا توجد تعليقات حتى الآن.
          </p>
        )}

        {comments.map((entry) => {
          const text = entry.body ?? entry.comment ?? '';
          const authorId =
            entry.user?.id != null ? String(entry.user.id) : null;
          return (
            <div
              key={entry.id}
              className="rounded-xl border border-border bg-[var(--comments-item)] p-3 shadow-sm"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-fg">
                    {entry.user?.name || 'مستخدم غير معروف'}
                  </span>
                  {renderReceipt(entry.receipt, authorId)}
                </div>
                <span>{formatDateTime(entry.created_at)}</span>
              </div>

              <p className="text-sm leading-relaxed text-fg whitespace-pre-line">
                {text}
              </p>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {!canComment ? (
          <div className="rounded-xl border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
            {COMMENT_FORBIDDEN}
          </div>
        ) : (
          <>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="أضف تعليقك هنا"
              className="min-h-[100px]"
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={disabledSubmit}>
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    جاري الإضافة...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    إضافة تعليق
                  </span>
                )}
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
