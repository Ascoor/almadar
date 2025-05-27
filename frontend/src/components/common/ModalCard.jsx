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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className={`
          relative w-full max-w-3xl max-h-[90vh] overflow-y-auto 
          bg-card dark:bg-black text-foreground dark:text-gold
          border border-border dark:border-royal
          rounded-2xl shadow-lg p-6 flex flex-col
          transition-all duration-300 ease-in-out
          hover:shadow-2xl hover:-translate-y-1
          ${className}
        `}
      >
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-card/80 dark:bg-navy/80 flex items-center justify-center rounded-2xl">
            <span className="text-gold text-2xl font-bold animate-pulse">
              جاري الحفظ...
            </span>
          </div>
        )}

        {/* Title */}
        <h2 className="
          text-2xl font-bold mb-4  
          bg-gradient-to-r from-navy-light/20 to-royal-light/20
          dark:from-royal-light/70 dark:to-navy-light/80
          text-navy-light dark:text-gold-light py-2 px-4 rounded-lg self-center w-full
          shadow-lg
        ">
          {title}
        </h2>

        {/* Content */}
        <div className="flex-1 overflow-y-auto mb-6">
          {children}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end space-x-3">
          {/* Cancel */}
          <button
            type="button"
            onClick={onClose}
            className="
              px-5 py-2.5 rounded-lg font-semibold
              bg-gradient-to-r from-reded/90 to-reded-dark/80
              dark:from-reded-dark/90 dark:to-reded-dark
              text-white
              shadow-[0_8px_15px_rgba(15,52,96,0.3)] /* ظل أعمق */
              active:shadow-inner active:scale-95
              hover:scale-110 hover:shadow-[0_15px_20px_rgba(15,52,96,0.5)]
              dark:hover:from-reded/90 dark:hover:to-reded/80
              focus:outline-none focus:ring-4 focus:ring-gold/40 focus:ring-offset-2
              transitionTransform transitionShadow transition-colors duration-300 ease-out
            "
          >
            إلغاء
          </button>

          {/* Submit */}
          <button
            onClick={onSubmit}
            disabled={loading}
            className="
              px-6 py-2 rounded-lg font-bold text-white
              bg-gradient-to-r from-royal-light to-specialist-2
              dark:from-specialist-2 dark:to-specialist-2
              shadow-[0_8px_15px_rgba(15,52,96,0.3)] /* ظل أعمق */
              active:shadow-inner active:scale-95
              hover:scale-110 hover:shadow-[0_15px_20px_rgba(15,52,96,0.5)]
              dark:hover:from-royal-light/90 dark:hover:to-royal-light/80
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-4 focus:ring-navy/20 focus:ring-offset-2
              transition-all duration-300 ease-out
            "
          >
            {loading ? 'جاري الحفظ...' : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
