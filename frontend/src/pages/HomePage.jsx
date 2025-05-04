import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Login from '../components/auth/Login';
import { WelcomeLogo, Triangle } from '../assets/images';  // تأكد من استخدام الشعار الذي قمت بتحميله
import { useAlert } from '../context/AlertContext';
import AuthSpinner from '../components/common/Spinners/AuthSpinner';

const HomePage = () => {
  const [showLoginForm, setShowLoginForm] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);
  const { triggerAlert } = useAlert();

  const isModalOpen = showLoginForm || isLoading;

  return (
    <div className='relative w-full h-screen overflow-hidden bg-cover bg-center'>
      {/* الخلفية المتدرجة مع تأثيرات حركية */}
      <motion.div
        className="absolute inset-0 z-0 bg-gradient-to-br from-blue-900 via-black to-blue-700 opacity-80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
      />
      
      {/* دوائر وخطوط متحركة */}
      <motion.div
        className="absolute w-[300px] z-10 h-[300px] bg-green-800 rounded-full opacity-30 top-10 left-1/4"
        initial={{ scale: 0 }}
        animate={{ scale: 1.5 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
      />
      
      <motion.div
        className="absolute w-[200px] z-10 h-[200px] bg-green-800 rounded-full opacity-40 top-1/3 right-1/4"
        initial={{ scale: 0 }}
        animate={{ scale: 1.2 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
      />
      
      {/* خطوط ديناميكية ملتوية (قنوات اتصال) */}
      <motion.div
        className="absolute top-2/4 left-3/4 z-10 w-[4px] h-[1000px] bg-green-700 opacity-30"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
      />
      
      <motion.div
        className="absolute top-1/4 right-3/4 w-[4px] h-[600px] z-10 bg-green-700 opacity-30"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      />

      {/* أشكال مثلثات متحركة */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-[6px] h-[900px] bg-green-600 z-30 opacity-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1.2 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
      />

      {/* محتوى الصفحة */}
      <div className="relative w-full h-screen bg-gradient-to-br from-white via-white to-gray-100">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-100 opacity-50 z-0 animate-pulse-slow" />

        {/* تأثيرات الخطوط الهندسية المتحركة */}
        <div className="absolute inset-0 z-10">
          <div className="relative h-full w-full">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-almadar-mint via-transparent to-almadar-blue opacity-50 animate-pulse"></div>
          </div>
        </div>

        {/* محتوى الصفحة */}
        {!isModalOpen && (
          <div className="z-20 flex w-86 flex-col items-center justify-center gap-4 h-full">
            {/* الشعار مع التأثير الديناميكي */}
            <motion.img
              src={WelcomeLogo}
              alt="Logo"
              className="w-[clamp(140px,30vw,280px)] -m-6 -auto max-w-full drop-shadow-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            />

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="rounded-2xl flex flex-col items-center gap-6 w-full max-w-md bg-white bg-opacity-80 p-4"
            >
              <div className="relative flex flex-col items-center justify-center h-full text-center">
                {/* تطبيق إدارة الشؤون القانونية مع تأثيرات متوهجة */}
                <motion.h1
                  className="text-4xl font-['tharwat'] font-bold leading-tight drop-shadow-lg animate__animated animate__fadeIn text-almadar-sidebar-danger"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2 }}
                >
                  تطبيق إدارة الشؤون القانونية
                </motion.h1>

                {/* زر تسجيل الدخول */}
                <motion.button
                  className="mt-8 px-6 py-3 z-10 bg-green-600 text-white text-lg font-bold rounded-full transition-all hover:bg-green-700"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLoginForm(true)}
                >
                  <span className="z-10 relative">🚀 تسجيل الدخول</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}

        {/* تحميل */}
        {isLoading && <AuthSpinner />}

        {/* مودال تسجيل الدخول */}
        {showLoginForm && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Login
              onAuthStart={() => setIsLoading(true)}
              handleFormClose={() => setShowLoginForm(false)}
              onAuthComplete={(success, message) => {
                setTimeout(() => {
                  setIsLoading(false);
                  if (success) {
                    setShowLoginForm(false);
                    triggerAlert('success', message);
                  } else {
                    triggerAlert('error', message);
                  }
                }, 2000);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
