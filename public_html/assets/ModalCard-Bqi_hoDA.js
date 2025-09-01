import{j as e}from"./pdf-_01J5l0m.js";import"./react-DxiZ5OBW.js";function c({isOpen:l,title:t,children:s,loading:r=!1,onClose:a,onSubmit:o,submitLabel:n="حفظ",className:d=""}){return l?e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4",children:e.jsxs("div",{className:`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto
          card p-6 sm:p-8 flex flex-col
          transition-all duration-300 ease-in-out
          hover:shadow-3xl hover:scale-[1.01]
          ${d}
        `,children:[r&&e.jsx("div",{className:"absolute inset-0 bg-card/80 dark:bg-bg/60 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10",children:e.jsx("span",{className:"text-2xl font-bold text-fg animate-pulse",children:"جاري الحفظ..."})}),e.jsx("h2",{className:`
          text-2xl font-bold text-center mb-6
          text-primary border-b border-border pb-2
        `,children:t}),e.jsx("div",{className:"flex-1 overflow-y-auto space-y-4",children:s}),e.jsxs("div",{className:"mt-6 flex justify-end gap-3 flex-col sm:flex-row",children:[e.jsx("button",{type:"button",onClick:a,className:"px-5 py-2.5 rounded-2xl font-semibold bg-destructive text-fg hover:brightness-110 hover:shadow-glow transition-all duration-200",children:"إلغاء"}),e.jsx("button",{onClick:o,disabled:r,className:"px-6 py-2.5 rounded-2xl font-bold bg-primary text-[color:var(--primary-foreground)] hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200",children:r?"⏳ جاري الحفظ...":n})]})]})}):null}export{c as M};
