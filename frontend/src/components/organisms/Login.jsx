import React, { useContext, useEffect, useMemo, useState } from 'react';
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
  const { lang, t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isArabic = lang === 'ar';
  const dir = isArabic ? 'rtl' : 'ltr';

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const labels = useMemo(
    () => ({
      title: t('login.title') || (isArabic ? 'تسجيل الدخول' : 'Sign In'),
      subtitle: t('login.subtitle'),
      brand: t('login.brand'),
      email: t('login.email'),
      password: t('login.password'),
      remember: t('login.remember'),
      show: t('login.show'),
      hide: t('login.hide'),
      submit: t('login.submit'),
      submitting: t('login.submitting'),
      cancel: t('login.cancel'),
      terms: t('login.terms'),
    }),
    [isArabic, t]
  );

  const validate = () => {
    const nextErrors = { email: '', password: '' };
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      nextErrors.email = isArabic ? 'البريد الإلكتروني مطلوب' : 'Email is required';
    } else if (!emailPattern.test(email.trim())) {
      nextErrors.email = isArabic ? 'صيغة البريد غير صحيحة' : 'Invalid email format';
    }

    if (!password) {
      nextErrors.password = isArabic ? 'كلمة المرور مطلوبة' : 'Password is required';
    }

    setErrors(nextErrors);
    return !nextErrors.email && !nextErrors.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setFormError('');

    if (!validate()) {
      onAuthComplete?.(false);
      return;
    }

    onAuthStart?.();
    setIsSubmitting(true);

    try {
      const { success, message } = await login(email.trim(), password);

      if (success) {
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email.trim());
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        toast.success(t('login.successTitle'), {
          description: t('login.successDescription'),
        });
        onAuthComplete?.(true);
      } else {
        const errorMsg =
          message === 'Bad credentials'
            ? t('login.errorDescription')
            : message;

        setFormError(errorMsg || t('login.errorFallback'));
        toast.error(t('login.errorTitle'), {
          description: errorMsg || t('login.errorFallback'),
        });
        onAuthComplete?.(false);
      }
    } catch (error) {
      setFormError(error?.message || t('login.unexpectedDescription'));
      toast.error(t('login.unexpected'), {
        description: error?.message || t('login.unexpectedDescription'),
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
          shadow-lg border border-border/70
          p-6 md:p-8 space-y-6
          bg-green-400/40 dark:bg-green-900/40
        "
      >
        {/* Top bar: language + theme */}
        <div
          className={`flex items-center justify-between gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}
        >
          <div className="text-xs text-muted-foreground truncate">
            {labels.brand}
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
            className="text-2xl md:text-3xl font-extrabold"
          >
            {labels.title}
          </h2>
          <p className="text-xs md:text-sm max-w-xs mx-auto leading-relaxed">
            {labels.subtitle}
          </p>
        </div>

        {formError && (
          <div className="rounded-lg border border-red-500 bg-red-100 p-3 text-sm text-red-800">
            {formError}
          </div>
        )}

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
            placeholder={{ ar: labels.email, en: labels.email }}
            label={{ ar: labels.email, en: labels.email }}
            autoComplete="email"
            required
            error={errors.email}
          />

          <div className="space-y-2">
            <FormField
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={{ ar: labels.password, en: labels.password }}
              label={{ ar: labels.password, en: labels.password }}
              autoComplete="current-password"
              required
              error={errors.password}
            />
            <div className={`flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  className="rounded border-border bg-card text-primary focus:ring-ring"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                {labels.remember}
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-xs font-semibold text-primary hover:underline"
              >
                {showPassword ? labels.hide : labels.show}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-1">
            <Button
              type="submit"
              disabled={isSubmitting || !email || !password}
              className="
                w-full justify-center font-semibold
                rounded-lg py-2.5 md:py-3
                bg-gradient-to-r from-primary to-secondary text-primary-foreground
                shadow-md
                transition-all
                hover:scale-[1.02] focus:outline-none
                disabled:opacity-80 disabled:cursor-not-allowed
              "
            >
              {isSubmitting ? labels.submitting : labels.submit}
            </Button>

            <button
              type="button"
              onClick={handleCancel}
              className="w-full py-2.5 md:py-3 font-medium rounded-lg bg-muted text-fg border border-border transition-all hover:bg-muted/80 hover:scale-[1.01]"
            >
              {labels.cancel}
            </button>

            {/* Optional subtle hint under buttons */}
            <p className="text-[11px] md:text-xs text-muted-foreground text-center leading-snug mt-1">
              {labels.terms}
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default Login;
