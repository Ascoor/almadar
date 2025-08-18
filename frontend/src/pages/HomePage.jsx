// src/pages/HomePage.jsx
import React, { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Shield, Users, FileText, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import logoLight from '@/assets/images/logo-art-text.png';
import logoDark from '@/assets/images/logo-art-text.png';

/* Simple, accessible modal with backdrop + ESC/overlay close */
function Modal({ open, onClose, children, title = 'تسجيل الدخول' }) {
  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose?.();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', onKeyDown);
    // prevent body scroll while modal open
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, onKeyDown]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
          aria-label={title}
        >
          {/* Backdrop */}
          <motion.button
            type="button"
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden="true"
          />
          {/* Dialog */}
          <motion.div
            className="relative w-full max-w-md mx-4"
            initial={{ y: 24, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 10, scale: 0.98, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <div className="glass-card rounded-2xl shadow-xl border border-border/60">
              <div className="absolute top-3 end-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-accent/70"
                  onClick={onClose}
                  aria-label="إغلاق"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-md">
                    <Scale className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-card-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    ادخل بياناتك للوصول إلى لوحة التحكم
                  </p>
                </div>

                {/* Your existing loginForm form */}
                <LoginForm onSuccess={onClose} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function HomePage() {
  const [showLogin, setShowLogin] = useState(false);
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const features = [
    {
      icon: FileText,
      title: 'إدارة العقود',
      description: 'إدارة شاملة للعقود المحلية والدولية مع تتبع المراحل والمواعيد',
    },
    {
      icon: Scale,
      title: 'الاستشارات القانونية',
      description: 'تنظيم وإدارة الاستشارات القانونية مع قاعدة بيانات شاملة',
    },
    {
      icon: Shield,
      title: 'التحقيقات والقضايا',
      description: 'متابعة التحقيقات والقضايا القانونية بنظام متقدم ومنظم',
    },
    {
      icon: Users,
      title: 'إدارة المستخدمين',
      description: 'نظام إدارة المستخدمين مع الصلاحيات والأدوار المتنوعة',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero overflow-hidden">
<motion.section
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  className="relative min-h-screen flex items-center justify-center px-4"
>
  {/* Animated blobs for dynamic background */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
    />
    <motion.div
      animate={{ scale: [1.1, 1, 1.1], rotate: [0, -5, 0] }}
      transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
    />
  </div>

  <div className="relative z-10 max-w-6xl mx-auto">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Left Side: Welcome Text */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center lg:text-right space-y-8"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-5xl lg:text-7xl font-bold mb-6"
        >
             <div className="flex  p-6  mt-6 items-center">
               <img src={logoLight} alt="logo" className="h-36  dark:hidden" />
               <img src={logoDark} alt="logo" className="h-36 hidden dark:block" />
             </div> 
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-xl lg:text-2xl text-sidebar-primary mb-8 leading-relaxed"
        >
          منصة متكاملة للإدارة القانونية الذكية
          <br />
          لإدارة العقود والاستشارات والتحقيقات القانونية
        </motion.p>
      </motion.div>

      {/* Right Side: Preview Card */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="flex justify-center lg:justify-end"
      >
        <motion.div
          key="preview"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 rounded-2xl w-full max-w-md"
        >
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="w-20 h-20 bg-gradient-primary rounded-2xl mx-auto flex items-center justify-center"
            >
              <Scale className="w-10 h-10 text-primary-foreground" />
            </motion.div>

            <div>
              <h3 className="text-2xl font-bold text-card-foreground mb-2">ابدأ الآن</h3>
              <p className="text-muted-foreground">سجل دخولك للوصول إلى جميع الميزات</p>
            </div>

            <Button onClick={() => setShowLogin(true)} className="btn-hero w-full">
              تسجيل الدخول
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  </div>

  {/* Scroll Indicator */}
  <motion.div
    animate={{ y: [0, 10, 0] }}
    transition={{ duration: 2, repeat: Infinity }}
    className="absolute bottom-8 left-1/2 -translate-x-1/2"
  >
    <ChevronDown className="w-6 h-6 text-primary-foreground/60" />
  </motion.div>
</motion.section>
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
  {features.map((feature, i) => (
    <motion.div
      key={feature.title}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.08 }}
      className="professional-card p-6 text-center group"
    >
      <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:animate-bounce-in">
        <feature.icon className="w-8 h-8 text-primary-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-card-foreground mb-2">{feature.title}</h3>
      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
    </motion.div>
  ))}
</div>


      {/* Login Modal */}
      <Modal open={showLogin} onClose={() => setShowLogin(false)}>
        {/* LoginForm is rendered inside Modal above */}
      </Modal>
    </div>
  );
}

export default HomePage;
