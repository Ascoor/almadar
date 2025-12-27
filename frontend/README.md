# React + Vite

This project now includes a full Word Document editor built with
[tiptap](https://tiptap.dev). The editor supports Arabic right‑to‑left
content, exports to **PDF** and **DOCX**, and offers simple AI-driven
suggestions. Editor components live under `src/components/editor` and
reuse the shared UI primitives in `src/components/ui`. The legacy `office`
directory has been removed after integration.
 
### Development
 

```bash
npm install
npm run dev
```

Visit `/editor` after logging in to access the document editor.

## Data fetching & caching (React Query)

- الوثيقة الكاملة للمعمارية، السياسات، وأنماط الصفحات موجودة في
  [`docs/frontend-data-fetching-architecture.md`](../docs/frontend-data-fetching-architecture.md).
- يوجد مسار تجريبي في الواجهة لتجربة النهج الجديد:
  - قم بتسجيل الدخول ثم افتح `/spike/data-fetching` لرؤية POC (تفاصيل + تعليقات مع تحديث متفائل وcache policy واضحة).
  - يعتمد على `QueryClient` موحّد في `src/lib/queryClient.ts` وhooks مخصصة في `src/features/data-spike/hooks`.
 

## Build

```bash
npm run build
```

## Testing

```bash
npm test
``` 