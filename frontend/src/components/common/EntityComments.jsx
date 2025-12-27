import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Lock, MessageCircle, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { createEntityComment, getEntityComments } from '@/services/api/comments';

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

export default function EntityComments({ entityType, entityId, title = 'التعليقات' }) {
  const queryClient = useQueryClient();
  const [body, setBody] = useState('');
  const [canComment, setCanComment] = useState(true);

  const { data: comments = [], isFetching } = useQuery({
    queryKey: ['entityComments', entityType, entityId],
    queryFn: () => getEntityComments(entityType, entityId),
    select: (res) => (Array.isArray(res?.data?.data) ? res.data.data : []),
    enabled: Boolean(entityType && entityId),
  });

  const { mutate: submitComment, isPending } = useMutation({
    mutationFn: (payload) => createEntityComment(entityType, entityId, payload),
    onSuccess: () => {
      setBody('');
      setCanComment(true);
      queryClient.invalidateQueries({
        queryKey: ['entityComments', entityType, entityId],
      });
      toast.success('تم إضافة التعليق بنجاح.');
    },
    onError: (err) => {
      const status = err?.response?.status;
      if (status === 403) {
        setCanComment(false);
        toast.error('لا تملك الصلاحية', {
          description: COMMENT_FORBIDDEN,
        });
        return;
      }

      const message =
        err?.response?.data?.message || err?.message || 'حدث خطأ غير متوقع.';

      toast.error('تعذر إضافة التعليق', {
        description: message,
      });
    },
  });

  const trimmed = useMemo(() => body.trim(), [body]);
  const disabledSubmit = !entityId || !canComment || isPending || !trimmed;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (disabledSubmit) return;
    submitComment({ body: trimmed });
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-[var(--comments-panel)] p-4 shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-fg">{title}</h3>
        </div>

        {!canComment && (
          <div className="flex items-center gap-2 text-xs px-2 py-1 rounded-full border border-border bg-muted/40 text-muted-foreground">
            <Lock className="w-3.5 h-3.5" />
            لا تملك الصلاحية للإضافة
          </div>
        )}
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {isFetching && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            جاري تحميل التعليقات...
          </div>
        )}

        {!isFetching && comments.length === 0 && (
          <p className="text-sm text-muted-foreground">لا توجد تعليقات حتى الآن.</p>
        )}

        {comments.map((entry) => {
          const text = entry.body ?? entry.comment ?? '';
          return (
            <div
              key={entry.id}
              className="rounded-xl border border-border bg-[var(--comments-item)] p-3 shadow-sm"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span className="font-semibold text-fg">
                  {entry.user?.name || 'مستخدم غير معروف'}
                </span>
                <span>{formatDateTime(entry.created_at)}</span>
              </div>

              <p className="text-sm leading-relaxed text-fg whitespace-pre-line">{text}</p>
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
