import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, MessageCircle, Send, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  createLegalAdviceComment,
  getLegalAdviceComments,
} from '@/services/api/legalAdvices';

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

const getErrorMessageAr = (err) => {
  const status = err?.response?.status;
  if (status === 403) return 'لا تملك الصلاحية لإضافة تعليق.';
  if (status === 401) return 'يرجى تسجيل الدخول لإضافة تعليق.';
  return err?.response?.data?.message || err?.message || 'حدث خطأ غير متوقع.';
};

export default function LegalAdviceComments({ legalAdviceId }) {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');
  const [canComment, setCanComment] = useState(true);

  const { data: comments = [], isFetching } = useQuery({
    queryKey: ['legalAdviceComments', legalAdviceId],
    queryFn: () => getLegalAdviceComments(legalAdviceId),
    select: (res) => (Array.isArray(res?.data) ? res.data : []),
    enabled: Boolean(legalAdviceId),
  });

  const { mutate: submitComment, isPending } = useMutation({
    mutationFn: (payload) => createLegalAdviceComment(legalAdviceId, payload),

    onSuccess: () => {
      setComment('');
      setCanComment(true);
      queryClient.invalidateQueries({ queryKey: ['legalAdviceComments', legalAdviceId] });
      toast.success('تم إضافة التعليق بنجاح.');
    },

    onError: (err) => {
      const status = err?.response?.status;

      // 🔒 403 = no permission
      if (status === 403) {
        setCanComment(false);
        toast.error('لا تملك الصلاحية', {
          description: 'لا تملك الصلاحية لإضافة تعليق على هذا العنصر.',
        });
        return;
      }

      toast.error('تعذر إضافة التعليق', {
        description: getErrorMessageAr(err),
      });
    },
  });

  const trimmed = useMemo(() => comment.trim(), [comment]);
  const disabledSubmit = !legalAdviceId || !canComment || isPending || !trimmed;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (disabledSubmit) return;
    submitComment({ comment: trimmed });
  };

  return (
    <div className="space-y-4 bg-card p-4 border border-border">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-greenic dark:text-gold" />
          <h3 className="text-lg font-semibold">التعليقات</h3>
        </div>

        {!canComment && (
          <div className="flex items-center gap-2 text-xs px-2 py-1 rounded-full border border-border bg-muted/40 text-muted-foreground">
            <Lock className="w-3.5 h-3.5" />
            لا تملك الصلاحية للإضافة
          </div>
        )}
      </div>

      {/* List */}
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

        {comments.map((entry) => (
          <div
            key={entry.id}
            className="rounded-xl border border-border bg-card/40 p-3 shadow-sm"
          >
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span className="font-semibold text-fg">
                {entry.user?.name || 'مستخدم غير معروف'}
              </span>
              <span>{formatDateTime(entry.created_at)}</span>
            </div>

            <p className="text-sm leading-relaxed text-fg whitespace-pre-line">
              {entry.comment}
            </p>
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {!canComment ? (
          <div className="rounded-xl border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
            لا تملك الصلاحية لإضافة تعليق.
          </div>
        ) : (
          <>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
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
