// src/components/auth/Login.jsx
import React, { useState, useContext, useRef, useEffect } from 'react';
import { Mail, LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthContext } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

const Login = ({ onAuthStart, onAuthComplete, handleFormClose }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const emailRef = useRef(null);

  // تركيز تلقائي على الإيميل
  useEffect(() => {
    emailRef.current?.focus?.();
  }, []);

  const safeCall = (fn, ...args) => {
    try { typeof fn === 'function' && fn(...args); } catch {}
  };

  const normalizeErrors = (err) => {
    const data = err?.response?.data;
    if (data?.errors && typeof data.errors === 'object') {
      return Object.values(data.errors).flat().join('\n');
    }
    return data?.message || err?.message || 'حدث خطأ غير متوقع';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    safeCall(onAuthStart);

    try {
      const { success, message, requirePasswordChange } = await login(
        String(email).trim(),
        password
      );

      if (success) {
        toast.success('✅ تم تسجيل الدخول بنجاح', {
          description: 'تم الدخول إلى النظام بنجاح.',
        });

        // لو عندك منطق تغيير كلمة مرور أول دخول، ضعه هنا
        if (requirePasswordChange) {
          // مثال: فتح مودال تغيير كلمة المرور
          // openChangePasswordModal();
        } else {
          safeCall(onAuthComplete, true);
        }
      } else {
        const errorMsg =
          message === 'Bad credentials'
            ? 'تأكد من صحة البريد الإلكتروني وكلمة المرور.'
            : message || 'تعذر تسجيل الدخول';
        toast.error('❌ فشل تسجيل الدخول', { description: errorMsg });
        safeCall(onAuthComplete, false);
      }
    } catch (error) {
      toast.error('❌ فشل تسجيل الدخول', { description: normalizeErrors(error) });
      safeCall(onAuthComplete, false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    safeCall(handleFormClose);
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
      dir="rtl"
      aria-label="نموذج تسجيل الدخول"
    >
      <div className="p-10">
        <h2 className="text-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-lime-300 to-emerald-500 drop-shadow-xl mb-8">
          تسجيل الدخول
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute top-3 right-4 text-emerald-600" aria-hidden="true" />
            <Input
              ref={emailRef}
              type="email"
              inputMode="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              required
              aria-label="البريد الإلكتروني"
              className="w-full py-3 pr-12 pl-4 rounded-lg bg-white/80 text-black placeholder-gray-700 border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <LockKeyhole className="absolute top-3 right-4 text-emerald-600" aria-hidden="true" />
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              required
              aria-label="كلمة المرور"
              className="w-full py-3 pr-12 pl-4 rounded-lg bg-white/80 text-black placeholder-gray-700 border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>

          {/* Actions */}
          <Button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 font-bold text-white bg-gradient-to-l from-emerald-600 via-green-600 to-emerald-700 rounded-lg shadow-md transition-all ${
              submitting ? 'opacity-80 cursor-not-allowed' : 'hover:scale-105'
            }`}
          >
            {submitting ? 'جاري الدخول...' : '🚀 دخول'}
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
