import React, { useState } from 'react'; 
import { motion } from 'framer-motion';
import Login from '../components/auth/Login'; 
import { LogoPatren, WelcomeImage } from '../assets/images';
import { useAlert } from '../context/AlertContext';
import AuthSpinner from '../components/common/Spinners/AuthSpinner';

const HomePage = () => {
  const [showLoginForm, setShowLoginForm] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);
  const { triggerAlert } = useAlert();

  const isModalOpen = showLoginForm || isLoading;

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center px-4">
      
      {/* الخلفية المتحركة */}
      <motion.img
        src={WelcomeImage}
        alt="Background"
        className="absolute w-full h-full object-cover"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 z-0" />

      {/* محتوى الصفحة */}
      {!isModalOpen && (
        <div className="z-10 flex flex-col items-center justify-center gap-8">
          
          {/* شعار Logo وسط Fade-In */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="w-[clamp(140px,30vw,280px)] max-w-full drop-shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
          >
            <img
              src={LogoPatren}
              alt="Logo"
              className="w-full h-auto object-contain"
            />
          </motion.div>

          {/* حاوية العنوان والأزرار مع خلفية خضراء */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className=" rounded-2xl  flex flex-col items-center gap-4 shadow-lg  w-full max-w-md"
          >
   <h2 className="text-white text-xl sm:text-2xl font-bold text-center drop-shadow-[0_0_4px_rgba(0,255,0,1)]">
  تطبيق إدارة الشؤون القانونية
</h2>


            {/* الأزرار */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              onClick={() => setShowLoginForm(true)}
              className="px-8 py-2.5 text-base sm:text-lg font-semibold bg-white text-green-600 rounded-2xl hover:scale-105 transition-all shadow-md"
            >
              تسجيل الدخول
            </motion.button>
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
  );
};

export default HomePage;
