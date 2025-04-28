import React, { useState } from 'react';

const Litigations = () => {
  const [activeTab, setActiveTab] = useState('against'); // against | from

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-10 text-center text-almadar-gray dark:text-almadar-dot-4">
        التقاضي
      </h1>

      {/* Tabs Buttons */}
      <div className="flex justify-center mb-10 space-x-4 rtl:space-x-reverse">
        <button
          onClick={() => setActiveTab('against')}
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-300
            ${
              activeTab === 'against'
                ? 'bg-gradient-green-button text-white shadow-lg'
                : 'bg-lightBg dark:bg-darkBg text-almadar-gray dark:text-almadar-dot-4 hover:bg-gray-300 dark:hover:bg-almadar-gray'
            }`}
        >
          دعاوى ضد الشركة
        </button>
        <button
          onClick={() => setActiveTab('from')}
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-300
            ${
              activeTab === 'from'
                ? 'bg-gradient-green-button text-white shadow-lg'
                : 'bg-lightBg dark:bg-darkBg text-almadar-gray dark:text-almadar-dot-4 hover:bg-gray-300 dark:hover:bg-almadar-gray'
            }`}
        >
          دعاوى مرفوعة من الشركة
        </button>
      </div>

      {/* Content Box */}
      <div className="bg-lightBg dark:bg-gradient-night shadow-lg rounded-2xl p-8 transition-all duration-300">
        {activeTab === 'against' ? (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-almadar-green dark:text-almadar-dot-7">
              قائمة الدعاوى ضد الشركة
            </h2>
            <p className="text-almadar-gray dark:text-almadar-dot-4">
              هنا يتم عرض الدعاوى القضائية المرفوعة ضد الشركة...
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-almadar-green dark:text-almadar-dot-7">
              قائمة الدعاوى المرفوعة من الشركة
            </h2>
            <p className="text-almadar-gray dark:text-almadar-dot-4">
              هنا يتم عرض الدعاوى القضائية التي رفعتها الشركة ضد الغير...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Litigations;
