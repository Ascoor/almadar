 
import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Mail, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ThemeToggle from '@/components/common/ThemeToggle';
import LanguageToggle from '@/components/common/LanguageToggle';
import { useLanguage } from '@/context/LanguageContext';

 interface LoginModalProps {
   isOpen: boolean;
   onClose: () => void;
   isLoading: boolean;
   onSubmit: (email: string, password: string) => void;
 }
  
const LoginModal = ({
  isOpen,
  onClose,
  isLoading,
  onSubmit,
}: LoginModalProps) => {
  const { t, isRTL } = useLanguage();
  const shouldReduceMotion = useReducedMotion(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.95,
      y: shouldReduceMotion ? 0 : 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0, 
      transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
    },
    exit: {
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.95,
      y: shouldReduceMotion ? 0 : 20,
      transition: { duration: 0.2 },
    },
  };

  const dir = isRTL ? 'rtl' : 'ltr';

  return (
    <AnimatePresence>
      {isOpen && ( 
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            className="absolute inset-0 bg-bg/75 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />
  
          <motion.div 
            dir={dir}
            className="
              relative w-full max-w-md
              rounded-2xl md:rounded-3xl
              shadow-glow border border-border/70
              bg-card/55 backdrop-blur-xl
              p-6 md:p-8
              hover-scale
            "
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit" 
          > 
            <button
              onClick={onClose}

              className={[
                'absolute top-4 p-2 rounded-lg transition-colors',
                'hover:bg-muted/60 focus-ring',
                isRTL ? 'left-4' : 'right-4',
              ].join(' ')}
              aria-label={t('login.close') ?? 'Close'}
            > 
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
 <div
              className={[
                'flex items-center justify-between gap-3',
                isRTL ? 'flex-row-reverse' : '',
              ].join(' ')}
            >
              <div className="text-xs text-muted-foreground truncate">
                {t('login.brand')}
              </div>
              <div className="flex items-center gap-2">
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </div>

            {/* Form */} 
            <div className="text-center space-y-2 mt-4">
              <h2
                className="page-title page-title-animate text-2xl md:text-3xl font-extrabold"
              >
                {t('login.title')}
              </h2>
              <p className="page-subtitle text-xs md:text-sm max-w-xs mx-auto leading-relaxed">
                {t('login.subtitle')}
              </p>
            </div>
 
            <form
              onSubmit={handleSubmit}
              className={[
                'space-y-4 md:space-y-5 mt-6',
                isRTL ? 'text-right' : 'text-left',
              ].join(' ')}
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  {t('login.email')}
                </Label>
                <div className="relative">
                  <Mail
                    className={[
                      'absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground',
                      isRTL ? 'right-3' : 'left-3',
                    ].join(' ')}
                  />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={[
                      'bg-card/50 border-border/50',
                      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
                      isRTL ? 'pr-10' : 'pl-10',
                    ].join(' ')}
                    placeholder={t('login.emailPlaceholder')}
                    autoComplete="email"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
 
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  {t('login.password')}
                </Label>
                <div className="relative">
                  <Lock
                    className={[
                      'absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground',
                      isRTL ? 'right-3' : 'left-3',
                    ].join(' ')}
                  />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={[
                      'bg-card/50 border-border/50',
                      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
                      isRTL ? 'pr-10' : 'pl-10',
                    ].join(' ')}
                    placeholder={t('login.passwordPlaceholder')}
                    autoComplete="current-password"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end">
                <a
                  href="#" 
                  className="text-sm text-primary hover:underline focus-ring rounded"
                > 
                  {t('login.forgot')}
                </a>
              </div>


              <div className="space-y-3 pt-1">
                <Button
                  type="submit"
                  disabled={isLoading || !email || !password}
                  className={[
                    'w-full justify-center font-semibold',
                    'rounded-lg py-2.5 md:py-3',
                    'bg-gradient-primary text-primary-foreground shadow-md transition-all',
                    isLoading ? 'opacity-80 cursor-wait' : 'hover:scale-[1.02]',
                  ].join(' ')}
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>{t('login.loading')}</span>
                    </span>
                  ) : (
                    <span>🚀 {t('login.submit')}</span>
                  )}
                </Button>

                <button
                  type="button"
                  onClick={onClose}
                  className="
                    w-full py-2.5 md:py-3
                    font-medium
                    rounded-lg
                    bg-muted text-fg
                    border border-border
                    transition-all
                    hover:bg-muted/80 hover:scale-[1.01]
                    focus-ring
                  "
                >
                  {t('login.cancel')}
                </button>

                <p className="text-[11px] md:text-xs text-muted-foreground text-center leading-snug mt-1">
                  {t('login.hint')}
                </p>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">

                {t('login.noAccount')}{' '}
                <a href="#" className="text-primary hover:underline focus-ring rounded">
                  {t('login.register')}
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;