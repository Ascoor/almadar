import React from 'react';

const GlobalConfirmDeleteModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="p-6 rounded-lg shadow-lg max-w-md w-full bg-card">
        <h2 className="mb-4 text-center text-lg font-bold text-card-foreground">
          تأكيد الحذف
        </h2>
        <p className="mb-6 text-center text-muted-foreground">
          هل أنت متأكد أنك تريد حذف{' '}
          <span className="font-bold text-destructive">{itemName}</span>؟
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition"
          >
            تأكيد
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-muted text-fg hover:bg-muted/80 transition"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalConfirmDeleteModal;
