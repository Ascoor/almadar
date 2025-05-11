import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from '../components/auth/Login';
import { WelcomeLogoWhite, LoginBg } from '../assets/images'; 
 
import AuthSpinner from '../components/common/Spinners/AuthSpinner';
import { toast } from 'sonner';

const HomePage = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true); // بدء عرض التحميل
      // عملية تسجيل الدخول هنا
      setTimeout(() => {
        setIsLoading(false); // إيقاف عرض التحميل
        // عرض رسالة التوستر بنجاح
        toast('success', 'تم تسجيل الدخول بنجاح ✅');
        setShowLoginForm(false);
      }, 1500);
    } catch (error) {
      setIsLoading(false); // إيقاف عرض التحميل بفشل
      // عرض رسالة التوستر بفشل
      toast('error', 'فشل تسجيل الدخول ❌');
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <img
        src={LoginBg}
        alt="Login Background"
        className="absolute inset-0 object-cover w-full h-full"
      />
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-white">
        {!showLoginForm && !isLoading && (
          <>
            <motion.img
              src={WelcomeLogoWhite}
              alt="Welcome Logo"
              className="w-32 md:w-48 mb-8 drop-shadow-2xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            />

            <motion.h1
              className="text-3xl   md:text-6xl font-['Tajawal'] font-extrabold text-center bg-gradient-to-tr from-emerald-300 via-lime-300 to-cyan-300 bg-clip-text text-transparent p-0 drop-shadow-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              تطبيق إدارة الشؤون القانونية
            </motion.h1>

            <motion.button
              onClick={() => setShowLoginForm(true)}
              className="mt-10 px-8 py-3 bg-emerald-600 hover:bg-emerald-900 rounded-full text-white font-bold shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🚀 تسجيل الدخول
            </motion.button>
          </>
        )}

        {isLoading && <AuthSpinner />}

        <AnimatePresence>
          {showLoginForm && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Login
                onAuthStart={() => setIsLoading(true)}
                handleFormClose={() => setShowLoginForm(false)}
                onAuthComplete={(success) => {
                  setIsLoading(false);
                  // رسالة التوستر تظهر فقط عند نجاح التسجيل
                  if (success) {
                    toast('success', 'تم تسجيل الدخول بنجاح ✅');
                    setShowLoginForm(false);
                  }
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HomePage;
