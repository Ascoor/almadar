import React, { useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { AuthContext } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import FormField from '@/components/form/FormField';
import ThemeToggle from '@/components/common/ThemeToggle';
import LanguageToggle from '@/components/common/LanguageToggle';
import { useLanguage } from '@/context/LanguageContext';

const Login = ({ onAuthStart, onAuthComplete, handleFormClose }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { lang } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    onAuthStart();

    try {
      const { success, message } = await login(email, password);

      if (success) {
        toast.success('✅ تم تسجيل الدخول بنجاح', { description: 'تم الدخول إلى النظام بنجاح.' });
        onAuthComplete(true);
      } else {
        const errorMsg = message === 'Bad credentials'
          ? 'تأكد من صحة اسم المستخدم وكلمة المرور.'
          : message;

        toast.error('❌ فشل تسجيل الدخول', { description: errorMsg });
        onAuthComplete(false);
      }
    } catch (error) {
      toast.error('حدث خطأ غير متوقع', { description: error.message });
      onAuthComplete(false);
    }
  };

  const handleCancel = () => {
    handleFormClose();
    setEmail('');
    setPassword('');
  };

  return (
    <motion.div
      className="w-full max-w-md mx-4 rounded-3xl font-['Tajawal'] overflow-hidden shadow-2xl backdrop-blur-2xl border border-white/10 bg-white/10"
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 40, opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="p-10 space-y-6">
        <div className="flex justify-end gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
        <h2
          id="login-title"
          className="text-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-lime-300 to-emerald-500 drop-shadow-xl"
        >
          {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField
            type="email"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={{ ar: 'البريد الإلكتروني', en: 'Email' }}
            label={{ ar: 'البريد الإلكتروني', en: 'Email' }}
          />

          <FormField
            type="password"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder={{ ar: 'كلمة المرور', en: 'Password' }}
            label={{ ar: 'كلمة المرور', en: 'Password' }}
          />

          <Button
            type="submit"
            className="w-full py-3 font-bold text-white bg-gradient-to-l from-emerald-600 via-green-600 to-emerald-700 rounded-lg shadow-md hover:scale-105 transition-all"
          >
            {lang === 'ar' ? '🚀 دخول' : '🚀 Login'}
          </Button>

          <button
            type="button"
            onClick={handleCancel}
            className="w-full py-3 font-semibold text-white bg-gray-600/80 border border-gray-500 rounded-lg hover:bg-gray-500 transition-all hover:scale-105"
          >
            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Login;
