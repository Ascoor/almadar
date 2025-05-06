import React, { useState } from 'react'; 
import { motion } from 'framer-motion';
import Login from '../components/auth/Login'; 
import { WelcomeLogoWhite, WelcomeGradient } from '../assets/images';
import { useAlert } from '../context/AlertContext';
import AuthSpinner from '../components/common/Spinners/AuthSpinner';

const HomePage = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { triggerAlert } = useAlert();
  const isModalOpen = showLoginForm || isLoading;

  return (
    <div className="relative w-full h-screen overflow-hidden">
    {/* الخلفية */}
    <img
      src={WelcomeGradient}
      className="absolute inset-0 object-cover w-full h-full"
      alt="Background"
    />
    <div className="absolute inset-0 bg-gray-900 bg-opacity-60" />

    <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 sm:px-6 md:px-8 lg:px-16">
      {!isModalOpen && (
        <>
          {/* الشعار متحرك */}
          <motion.img
            src={WelcomeLogoWhite}
            alt="Logo"
            className="w-32 sm:w-36 md:w-40 lg:w-52 mb-6 sm:mb-8 md:mb-10 drop-shadow-2xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          />

          {/* عنوان التطبيق المتوهج والمجسم */}
          <motion.h1
            className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold text-white text-center"
            style={{
              textShadow:
                '0 0 6px rgba(62,180,137,0.8), 0 0 12px rgba(62,180,137,0.6), 0 0 18px rgba(62,180,137,0.4)',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0.9, 1, 0.9],
              scale: [1, 1.05, 1],
              textShadow: [
                '0 0 6px rgba(62,180,137,0.8), 0 0 12px rgba(62,180,137,0.6)',
                '0 0 10px rgba(62,180,137,1), 0 0 20px rgba(62,180,137,0.8)',
                '0 0 6px rgba(62,180,137,0.8), 0 0 12px rgba(62,180,137,0.6)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            تطبيق إدارة الشؤون القانونية
          </motion.h1>

          {/* زر تسجيل الدخول */}
          <motion.button
            className="mt-8 sm:mt-10 md:mt-12 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-green-500 text-white text-base sm:text-lg md:text-xl font-bold rounded-full shadow-lg"
            whileHover={{ scale: 1.1, boxShadow: '0px 0px 20px rgba(62,180,137,0.7)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLoginForm(true)}
          >
            🚀 تسجيل الدخول
          </motion.button>
        </>
      )}

      {isLoading && <AuthSpinner />}

      {showLoginForm && (
        <div className="absolute inset-0 flex items-center justify-center bg-opacity-70">
          <div className="px-4 sm:px-6 md:px-8 lg:px-16 w-full max-w-md">
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
        </div>
      )}
    </div>
  </div>
);
};

export default HomePage;
