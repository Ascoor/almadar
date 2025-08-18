import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Shield, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import logoLight from '@/assets/images/logo-art-text.png';
import logoDark from '@/assets/images/logo-art-text.png';

// Simple modal used for login
function LoginModal({ open, onClose }) {
  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose?.();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', onKeyDown);
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
            initial={{ y: 24, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, scale: 0.96, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <div className="glass-card rounded-2xl shadow-xl border border-border/60 p-8">
              <button
                type="button"
                onClick={onClose}
                className="absolute top-3 end-3 rounded-full hover:bg-accent/70 p-1"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-2xl font-bold mb-6 text-center">تسجيل الدخول</h3>
              <LoginForm onSuccess={onClose} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const features = [
    {
      icon: Scale,
      title: 'إدارة العقود',
      description: 'إدارة شاملة للعقود المحلية والدولية مع تتبع المراحل والمواعيد',
    },
    {
      icon: Shield,
      title: 'التحقيقات والقضايا',
      description: 'متابعة التحقيقات والقضايا القانونية بنظام متقدم ومنظم',
    },
    {
      icon: Users,
      title: 'إدارة المستخدمين',
      description: 'صلاحيات مرنة وإدارة دقيقة للمستخدمين والفرق',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-card-foreground relative overflow-hidden">
      {/* Animated background blobs */}
      <motion.div
        className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
        animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
        animate={{ rotate: [360, 0], scale: [1.2, 1, 1.2] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-32 space-y-8">
        <div className="flex items-center justify-center">
          <img src={logoLight} alt="logo" className="h-32 dark:hidden" />
          <img src={logoDark} alt="logo" className="h-32 hidden dark:block" />
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl lg:text-6xl font-bold"
        >
          منصة المدار للإدارة القانونية الذكية
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-xl lg:text-2xl text-muted-foreground max-w-2xl"
        >
          حل متكامل لإدارة العقود والقضايا والاستشارات مع واجهة عربية حديثة
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Button onClick={() => setShowLogin(true)} className="btn-hero px-8">
            ابدأ الآن
          </Button>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-20 bg-card/50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="professional-card p-6 text-center"
            >
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Login Modal */}
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
}
