import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import FormField from '@/components/form/FormField';
import ThemeToggle from '@/components/common/ThemeToggle';
import LanguageToggle from '@/components/common/LanguageToggle';

import { AuthContext } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

const Login = ({ onAuthStart, onAuthComplete, handleFormClose }) => {
  const { login } = useContext(AuthContext);
  const { lang } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isArabic = lang === 'ar';
  const dir = isArabic ? 'rtl' : 'ltr';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    onAuthStart?.();
    setIsSubmitting(true);

    try {
      const { success, message } = await login(email.trim(), password);

      if (success) {
        toast.success(isArabic ? '✅ تم تسجيل الدخول بنجاح' : '✅ Logged in successfully', {
          description: isArabic
            ? 'تم الدخول إلى النظام بنجاح.'
            : 'You have been signed in successfully.',
        });
        onAuthComplete?.(true);
      } else {
        const errorMsg =
          message === 'Bad credentials'
            ? isArabic
              ? 'تأكد من صحة البريد الإلكتروني وكلمة المرور.'
              : 'Please double-check your email and password.'
            : message;

        toast.error(isArabic ? '❌ فشل تسجيل الدخول' : '❌ Login failed', {
          description: errorMsg || (isArabic ? 'حدث خطأ في التحقق.' : 'Authentication failed.'),
        });
        onAuthComplete?.(false);
      }
    } catch (error) {
      toast.error(isArabic ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred', {
        description: error?.message || (isArabic ? 'يرجى المحاولة مرة أخرى.' : 'Please try again.'),
      });
      onAuthComplete?.(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    handleFormClose?.();
    setEmail('');
    setPassword('');
  };

  return (
    <motion.div
      dir={dir}
      aria-labelledby="login-title"
      className="w-full max-w-md mx-4 md:mx-auto"
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 40, opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <div
        className="
           rounded-2xl md:rounded-3xl
          shadow-glow border border-border/70
 
          p-6 md:p-8 space-y-6
          hover-scale
        "
      >
        {/* Top bar: language + theme */}
        <div className={`flex items-center justify-between gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
          <div className="text-xs text-muted-foreground truncate">
            {isArabic ? 'منصة ليبيا القانونية' : 'Libya Legal Dashboard'}
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>

        {/* Title + subtitle */}
        <div className="text-center space-y-2 mt-2">
          <h2
            id="login-title"
            className="
              page-title page-title-animate
              text-2xl md:text-3xl font-extrabold
            "
          >
            {isArabic ? 'تسجيل الدخول' : 'Sign In'}
          </h2>
          <p className="page-subtitle text-xs md:text-sm max-w-xs mx-auto leading-relaxed">
            {isArabic
              ? 'ادخل بياناتك للوصول إلى لوحة التحكم القانونية في ليبيا.'
              : 'Enter your credentials to access the Libya Legal Dashboard.'}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className={`space-y-4 md:space-y-5 ${isArabic ? 'text-right' : 'text-left'}`}
        >
          <FormField
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={{ ar: 'البريد الإلكتروني', en: 'Email' }}
            label={{ ar: 'البريد الإلكتروني', en: 'Email' }}
            autoComplete="email"
            required
          />

          <FormField
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={{ ar: 'كلمة المرور', en: 'Password' }}
            label={{ ar: 'كلمة المرور', en: 'Password' }}
            autoComplete="current-password"
            required
          />

          {/* Actions */}
          <div className="space-y-3 pt-1">
            <Button
              type="submit"
              disabled={isSubmitting || !email || !password}
              className={`
                w-full justify-center font-semibold
                rounded-lg py-2.5 md:py-3
                bg-gradient-primary text-primary-foreground
                shadow-md
                transition-all
                ${isSubmitting ? 'opacity-80 cursor-wait' : 'hover:scale-[1.02]'}
              `}
            >
              {isSubmitting
                ? isArabic
                  ? 'جاري التحقق...'
                  : 'Signing in...'
                : isArabic
                ? '🚀 دخول'
                : '🚀 Login'}
            </Button>

            <button
              type="button"
              onClick={handleCancel}
              className="
                w-full py-2.5 md:py-3
                font-medium
                rounded-lg
                bg-muted text-fg
                border border-border
                transition-all
                hover:bg-muted/80 hover:scale-[1.01]
              "
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>

            {/* Optional subtle hint under buttons */}
            <p className="text-[11px] md:text-xs text-muted-foreground text-center leading-snug mt-1">
              {isArabic
                ? 'بنقر زر دخول، فأنت تقرّ بسياسة الخصوصية وشروط الاستخدام.'
                : 'By signing in, you agree to our terms of use and privacy policy.'}
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default Login;
