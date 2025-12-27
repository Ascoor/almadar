# Spike: معمارية جلب البيانات والكاش لواجهة React

> الهدف: توحيد منهجية **جلب البيانات، التخزين المؤقت، إدارة الحالة، وأنماط العرض** في الواجهة الأمامية. المخرج وثيقة معيارية + POC عملي على React Query.

## قرار طبقة Server State

| الخيار | الإيجابيات | الملاحظات |
| --- | --- | --- |
| **TanStack React Query (5.x)** | كاش ذكي مع `staleTime`/`gcTime`, إبطال queries دقيق, dedup مدمج, prefetch/background refetch, دعم pagination/infinite, أدوات Devtools, DX قوية واختبارات سهلة مع `QueryClientProvider` | **موصى به** كخيار افتراضي لكل بيانات السيرفر |
| SWR | بسيط وخفيف مع نفس نمط المفاتيح | يفتقر لبعض الميزات (mutations المتقدمة, devtools) |
| RTK Query | جيد عند وجود Redux مركزي مسبقًا | لدينا سياق بسيط حاليًا، لذا React Query أخف |

**الخلاصة:** نعتمد TanStack React Query كطبقة Server State افتراضية. SWR فقط للاستخدامات الخفيفة المستقلة، و RTK Query عند الحاجة لتكامل كامل مع Redux (غير موجود الآن).

## تقسيم المسؤوليات (Client / Hooks / UI)

1. **Api Client موحّد**
   - ملف واحد لتهيئة axios/fetch (`baseURL`, `withCredentials`, auth headers، refresh token، mapping للأخطاء 401/403).
   - تصدير دوال مصنّفة لكل مورد (services/api/*) مع توقيع واضح وإرجاع بيانات خام فقط.
2. **Hooks لكل Resource**
   - `useXQuery`/`useXMutation` تحتوي المنطق (queryKey, staleTime, select, optimistic updates, invalidation).
   - UI تستقبل `{ data, isLoading, error, ... }` فقط.
3. **UI Components**
   - مسؤولة عن حالات العرض (Loading/Skeleton, Error, Empty, Success) دون منطق بيانات.

> قالب إنشاء Feature جديد: `services/api/x.ts` → `features/x/hooks/useX.ts` → `features/x/components/*` + `pages/XPage.jsx`.

## سياسة الكاش والتحديث (Caching Policy)

| نوع البيانات | staleTime | gcTime | إبطال / تحديث | ملاحظات |
| --- | --- | --- | --- | --- |
| قوائم (قابلة للتصفية) | 1-2 دقيقة | 30 دقيقة | `invalidateQueries(['list', params])` بعد create/delete، أو `setQueryData` للتعديلات الصغيرة | استخدم `keepPreviousData` لتفادي الوميض |
| تفاصيل كيان | 5 دقائق | 30 دقيقة | `invalidateQueries(['entity', id])` بعد أي mutation كبيرة، أو `setQueryData` للترقيعات السريعة | prefetch للتنقلات |
| تعليقات / أنشطة سريعة | 60 ثانية | 15 دقيقة | تفاؤلي (`onMutate`) + `invalidateQueries` في `onSettled` | dedup عبر queryKey موحد |
| بيانات حية (WebSocket) | حسب كثافة الأحداث | 15 دقيقة | أحداث قليلة → `invalidateQueries`; كثيفة → `setQueryData` بترقيع آمن | احتفظ بـ `lastEventAt` لتجنب التكرار |

**Optimistic Updates:**
- `onMutate` يلغي query الكيان، يخزن snapshot، يضيف عنصر متفائل.
- `onError` يعيد snapshot، مع رسالة عربية ودودة.
- `onSettled` يعيد `invalidateQueries` لضمان تطابق البيانات.

## مفاتيح الاستعلام (Query Keys)

- قاعدة ثابتة: `['resource', id?, params?]`.
- أمثلة: 
  - قائمة: `['contracts', { page, filters }]`
  - تفاصيل: `['contract', contractId]`
  - تعليقات: `['contract', contractId, 'comments']`
- اجعل المفاتيح **سلاسل/كائنات قابلة للتسلسل**، وتجنب تمرير دوال.

## أنماط الصفحات (Page Blueprints)

- **Details Page:** تجمع queries (تفاصيل + تعليقات + تاريخ) داخل `Suspense`/`ErrorBoundary`, skeletonات متناسقة, prefetch للروابط المرتبطة.
- **Lists:** استخدام `useInfiniteQuery` أو pagination مع `keepPreviousData`, المزامنة مع URL للفرز/الفلاتر.
- **Prefetch:** أثناء hover على الروابط أو الانتقال بين الخطوات.
- **UI States:** Skeleton → Empty → Content, مع رسائل خطأ عربية موحدة.

## Server State vs UI State

- **React Query (Server State):** كل ما يأتي من API أو يحتاج caching/invalidations (قوائم، تفاصيل، counters، notifications).
- **Local/Component State:** الحقول المؤقتة (form inputs، toggles، modal open/close).
- **Context:** auth, permissions, theme, language فقط. لا تضع بيانات API في Context.
- **(اختياري) Store موسّع:** فقط لحالات UI عابرة للصفحات (مثلاً multi-step wizard) وليس لبيانات السيرفر.

## الأمن والصلاحيات

- `axiosConfig` يعالج 401 عبر callback مركزي (redirect/login) مع رسالة عربية.
- 403 من السيرفر → map إلى نص واضح في UI (`"لا تملك صلاحية تنفيذ هذا الإجراء"`).
- إخفاء عناصر UI حسب `hasPermission`، مع Fallback آمن (عدم عرض الأزرار بدلاً من تعطيلها فقط).

## الاختبارات و DX

- استخدم `renderHook` مع `QueryClientProvider` مخصص واكتب اختبارات للـ hooks دون لمس DOM.
- استعمل `queryClient.setQueryData` لتهيئة الحالة الأولية في الاختبارات.
- Devtools لـ React Query مفعّلة في بيئة التطوير فقط لتشخيص الكاش.

## خطة التطوير

1. **تهيئة البنية**: QueryClient موحّد + مفاتيح Query + قوالب مجلدات (تم في هذا الـ Spike).
2. **تطبيق تدريجي**: نقل كل Feature إلى hooks مبنية على React Query (بدءًا من القوائم الأكثر استخدامًا).
3. **توحيد UI States**: اعتماد skeletons/empty/error موحدة وإزالة data fetching من المكونات.
4. **Realtime**: إضافة listeners لـ Echo/Pusher وربطها بـ `setQueryData` أو `invalidateQueries` حسب كثافة الأحداث.
5. **الاختبارات**: تغطية hooks الحرجة (التعليقات، الملفات المالية) + smoke tests للصفحات.

## ملاحظات حول الأداء

- تجنب waterfall: اجلب البيانات المترابطة بالتوازي عبر أكثر من `useQuery` بدلاً من سلاسل await في useEffect.
- ضبط `staleTime` لتقليل refetch غير الضروري، واستخدام `select` لتهيئة البيانات وتقليل rerenders.
- استخدم `suspense` فقط في أقسام محدودة لتجنب حجب الصفحة كاملة.

## POC مختصر

- صفحة `/spike/data-fetching` تستخدم React Query بمفاتيح موحدة، كاش افتراضي، وتعامل مع 403/404.
- تمكين تحديث تفاؤلي للتعليقات مع rollback و`invalidateQueries` للكيان.
- إبراز سياسة الكاش في UI لسهولة الفهم.

