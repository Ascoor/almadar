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
 

## Build

```bash
npm run build
```

## Testing

```bash
npm test
``` 