import React, { useEffect, useState } from 'react';
import { LogoText } from '../../../assets/images';

const AuthSpinner = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((prev) => !prev);
    }, 1000); // التبديل بين الرؤية/الاختفاء كل ثانية
    return () => clearInterval(interval); // تنظيف الـ interval عند التخلص من الكومبوننت
  }, []);

  return (
  <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-almadar-blue-dark via-almadar-blue to-almadar-blue-dark z-50">
      {/* خلفية التوضيح مع تأثيرات الحواف */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-transparent to-blue-700 opacity-75"></div>
      
      <div className="flex flex-col gap-6 items-center justify-center w-full h-full text-center z-10">
        
        {/* سبينر دائري */}
        <div className="w-32 h-32 border-8 border-white border-t-blue-400 rounded-full animate-spin relative flex items-center justify-center">
          
          {/* الشعار مع تأثير التلاشي */}
          <img
            src={LogoText}
            alt="Logo Animation"
            className={`absolute w-16 h-auto transition-opacity duration-1000 ease-in-out ${visible ? 'opacity-100' : 'opacity-0'} animate-pulse`}
          />
        </div>

        {/* نص التحميل */}
        <p className="text-white text-lg font-semibold animate__animated animate__fadeIn animate__delay-1s">
          جاري تحميل المحتوى...
        </p>
      </div>
    </div>
  );
};

export default AuthSpinner;
