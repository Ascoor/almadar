import { useState } from 'react';
import { motion, AnimatePresence , useReducedMotion } from "framer-motion";
import Login from '@/components/organisms/Login';
import { WelcomeLogoWhite, WelcomeImage2 } from '@/assets/images';
import AuthSpinner from '@/components/common/Spinners/AuthSpinner';

const HomePage = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const reduce = useReducedMotion();
  return (
    <div className="relative w-full min-h-screen overflow-hidden font-['Tajawal']">
      <img
        src={WelcomeImage2}
        alt="خلفية"
        className="absolute inset-0 w-full h-full object-cover z-0"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/20 z-10" />

      <div className="relative z-20 flex items-center justify-center h-screen px-4 sm:px-6">
        {isLoading && <AuthSpinner />}

        <AnimatePresence>
          {!showLoginForm && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-xl text-center   rounded-3xl shadow-xl p-8 sm:p-10 space-y-6"
            >
              <motion.img
                src={WelcomeLogoWhite}
                alt="شعار"
                className="h-70 w-73   drop-shadow-2xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              />

     <motion.button
      type="button" 
        onClick={() => setShowLoginForm(true)}
            
      disabled={isLoading} 
      aria-label="تسجيل الدخول"
      className="
        relative inline-flex items-center justify-center gap-2
        px-6 md:px-8 py-3 rounded-xl
        font-semibold tracking-tight
        text-primary-foreground
        bg-gradient-primary
        shadow-glow hover:shadow-xl
        focus-ring
        transition-[transform,box-shadow,opacity] will-change-transform
        disabled:opacity-60 disabled:cursor-not-allowed
        select-none
      "
      whileHover={reduce ? undefined : { y: -1, scale: 1.02 }}
      whileTap={reduce ? undefined : { scale: 0.98 }}
    >
      {/* sheen خفيف عند المرور */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] 
                   before:absolute before:inset-0 before:rounded-[inherit]
                   before:bg-background/10 before:opacity-0 hover:before:opacity-100
                   before:transition-opacity"
      />
      {/* محتوى الزر */}
      <span className={isLoading ? "opacity-0" : "opacity-100"}>🚀 تسجيل الدخول</span>

      {/* مُحمّل صغير داخل الزر */}
      {isLoading && (
        <span className="absolute inset-0 grid place-items-center">
          <span
            className="h-5 w-5 animate-spin rounded-full border-2
                       border-primary-foreground/60 border-t-transparent"
          />
        </span>
      )}
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
