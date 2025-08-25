import { useEffect, useState } from 'react';

const GlobalSpinner = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 800); // أسرع بقليل لإحساس أكثر تجاوبًا
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/40 backdrop-blur-sm">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-primary animate-spin"></div>
        <div className="absolute inset-1 rounded-full bg-card"></div>
      </div>
    </div>
  );
};

export default GlobalSpinner;
