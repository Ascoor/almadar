import React, { useEffect, useState } from 'react';
const GlobalSpinner = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 mt-6 flex items-center justify-center z-50">
      {}
      <div className="absolute inset-0 backdrop-blur-xxl"></div>
      {}
      <div className="spinner-container flex flex-wrap gap-2 relative">
        <div className="dot w-4 h-4 rounded-full bg-almadar-dot-1 dark:bg-almadar-dark-dot-1"></div>
        <div className="dot w-4 h-4 rounded-full bg-almadar-dot-1  dark:bg-almadar-dark-dot-1"></div>
        <div className="dot w-4 h-4 rounded-full bg-almadar-dot-2  dark:bg-almadar-dark-dot-2"></div>
        <div className="dot w-4 h-4 rounded-full bg-almadar-dot-3  dark:bg-almadar-dark-dot-3"></div>
        <div className="dot w-4 h-4 rounded-full bg-almadar-dot-4  dark:bg-almadar-dark-dot-4"></div>
        <div className="dot w-4 h-4 rounded-full bg-almadar-dot-5  dark:bg-almadar-dark-dot-5"></div>
        <div className="dot w-4 h-4 rounded-full bg-almadar-dot-6  dark:bg-almadar-dark-dot-6"></div>
        <div className="dot w-4 h-4 rounded-full bg-almadar-dot-7  dark:bg-almadar-dark-dot-7"></div>
        <div className="dot w-4 h-4 rounded-full bg-almadar-dot-8  dark:bg-almadar-dark-dot-8"></div>
        <div className="dot w-4 h-4 rounded-full bg-almadar-dot-9  dark:bg-almadar-dark-dot-9"></div>
        <div className="dot w-4 h-4 rounded-full bg-almadar-dot-10  dark:bg-almadar-dark-dot-10"></div>
        <div className="dot w-4 h-4 rounded-full bg-almadar-dot-11  dark:bg-almadar-dark-dot-11"></div>
        <div className="dot w-4 h-4 rounded-full bg-almadar-dot-12  dark:bg-almadar-dark-dot-12"></div>
        <div className="dot w-4 h-4 rounded-full bg-almadar-dot-13  dark:bg-almadar-dark-dot-13"></div>
        <div className="dot w-4 h-4 rounded-full bg-almadar-dot-14  dark:bg-almadar-dark-dot-14"></div>
        <div className="dot w-4 h-4 rounded-full bg-almadar-dot-15  dark:bg-almadar-dark-dot-14"></div>
      </div>{' '}
    </div>
  );
};

export default GlobalSpinner;
