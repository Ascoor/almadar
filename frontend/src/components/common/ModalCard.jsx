import React from 'react';

export default function ModalCard({
  isOpen,
  title,
  children,
  loading = false,
  onClose,
  onSubmit,
  submitLabel = 'حفظ',
  className = '',
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto
          bg-card text-card-foreground
          border border-border
          rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col
          transition-all duration-300 ease-in-out
          hover:shadow-3xl hover:scale-[1.01]
          ${className}
        `}
      >
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-card/80 dark:bg-background/60 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10">
            <span className="text-2xl font-bold text-foreground animate-pulse">
              جاري الحفظ...
            </span>
          </div>
        )}

        {/* Title */}
        <h2 className="
          text-2xl font-bold text-center mb-6
          text-primary border-b border-border pb-2
        ">
          {title}
        </h2>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {children}
        </div>

        {/* Footer Buttons */}
        <div className="mt-6 flex justify-end gap-3 flex-col sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="
              px-5 py-2.5 rounded-lg font-semibold
              bg-destructive text-destructive-foreground
              hover:bg-destructive/90 active:scale-95
              transition-all duration-200
            "
          >
            إلغاء
          </button>

          <button
            onClick={onSubmit}
            disabled={loading}
            className={`
              px-6 py-2.5 rounded-lg font-bold
              bg-primary text-primary-foreground
              hover:bg-primary/90 active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
            `}
          >
            {loading ? '⏳ جاري الحفظ...' : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
