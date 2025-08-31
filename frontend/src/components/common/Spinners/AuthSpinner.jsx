import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoNewArt } from '../../../assets/images';

const AuthSpinner = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const toggleInterval = setInterval(() => {
      setVisible((prev) => !prev);
    }, 1000);

    const timeout = setTimeout(() => {
      onFinish?.(); // إشعار الانتهاء للمكون الأب
    }, 2000); // مدة التحميل الإجباريه

    return () => {
      clearInterval(toggleInterval);
      clearTimeout(timeout);
    };
  }, [onFinish]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center backdrop-blur-xl bg-black/50 text-primary-foreground"
      role="status"
      aria-live="polite"
      aria-label="جاري التحميل"
    >
      <AnimatePresence>
        <motion.div
          key="spinner"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center gap-8"
        >
          <div className="w-32 h-32 border-[10px] border-border border-t-primary rounded-full animate-spin relative shadow-inner shadow-primary/20">
            <img
              src={LogoNewArt}
              alt="Logo Animation"
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 transition-opacity duration-1000 ease-in-out ${
                visible ? 'opacity-100' : 'opacity-0'
              } animate-pulse`}
            />
          </div>

          <p className="text-white text-lg md:text-xl font-bold tracking-widest drop-shadow-md animate-bounce">
            جاري التحميل، الرجاء الانتظار...
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AuthSpinner;
