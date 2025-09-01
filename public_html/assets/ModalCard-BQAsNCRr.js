import{j as e}from"./pdf-D5yLTPdL.js";function c({isOpen:t,title:l,children:a,loading:r=!1,onClose:s,onSubmit:o,submitLabel:d="حفظ",className:n=""}){return t?e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4",children:e.jsxs("div",{className:`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto
          bg-card text-card-foreground
          border border-border
          rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col
          transition-all duration-300 ease-in-out
          hover:shadow-3xl hover:scale-[1.01]
          ${n}
        `,children:[r&&e.jsx("div",{className:"absolute inset-0 bg-card/80 dark:bg-background/60 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10",children:e.jsx("span",{className:"text-2xl font-bold text-foreground animate-pulse",children:"جاري الحفظ..."})}),e.jsx("h2",{className:`
          text-2xl font-bold text-center mb-6
          text-primary border-b border-border pb-2
        `,children:l}),e.jsx("div",{className:"flex-1 overflow-y-auto space-y-4",children:a}),e.jsxs("div",{className:"mt-6 flex justify-end gap-3 flex-col sm:flex-row",children:[e.jsx("button",{type:"button",onClick:s,className:`
              px-5 py-2.5 rounded-lg font-semibold
              bg-destructive text-destructive-foreground
              hover:bg-destructive/90 active:scale-95
              transition-all duration-200
            `,children:"إلغاء"}),e.jsx("button",{onClick:o,disabled:r,className:`
              px-6 py-2.5 rounded-lg font-bold
              bg-primary text-primary-foreground
              hover:bg-primary/90 active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
            `,children:r?"⏳ جاري الحفظ...":d})]})]})}):null}export{c as M};
