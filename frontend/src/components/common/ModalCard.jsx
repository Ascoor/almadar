import React from 'react';
import {
  modalOverlay,
  modalContainer,
  modalCancelButton,
  modalPrimaryButton,
} from './modalStyles';

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
    <div className={modalOverlay}>
      <div
        className={`${modalContainer} max-w-3xl sm:p-8 flex flex-col
          transition-all duration-300 ease-in-out
          hover:shadow-3xl hover:scale-[1.01]
          ${className}
        `}
      >
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-card/80 dark:bg-bg/60 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10">
            <span className="text-2xl font-bold text-fg animate-pulse">
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
            className={`${modalCancelButton} font-semibold`}
          >
            إلغاء
          </button>

          <button
            onClick={onSubmit}
            disabled={loading}
            className={`${modalPrimaryButton} px-6 py-2.5 font-bold disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? '⏳ جاري الحفظ...' : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
