import React from 'react';
import {
  modalOverlay,
  modalContainer,
  modalCancelButton,
  modalDestructiveButton,
} from './modalStyles';
import { useLanguage } from '@/context/LanguageContext';

const GlobalConfirmDeleteModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className={modalOverlay}>
      <div className={`${modalContainer} max-w-md`}>
        <h2 className="mb-4 text-center text-lg font-bold text-fg">
          {t('labels.deleteConfirmationTitle')}
        </h2>
        <p className="mb-6 text-center text-muted">
          {t('messages.deleteConfirmation', { item: itemName })}
        </p>
        <div className="flex justify-center gap-4">
          <button onClick={onConfirm} className={modalDestructiveButton}>
            {t('buttons.confirm')}
          </button>
          <button onClick={onClose} className={modalCancelButton}>
            {t('buttons.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalConfirmDeleteModal;
