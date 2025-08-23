import React from 'react';
import { FileClock } from 'lucide-react';

const ModalComponent = ({ titleModal, onClose, ContentModal, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50 overflow-y-auto'>
      <div className='w-full max-w-lg p-6 bg-card text-card-foreground rounded-lg shadow-lg m-4'>
        <button onClick={onClose} className='text-xl focus:outline-none'>
          <FileClock />
        </button>
        <div className='border-b pb-2 mb-4 text-center p-2 bg-primary'>
          <h2 className='text-lg font-bold text-primary-foreground'>
            {titleModal}
          </h2>
        </div>
        <div className='p-4 max-h-[75vh] overflow-y-auto'>{ContentModal}</div>
      </div>
    </div>
  );
};

export default ModalComponent;