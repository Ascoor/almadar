export const modalOverlay = "fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 py-8 bg-[color:var(--bg)]/80 dark:bg-black/70 backdrop-blur-xl";

export const modalContainer = "relative w-full max-h-[90vh] overflow-auto rounded-3xl border border-border/80 bg-[color:var(--card)]/95 p-6 sm:p-7 shadow-2xl ring-1 ring-[color:var(--ring)]/30";

export const modalHeading = "text-2xl font-extrabold text-center text-primary drop-shadow-sm";

export const modalLabel = "block mb-1 text-sm font-semibold text-fg";

export const modalHelperText = "text-xs text-muted";

export const modalInput = "w-full rounded-xl border border-border bg-[color:var(--card)]/95 p-2.5 text-fg placeholder:text-muted-foreground/80 shadow-sm transition focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-70";

const buttonBase = "px-4 py-2 rounded-2xl hover:shadow-glow transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
export const modalCancelButton = `${buttonBase} bg-muted text-fg`;
export const modalPrimaryButton = `${buttonBase} bg-primary text-[color:var(--primary-foreground)]`;
export const modalDestructiveButton = `${buttonBase} bg-destructive text-fg hover:brightness-110`;
