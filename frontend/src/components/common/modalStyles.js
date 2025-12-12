export const modalOverlay =
  "fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 py-8 " +
  "bg-gradient-to-br from-[color:var(--bg)]/92 via-[color:var(--bg)]/88 to-[color:var(--bg)]/92 " +
  "dark:from-slate-950/88 dark:via-slate-900/85 dark:to-black/90 backdrop-blur-2xl";

export const modalContainer =
  "relative w-full max-h-[90vh] overflow-auto rounded-3xl border border-border/90 " +
  "bg-[color:var(--card)] shadow-[0_20px_70px_-28px_rgba(15,23,42,0.6)] " +
  "dark:shadow-[0_25px_80px_-40px_rgba(0,0,0,0.9)] p-6 sm:p-7 " +
  "ring-1 ring-[color:var(--ring)]/40 backdrop-blur-xl";

export const modalHeading = "text-2xl font-extrabold text-center text-primary drop-shadow-sm";

export const modalLabel = "block mb-1 text-sm font-semibold text-fg";

export const modalHelperText = "text-xs text-muted";

export const modalInput =
  "w-full rounded-xl border border-border/90 bg-[color:var(--card)] px-3 py-2.5 text-fg " +
  "placeholder:text-muted-foreground/80 shadow-md shadow-[rgba(0,0,0,0.03)] " +
  "transition focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring " +
  "dark:shadow-[0_10px_30px_-20px_rgba(0,0,0,0.8)] disabled:cursor-not-allowed disabled:opacity-70";

const buttonBase = "px-4 py-2 rounded-2xl hover:shadow-glow transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
export const modalCancelButton = `${buttonBase} bg-muted text-fg`;
export const modalPrimaryButton = `${buttonBase} bg-primary text-[color:var(--primary-foreground)]`;
export const modalDestructiveButton = `${buttonBase} bg-destructive text-fg hover:brightness-110`;
