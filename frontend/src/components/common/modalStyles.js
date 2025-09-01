export const modalOverlay = "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6";
export const modalContainer = "bg-card w-full p-6 rounded-2xl shadow-xl border border-border overflow-auto max-h-[90vh]";
export const modalInput = "w-full rounded-xl bg-card border border-border text-fg placeholder:text-muted focus:ring-2 focus:ring-ring focus:border-border p-2";
const buttonBase = "px-4 py-2 rounded-2xl hover:shadow-glow transition";
export const modalCancelButton = `${buttonBase} bg-muted text-fg`;
export const modalPrimaryButton = `${buttonBase} bg-primary text-[color:var(--primary-foreground)]`;
export const modalDestructiveButton = `${buttonBase} bg-destructive text-fg hover:brightness-110`;
