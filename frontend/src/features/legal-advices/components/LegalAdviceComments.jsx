import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, MessageCircle, Send } from 'lucide-react';
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

export default function LegalAdviceComments({ legalAdviceId }) {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');

  const { data: comments = [], isFetching } = useQuery({
    queryKey: ['legalAdviceComments', legalAdviceId],
    queryFn: () => getLegalAdviceComments(legalAdviceId),
    select: (res) => (Array.isArray(res?.data) ? res.data : []),
    enabled: Boolean(legalAdviceId),
  });

  const { mutate: submitComment, isLoading } = useMutation({
    mutationFn: (payload) => createLegalAdviceComment(legalAdviceId, payload),
    onSuccess: () => {
      setComment('');
      queryClient.invalidateQueries(['legalAdviceComments', legalAdviceId]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    submitComment({ comment });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-greenic dark:text-gold" />
        <h3 className="text-lg font-semibold">التعليقات</h3>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {isFetching && (
          <div className="flex items-center gap-2 text-sm text-muted">
            <Loader2 className="w-4 h-4 animate-spin" />
            جاري تحميل التعليقات...
          </div>
        )}
        {!isFetching && comments.length === 0 && (
          <p className="text-sm text-muted">لا توجد تعليقات حتى الآن.</p>
        )}
        {comments.map((entry) => (
          <div
            key={entry.id}
            className="rounded-lg border border-border bg-card/40 p-3 shadow-sm"
          >
            <div className="flex items-center justify-between text-xs text-muted mb-1">
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

      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="أضف تعليقك هنا"
          className="min-h-[100px]"
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading || !comment.trim()}>
            {isLoading ? (
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
      </form>
    </div>
  );
}
