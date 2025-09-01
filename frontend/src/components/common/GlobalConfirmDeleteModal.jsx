import React from 'react';
import {
  modalOverlay,
  modalContainer,
  modalCancelButton,
  modalDestructiveButton,
} from './modalStyles';

const GlobalConfirmDeleteModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className={modalOverlay}>
      <div className={`${modalContainer} max-w-md`}>
        <h2 className="mb-4 text-center text-lg font-bold text-fg">
          تأكيد الحذف
        </h2>
        <p className="mb-6 text-center text-muted">
          هل أنت متأكد أنك تريد حذف{' '}
          <span className="font-bold text-destructive">{itemName}</span>؟
        </p>
        <div className="flex justify-center gap-4">
          <button onClick={onConfirm} className={modalDestructiveButton}>
            تأكيد
          </button>
          <button onClick={onClose} className={modalCancelButton}>
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalConfirmDeleteModal;
