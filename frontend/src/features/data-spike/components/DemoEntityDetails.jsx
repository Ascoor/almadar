import { useMemo, useState } from 'react';
import {
  isDemoApiError,
  useAddDemoComment,
  useDemoCommentsQuery,
  useDemoEntityQuery,
} from '../hooks/useDemoEntity';

const formatDate = (isoString) =>
  new Date(isoString).toLocaleString('ar', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

const ErrorAlert = ({ title, message }) => (
  <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
    <p className="font-semibold">{title}</p>
    <p>{message}</p>
  </div>
);

const CommentCard = ({ comment }) => (
  <div className="rounded-md border border-gray-100 bg-white p-3 shadow-sm">
    <div className="flex items-center justify-between text-xs text-gray-600">
      <span>{comment.author}</span>
      <span>{formatDate(comment.createdAt)}</span>
    </div>
    <p className="mt-2 text-sm text-gray-900">
      {comment.pending ? '⏳ جاري الحفظ...' : null} {comment.body}
    </p>
  </div>
);

const CommentForm = ({ onSubmit, isLoading }) => {
  const [author, setAuthor] = useState('فريق التحرير');
  const [body, setBody] = useState('');

  return (
    <form
      className="space-y-3 rounded-md border border-gray-200 bg-white p-3 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ author, body });
        setBody('');
      }}
    >
      <div className="grid gap-1">
        <label className="text-xs text-gray-600">اسم المعلق</label>
        <input
          className="w-full rounded-md border px-3 py-2 text-sm"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>
      <div className="grid gap-1">
        <label className="text-xs text-gray-600">تعليق جديد</label>
        <textarea
          className="w-full rounded-md border px-3 py-2 text-sm"
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-end gap-2 text-xs text-gray-600">
        <span className="text-gray-500">سيتم التحديث تفاؤليًا</span>
        <button
          type="submit"
          disabled={!body || isLoading}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? 'جارٍ الحفظ...' : 'إضافة تعليق'}
        </button>
      </div>
    </form>
  );
};

const DemoEntityDetails = ({ entityId }) => {
  const {
    data: entity,
    isLoading: isEntityLoading,
    isFetching,
    error: entityError,
  } = useDemoEntityQuery(entityId);
  const { data: comments, isLoading: commentsLoading, error: commentsError } =
    useDemoCommentsQuery(entityId);
  const addComment = useAddDemoComment(entityId);

  const statusTone = useMemo(() => {
    if (!entity) return 'bg-gray-100 text-gray-700';
    switch (entity.status) {
      case 'open':
        return 'bg-green-100 text-green-700';
      case 'in-progress':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }, [entity]);

  if (isDemoApiError(entityError) && entityError.status === 404) {
    return <ErrorAlert title="العنصر غير موجود" message="لا توجد بيانات متاحة حالياً." />;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          {isEntityLoading ? (
            <div className="animate-pulse space-y-2 text-sm text-gray-500">
              <div className="h-4 w-28 rounded bg-gray-100" />
              <div className="h-5 w-2/3 rounded bg-gray-100" />
              <div className="h-4 w-1/2 rounded bg-gray-100" />
              <div className="h-4 w-1/3 rounded bg-gray-100" />
            </div>
          ) : entity ? (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs text-gray-500">المسؤول</p>
                  <p className="text-sm font-semibold text-gray-900">{entity.owner}</p>
                </div>
                <div className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone}`}>
                  {entity.translatedStatus}
                </div>
              </div>
              <h2 className="text-lg font-bold text-gray-900">{entity.title}</h2>
              <p className="text-sm leading-relaxed text-gray-700">{entity.summary}</p>
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <span>آخر تحديث: {formatDate(entity.lastUpdated)}</span>
                <span>عدد التعليقات: {entity.commentCount}</span>
                {isFetching ? <span className="text-indigo-600">جارٍ تحديث البيانات...</span> : null}
              </div>
            </div>
          ) : null}
        </div>

        {commentsError ? (
          <ErrorAlert
            title="تعذر تحميل التعليقات"
            message={isDemoApiError(commentsError) ? commentsError.message : 'حدث خطأ غير متوقع.'}
          />
        ) : null}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">التعليقات</h3>
            {commentsLoading ? <span className="text-xs text-gray-500">تحميل...</span> : null}
          </div>
          {commentsLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((skeleton) => (
                <div
                  key={skeleton}
                  className="h-16 animate-pulse rounded-md bg-gray-100"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {comments?.length ? (
                comments.map((comment) => <CommentCard key={comment.id} comment={comment} />)
              ) : (
                <p className="rounded-md bg-gray-50 p-3 text-sm text-gray-600">
                  لا توجد تعليقات بعد.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {isDemoApiError(addComment.error) && addComment.error.status === 403 ? (
          <ErrorAlert
            title="ليست لديك صلاحية لإضافة تعليق"
            message="تحقق من صلاحياتك أو اطلب من المسؤول منح الإذن."
          />
        ) : null}
        <CommentForm
          onSubmit={(payload) => addComment.mutate(payload)}
          isLoading={addComment.isPending}
        />
        <div className="rounded-md border border-indigo-100 bg-indigo-50 p-3 text-xs text-indigo-900">
          <p className="font-semibold">سياسة الكاش</p>
          <ul className="list-disc space-y-1 pr-4">
            <li>staleTime عام للكيان: 5 دقائق (من QueryClient الافتراضي).</li>
            <li>staleTime للتعليقات: دقيقة واحدة مع إعادة الجلب بالخلفية عند عودة التركيز.</li>
            <li>تمكين تحديث متفائل مع rollback عند الفشل.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DemoEntityDetails;
