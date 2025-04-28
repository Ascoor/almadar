import React from 'react';

const AttorneyDetailsModal = ({ isOpen, onClose, powerOfAttorney }) => {
  if (!isOpen) return null; // Prevent unnecessary rendering when closed.

  // Function to determine the status badge color dynamically
  const getStatusBadge = (status) => {
    switch (status) {
      case 'سارى':
        return 'bg-green-500 text-white';
      case 'ملغى':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50 ${!isOpen && 'hidden'}`}>
      <div className="max-w-lg w-full bg-white dark:bgalmadar-gray-dark rounded-lg shadow-xl transform transition-all duration-300 ease-in-out scale-100">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b borderalmadar-gray-light dark:border-gray-700 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-t-lg">
          <h2 className="text-xl font-semibold">تفاصيل التوكيل</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-800 dark:hover:text-white transition-colors duration-300"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>


        {/* Attorney Details */}
        <div className="p-6 space-y-4 text-gray-700 dark:textalmadar-gray-light">
          {/* First section */}
          <div className="space-y-3">
          <p>
              <strong className="text-indigo-600 dark:text-indigo-400">العميل:</strong> {powerOfAttorney?.client?.name || 'غير محدد'}
            </p>
             <p>
              <strong className="text-indigo-600 dark:text-indigo-400">رقم المكتب:</strong> {powerOfAttorney?.slug || 'غير محدد'}
            </p>
          
            <p>
              <strong className="text-indigo-600 dark:text-indigo-400">رقم التوكيل:</strong> {powerOfAttorney?.attorney_number || 'غير محدد'}
            </p>
            <p>
              <strong className="text-indigo-600 dark:text-indigo-400">فئة التوكيل:</strong> {powerOfAttorney?.title || 'غير محدد'}
            </p>
            <p>
              <strong className="text-indigo-600 dark:text-indigo-400">نوع التوكيل:</strong> {powerOfAttorney?.attorney_type?.name || 'N/A'}
            </p>
            <p>
              <strong className="text-indigo-600 dark:text-indigo-400">تاريخ التوكيل:</strong> {powerOfAttorney?.attorney_date_start || 'غير محدد'}
            </p>
            <p>
              <strong className="text-indigo-600 dark:text-indigo-400">تاريخ إنتهاء التوكيل:</strong> {powerOfAttorney?.attorney_date_end || 'غير محدد'}
            </p>
      
            <p>
              <strong className="text-indigo-600 dark:text-indigo-400"> محرر البيانات:</strong> {powerOfAttorney?.created_by?.name || 'غير محدد'}
            </p>
            <p>
              <strong className="text-indigo-600 dark:text-indigo-400">محدث البيانات:</strong> {powerOfAttorney?.updated_by?.name || 'غير محدد'}
            </p>
          </div>

          {/* Divider with shadow */}
          <div className="border-t borderalmadar-gray-light dark:border-gray-700 pt-4 space-y-4 shadow-lg bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p>
              <strong className="text-indigo-600 dark:text-indigo-400">العنوان:</strong> {powerOfAttorney?.attorney_place || 'غير محدد'}
            </p>
            <p>
              <strong className="text-indigo-600 dark:text-indigo-400">الوصف:</strong> {powerOfAttorney?.description || 'غير محدد'}
            </p>
            <p>
              <strong className="text-indigo-600 dark:text-indigo-400">المحامون الوكلاء:</strong> {powerOfAttorney?.attorney_lawyers || 'غير محدد'}
            </p>

            {/* Status with dynamic color using Tailwind CSS */}
            <div className="flex items-center space-x-2">
              <strong className="text-indigo-600 dark:text-indigo-400">الوضع الحالي:</strong>
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getStatusBadge(powerOfAttorney?.status)}`}>
                {powerOfAttorney?.status || 'غير محدد'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttorneyDetailsModal;
