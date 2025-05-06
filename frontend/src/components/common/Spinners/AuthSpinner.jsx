import React, { useEffect, useState } from 'react';
import { LogoText } from '../../../assets/images';

const AuthSpinner = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#0A1E37] to-[#102540] z-50 text-white">
      <div className="flex flex-col items-center justify-center gap-8 w-full h-full text-center z-10">
        
        {/* سبينر دائري أنيق */}
        <div className="w-36 h-36 border-[10px] border-gray-700 border-t-emerald-400 rounded-full animate-spin relative flex items-center justify-center shadow-lg shadow-emerald-600/20">
          <img
            src={LogoText}
            alt="Logo Animation"
            className={`absolute w-20 h-auto transition-opacity duration-1000 ease-in-out ${
              visible ? 'opacity-100' : 'opacity-0'
            } animate-pulse`}
          />
        </div>

        {/* نص واضح وجذاب */}
        <p className="text-emerald-300 text-xl font-bold tracking-widest drop-shadow-[0_1px_4px_rgba(0,255,180,0.4)] animate-bounce">
          جاري التحميل...
        </p>
      </div>
    </div>
  );
};

export default AuthSpinner;
