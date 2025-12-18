import { useEffect, useMemo, useState } from 'react';
import type { ElementType } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeftRight,
  CheckCircle2,
  Clock3,
  Layers,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import Login from '@/components/organisms/Login';
import { WelcomeImage2, WelcomeLogoWhite } from '@/assets/images';
import AuthSpinner from '@/components/common/Spinners/AuthSpinner';
import { useLanguage } from '@/context/LanguageContext';

const MotionDiv = motion.div;

interface FeatureItem {
  icon: ElementType;
  title: string;
  description: string;
}

interface StatItem {
  label: string;
  value: string;
}

interface StepItem {
  title: string;
  description: string;
}

const HomePage = () => {
  const { dir, t, lang, formatNumber } = useLanguage();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const isRTL = dir === 'rtl';

  const features: FeatureItem[] = useMemo(
    () => [
      {
        icon: Layers,
        title: t('landing.features.matterHub.title'),
        description: t('landing.features.matterHub.description'),
      },
      {
        icon: Sparkles,
        title: t('landing.features.automation.title'),
        description: t('landing.features.automation.description'),
      },
      {
        icon: ArrowLeftRight,
        title: t('landing.features.insights.title'),
        description: t('landing.features.insights.description'),
      },
      {
        icon: ShieldCheck,
        title: t('landing.features.collaboration.title'),
        description: t('landing.features.collaboration.description'),
      },
    ],
    [t],
  );

  const stats: StatItem[] = useMemo(
    () => [
      { label: t('landing.stats.activeCases'), value: formatNumber(1248, lang) },
      { label: t('landing.stats.contracts'), value: formatNumber(312, lang) },
      { label: t('landing.stats.response'), value: lang === 'ar' ? '٢ س' : '2h' },
    ],
    [formatNumber, lang, t],
  );

  const steps: StepItem[] = useMemo(
    () => [
      {
        title: t('landing.steps.connect.title'),
        description: t('landing.steps.connect.description'),
      },
      {
        title: t('landing.steps.organize.title'),
        description: t('landing.steps.organize.description'),
      },
      {
        title: t('landing.steps.monitor.title'),
        description: t('landing.steps.monitor.description'),
      },
    ],
    [t],
  );

  useEffect(() => {
    if (!showLoginForm) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isLoading) {
        setShowLoginForm(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLoginForm, isLoading]);

  const heroAnimation = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 32 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.7, ease: 'easeOut' },
      };

  const cardTransition = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.25 },
        transition: { duration: 0.55, ease: 'easeOut' },
      };

  const handleOpenLogin = () => {
    if (!isLoading) {
      setShowLoginForm(true);
    }
  };

  return (
    <div className="relative min-h-screen bg-bg text-fg" dir={dir}>
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={WelcomeImage2}
          alt={t('landing.media.alt')}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/90 via-bg/75 to-bg/90" aria-hidden />
        <div className="absolute inset-0 bg-gradient-subtle opacity-70 mix-blend-multiply" aria-hidden />
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 20%, color-mix(in oklab, var(--border) 45%, transparent) 0, transparent 32%), radial-gradient(circle at 75% 25%, color-mix(in oklab, var(--ring) 35%, transparent) 0, transparent 36%)',
          }}
          aria-hidden
        />
      </div>

      <div className="relative z-10 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row">
          <MotionDiv
            className="flex-1 space-y-8 rounded-3xl bg-card/70 p-8 shadow-lg backdrop-blur-xl border border-border"
            {...heroAnimation}
          >
            <div className={`flex items-center gap-3 ${isRTL ? 'justify-end' : 'justify-start'}`}>
              <span className="inline-flex items-center rounded-full bg-muted/60 px-4 py-1 text-sm font-medium text-muted-foreground border border-border">
                {t('landing.badge')}
              </span>
              <span className="hidden text-sm text-muted-foreground sm:inline-flex">
                {t('landing.secureNote')}
              </span>
            </div>

            <div className={`space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
                <Sparkles className="h-4 w-4" aria-hidden />
                {t('landing.highlights.bilingual')}
              </p>
              <h1 className="text-3xl font-heading leading-tight text-foreground sm:text-4xl lg:text-5xl">
                {t('landing.title')}
              </h1>
              <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
                {t('landing.description')}
              </p>
            </div>

            <div
              className={`flex flex-col gap-4 sm:flex-row ${
                isRTL ? 'sm:flex-row-reverse sm:justify-end' : 'sm:justify-start'
              }`}
            >
              <motion.button
                type="button"
                onClick={handleOpenLogin}
                disabled={isLoading}
                aria-label={t('landing.primaryCta')}
                className="group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-glow transition-[transform,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-70"
                whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.01 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              >
                <span className={isLoading ? 'opacity-0' : 'opacity-100'}>{t('landing.primaryCta')}</span>
                {!isLoading && <CheckCircle2 className="h-5 w-5" aria-hidden />}
                {isLoading && (
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/70 border-t-transparent" />
                  </span>
                )}
              </motion.button>

              <button
                type="button"
                onClick={handleOpenLogin}
                disabled={isLoading}
                aria-label={t('landing.secondaryCta')}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card/70 px-6 py-3 text-base font-semibold text-foreground shadow-md backdrop-blur-lg transition hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-70"
              >
                {t('landing.secondaryCta')}
                <ArrowLeftRight className="h-5 w-5 text-primary" aria-hidden />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-border bg-card/60 p-4 shadow-sm backdrop-blur-lg"
                >
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2`}>
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <MotionDiv
                    key={feature.title}
                    className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-card/70 p-4 shadow-md backdrop-blur-xl"
                    {...cardTransition}
                    transition={{ ...cardTransition.transition, delay: shouldReduceMotion ? 0 : index * 0.08 }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/70 text-primary shadow-sm">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <p className="text-sm font-semibold text-foreground">{feature.title}</p>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                  </MotionDiv>
                );
              })}
            </div>
          </MotionDiv>

          <MotionDiv
            className="flex w-full max-w-xl flex-col justify-between gap-6 rounded-3xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur-xl lg:w-96"
            {...heroAnimation}
            transition={{ duration: 0.75, ease: 'easeOut', delay: shouldReduceMotion ? 0 : 0.1 }}
          >
            <div className={`${isRTL ? 'text-right' : 'text-left'} space-y-4`}>
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <img
                  src={WelcomeLogoWhite}
                  alt={t('landing.media.logoAlt')}
                  className="h-12 w-auto drop-shadow"
                  loading="lazy"
                />
                <span className="rounded-full bg-muted/60 px-3 py-1 text-xs font-semibold text-muted-foreground border border-border">
                  {t('landing.panel.meta.uptime')}
                </span>
              </div>
              <h2 className="text-xl font-heading text-foreground sm:text-2xl">{t('landing.panel.title')}</h2>
              <p className="text-sm text-muted-foreground">{t('landing.panel.description')}</p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary" aria-hidden />
                  <span className="text-sm font-medium text-foreground">
                    {t('landing.highlights.access')}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock3 className="h-5 w-5 text-primary" aria-hidden />
                  <span className="text-sm font-medium text-foreground">
                    {t('landing.highlights.updates')}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden />
                  <span className="text-sm font-medium text-foreground">
                    {t('landing.panel.meta.support')}
                  </span>
                </div>
              </div>
            </div>

            <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center justify-between rounded-2xl border border-border bg-gradient-subtle px-4 py-3 shadow-sm`}>
              <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                <p className="text-sm font-semibold text-foreground">{t('landing.panel.meta.uptimeValue')}</p>
                <p className="text-xs text-muted-foreground">{t('landing.secureNote')}</p>
              </div>
              <button
                type="button"
                onClick={handleOpenLogin}
                disabled={isLoading}
                aria-label={t('landing.panel.cta')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md transition hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-70"
              >
                {t('landing.panel.cta')}
              </button>
            </div>
          </MotionDiv>
        </div>

        <MotionDiv
          className="mx-auto mt-10 max-w-6xl rounded-3xl border border-border bg-card/70 p-6 shadow-lg backdrop-blur-xl"
          {...cardTransition}
        >
          <div className={`mb-6 flex items-center justify-between ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">{t('landing.steps.title')}</p>
              <h3 className="text-2xl font-heading text-foreground">{t('landing.panel.title')}</h3>
              <p className="text-sm text-muted-foreground max-w-3xl">{t('landing.description')}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <MotionDiv
                key={step.title}
                className="h-full rounded-2xl border border-border bg-card/60 p-4 shadow-md backdrop-blur-lg"
                {...cardTransition}
                transition={{ ...cardTransition.transition, delay: shouldReduceMotion ? 0 : index * 0.06 }}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted/70 text-primary font-semibold">
                    {index + 1}
                  </span>
                  <p className="text-base font-semibold text-foreground">{step.title}</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </MotionDiv>
            ))}
          </div>
        </MotionDiv>
      </div>

      {isLoading && <AuthSpinner />}

      <AnimatePresence>
        {showLoginForm && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-bg/85 px-4 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Login
              onAuthStart={() => setIsLoading(true)}
              handleFormClose={() => setShowLoginForm(false)}
              onAuthComplete={(success) => {
                setIsLoading(false);
                if (success) setShowLoginForm(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
