import React from 'react';

const GlobalConfirmDeleteModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-fg/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="p-6 rounded-lg shadow-lg max-w-md w-full bg-card">
        <h2 className="mb-4 text-center text-lg font-bold text-fg">
          تأكيد الحذف
        </h2>
        <p className="mb-6 text-center text-muted">
          هل أنت متأكد أنك تريد حذف{' '}
          <span className="font-bold text-destructive">{itemName}</span>؟
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-2xl bg-destructive text-fg hover:brightness-110 hover:shadow-glow transition"
          >
            تأكيد
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-2xl bg-muted text-fg hover:shadow-glow transition"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalConfirmDeleteModal;
