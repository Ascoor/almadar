import  { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoPatren } from '../../../assets/images';

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
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 text-white">
      <AnimatePresence>
        <motion.div
          key="spinner"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center gap-8"
        >
  <div className="w-32 h-32 border-[10px] border-gray-600 border-t-emerald-400 rounded-full animate-spin relative shadow-inner shadow-emerald-500/20">
  <img
    src={LogoPatren}
    alt="Logo Animation"
    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 transition-opacity duration-1000 ease-in-out ${
      visible ? 'opacity-100' : 'opacity-0'
    } animate-pulse`}
  />
</div>


          <p className="text-emerald-300 text-lg md:text-xl font-bold tracking-widest drop-shadow-md animate-bounce">
            جاري التحميل، الرجاء الانتظار...
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AuthSpinner;
