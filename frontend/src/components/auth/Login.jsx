import React, { useState, useContext } from 'react';
import { Mail, LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthContext } from '@/components/auth/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Input } from '../../components/ui/input';

const Login = ({ onAuthStart, onAuthComplete, handleFormClose }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    onAuthStart();

    try {
      const { success, message, requirePasswordChange } = await login(email, password);

      if (success) {
        toast.success('✅ تم تسجيل الدخول بنجاح', { description: 'تم الدخول إلى النظام بنجاح.' });

        if (requirePasswordChange) {
          setShowPasswordChangeModal(true);
        } else {
          onAuthComplete(true);
        }
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
      <div className="p-10">
        <h2 className="text-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-lime-300 to-emerald-500 drop-shadow-xl mb-8">
          تسجيل الدخول
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Mail className="absolute top-3 left-4 text-emerald-600" />
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              required
              className="w-full py-3 pl-12 pr-4 rounded-lg bg-white/80 text-black placeholder-gray-700 border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>

          <div className="relative">
            <LockKeyhole className="absolute top-3 left-4 text-emerald-600" />
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              required
              className="w-full py-3 pl-12 pr-4 rounded-lg bg-white/80 text-black placeholder-gray-700 border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>

          <Button
            type="submit"
            className="w-full py-3 font-bold text-white bg-gradient-to-l from-emerald-600 via-green-600 to-emerald-700 rounded-lg shadow-md hover:scale-105 transition-all"
          >
            🚀 دخول
          </Button>

          <button
            type="button"
            onClick={handleCancel}
            className="w-full py-3 font-semibold text-white bg-gray-600/80 border border-gray-500 rounded-lg hover:bg-gray-500 transition-all hover:scale-105"
          >
            إلغاء
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Login;
