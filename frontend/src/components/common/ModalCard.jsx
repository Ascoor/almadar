import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  modalOverlay,
  modalContainer,
  modalCancelButton,
  modalPrimaryButton,
  modalHeading,
} from './modalStyles';
import { useLanguage } from '@/context/LanguageContext';

export default function ModalCard({
  isOpen,
  title,
  children,
  loading = false,
  onClose,
  onSubmit,
  submitLabel = 'save',
  className = '',
}) {
  const { t } = useLanguage();
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (event) => {
    if (event.target === overlayRef.current) {
      onClose?.();
    }
  };

  return createPortal(
    <div
      ref={overlayRef}
      className={modalOverlay}
      onMouseDown={handleOverlayClick}
    >
      <div
        className={`${modalContainer} max-w-3xl sm:p-8 flex flex-col
          transition-all duration-300 ease-in-out
          hover:shadow-3xl hover:scale-[1.01]
          ${className}
        `}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-card/80 dark:bg-bg/60 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10">
            <span className="text-2xl font-bold text-fg animate-pulse">
              {t('loading')}
            </span>
          </div>
        )}

        {/* Title */}
        <h2 className={`${modalHeading} mb-6 border-b border-border pb-2`}>
          {t(title)}
        </h2>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-4">{children}</div>

        {/* Footer Buttons */}
        <div className="mt-6 flex justify-end gap-3 flex-col sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className={`${modalCancelButton} font-semibold`}
          >
            {t('cancel')}
          </button>

          <button
            onClick={onSubmit}
            disabled={loading}
            className={`${modalPrimaryButton} px-6 py-2.5 font-bold disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? `⏳ ${t('loading')}` : t(submitLabel)}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
