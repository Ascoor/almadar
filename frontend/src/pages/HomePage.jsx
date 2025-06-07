import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from '../components/auth/Login';
import { WelcomeLogoWhite, LoginBg } from '../assets/images';
import AuthSpinner from '../components/common/Spinners/AuthSpinner';

const HomePage = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="relative w-full min-h-screen overflow-hidden font-['Tajawal']">
      <img
        src={LoginBg}
        alt="خلفية"
        className="absolute inset-0 w-full h-full object-cover z-0"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/70 z-10" />

      <div className="relative z-20 flex items-center justify-center h-screen px-4 sm:px-6">
        {isLoading && <AuthSpinner />}

        <AnimatePresence>
          {!showLoginForm && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-xl text-center backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-xl p-8 sm:p-10 space-y-6"
            >
              <motion.img
                src={WelcomeLogoWhite}
                alt="شعار"
                className="w-24 sm:w-32 mx-auto drop-shadow-2xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              />

              <motion.h1
                className="text-2xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                إدارة الشؤون القانونية
              </motion.h1>

              <motion.button
                onClick={() => setShowLoginForm(true)}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-600 text-white font-bold shadow-lg hover:scale-105 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🚀 تسجيل الدخول
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

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
                  if (success) setShowLoginForm(false);
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
