import { useEffect, useMemo, useRef, useState, type ElementType } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeftRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Layers,
  Menu,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import Login from '@/components/organisms/Login';
import { WelcomeImage2 } from '@/assets/images';
import AuthSpinner from '@/components/common/Spinners/AuthSpinner';
import { useLanguage } from '@/context/LanguageContext';
import LanguageToggle from '@/components/common/LanguageToggle';
import ThemeToggle from '@/components/common/ThemeToggle';

interface FeatureItem {
  icon: keyof typeof ICON_MAP;
  title: string;
  description: string;
}

interface StatItem {
  label: string;
  value: string;
  description?: string;
}

interface StepItem {
  title: string;
  description: string;
}

interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
}

interface PlanItem {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  badge?: string;
}

const ICON_MAP = {
  Layers,
  Clock3,
  Sparkles,
  ShieldCheck,
  ArrowLeftRight,
  CheckCircle2,
};

const MotionDiv = motion.div;

const REVEAL_PROPS = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

const HomePage = () => {
  const { dir, t, lang, formatNumber } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sectionsRef = useRef<Record<string, HTMLElement | null>>({});
  const isRTL = dir === 'rtl';

  const navLinks = useMemo(
    () => [
      { id: 'hero', label: t('landing.nav.hero') },
      { id: 'features', label: t('landing.nav.features') },
      { id: 'how', label: t('landing.nav.how') },
      { id: 'screens', label: t('landing.nav.screens') },
      { id: 'testimonials', label: t('landing.nav.testimonials') },
      { id: 'pricing', label: t('landing.nav.pricing') },
      { id: 'faq', label: t('landing.nav.faq') },
      { id: 'contact', label: t('landing.nav.contact') },
    ],
    [t],
  );

  const stats: StatItem[] = useMemo(() => {
    const items = t('landing.stats.items') as unknown as StatItem[];
    return (items || []).map((item) => ({
      ...item,
      value: `${formatNumber(item.value, lang)}${item.suffix ?? ''}`,
    }));
  }, [formatNumber, lang, t]);

  const features = useMemo(
    () => (t('landing.features.items') as unknown as FeatureItem[]) || [],
    [t],
  );

  const steps: StepItem[] = useMemo(
    () => (t('landing.how.steps') as unknown as StepItem[]) || [],
    [t],
  );

  const testimonials: TestimonialItem[] = useMemo(
    () => (t('landing.testimonials.items') as unknown as TestimonialItem[]) || [],
    [t],
  );

  const plans: PlanItem[] = useMemo(
    () => (t('landing.pricing.plans') as unknown as PlanItem[]) || [],
    [t],
  );

  const faqItems = useMemo(
    () =>
      (t('landing.faq.items') as unknown as { question: string; answer: string }[]) || [],
    [t],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.45 },
    );

    navLinks.forEach((link) => {
      const element = document.getElementById(link.id);
      if (element) {
        sectionsRef.current[link.id] = element;
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [navLinks]);

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

  const handleNavClick = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileMenuOpen(false);
    }
  };

  const heroAnimation = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 36 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.65, ease: 'easeOut' },
      };

  const handleOpenLogin = () => {
    if (!isLoading) {
      setShowLoginForm(true);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-fg" dir={dir}>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={WelcomeImage2}
            alt={t('landing.hero.title')}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/90 via-bg/85 to-bg" aria-hidden />
          <div className="absolute inset-0 bg-gradient-subtle opacity-70 mix-blend-multiply" aria-hidden />
        </div>

        <header className="sticky top-0 z-30 border-b border-border/80 bg-card/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-muted/70 text-primary shadow-sm border border-border">
                <BarChart3 className="h-5 w-5" aria-hidden />
              </span>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="text-sm font-semibold text-foreground">{t('landing.brand')}</p>
                <p className="text-xs text-muted-foreground">{t('landing.hero.eyebrow')}</p>
              </div>
            </div>

            <nav className="hidden items-center gap-2 rounded-full border border-border bg-card/70 px-2 py-1 shadow-sm md:flex">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className={`rounded-full px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                    activeSection === link.id
                      ? 'bg-muted text-foreground shadow'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
              <button
                type="button"
                onClick={handleOpenLogin}
                className="hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md transition hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg md:inline-flex"
              >
                {t('landing.loginCta')}
              </button>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition hover:bg-muted md:hidden"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="border-t border-border bg-card/95 px-4 py-3 shadow-lg md:hidden">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => handleNavClick(link.id)}
                    className={`rounded-xl px-3 py-2 text-sm font-medium text-left transition ${
                      activeSection === link.id
                        ? 'bg-muted text-foreground shadow'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleOpenLogin}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md"
                >
                  {t('landing.loginCta')}
                </button>
              </div>
            </div>
          )}
        </header>

        <main className="relative z-10">
          <section id="hero" className="scroll-mt-24">
            <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:px-8">
              <MotionDiv className="space-y-6" {...heroAnimation}>
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-muted/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground border border-border">
                  {t('landing.hero.eyebrow')}
                </span>
                <h1 className="text-3xl font-heading leading-tight sm:text-4xl lg:text-5xl">
                  {t('landing.hero.title')}
                </h1>
                <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
                  {t('landing.hero.subtitle')}
                </p>

                <div className={`flex flex-col gap-3 sm:flex-row ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                  <motion.button
                    type="button"
                    onClick={handleOpenLogin}
                    disabled={isLoading}
                    aria-label={t('landing.hero.primaryCta')}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-glow transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-70"
                    whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.01 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                  >
                    {t('landing.hero.primaryCta')}
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => handleNavClick('features')}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card/80 px-6 py-3 text-base font-semibold text-foreground shadow-md transition hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  >
                    {t('landing.hero.secondaryCta')}
                    <ArrowLeftRight className="h-5 w-5 text-primary" aria-hidden />
                  </button>
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2 rounded-xl bg-card/80 px-3 py-2 shadow-sm border border-border">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    {t('landing.hero.supporting')}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-xl bg-card/80 px-3 py-2 shadow-sm border border-border">
                    <Sparkles className="h-4 w-4 text-primary" />
                    {t('landing.features.subtitle')}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm backdrop-blur-lg"
                    >
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
                      {stat.description && (
                        <p className="text-xs text-muted-foreground">{stat.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </MotionDiv>

              <MotionDiv
                className="relative overflow-hidden rounded-3xl border border-border bg-card/80 p-6 shadow-xl backdrop-blur-xl"
                {...heroAnimation}
                transition={{ duration: 0.7, ease: 'easeOut', delay: shouldReduceMotion ? 0 : 0.08 }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">{t('landing.social.label')}</p>
                      <p className="text-xs text-muted-foreground">{t('landing.hero.supporting')}</p>
                    </div>
                    <span className="rounded-full bg-muted/70 px-3 py-1 text-xs font-semibold text-muted-foreground border border-border">
                      {t('landing.hero.eyebrow')}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {(t('landing.social.items') as string[]).map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between rounded-2xl border border-border bg-gradient-subtle px-4 py-3 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <span className="grid h-10 w-10 place-items-center rounded-xl bg-card text-primary shadow">
                            <Sparkles className="h-5 w-5" aria-hidden />
                          </span>
                          <p className="text-sm font-semibold text-foreground">{item}</p>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden />
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-border bg-card/90 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{t('landing.hero.secondaryCta')}</p>
                        <p className="text-xs text-muted-foreground">{t('landing.hero.eyebrow')}</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleOpenLogin}
                        className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                      >
                        {t('landing.hero.primaryCta')}
                      </button>
                    </div>
                  </div>
                </div>
              </MotionDiv>
            </div>
          </section>

          <section id="features" className="scroll-mt-24 bg-card/40 py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <HeaderBlock
                title={t('landing.features.title')}
                subtitle={t('landing.features.subtitle')}
                eyebrow={t('landing.nav.features')}
                align={isRTL ? 'end' : 'start'}
              />
              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature) => {
                  const Icon = ICON_MAP[feature.icon] as ElementType;
                  return (
                    <MotionDiv
                      key={feature.title}
                      className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card/80 p-5 shadow-md"
                      {...REVEAL_PROPS}
                    >
                      <div className="flex items-center gap-3">
                        <span className="grid h-12 w-12 place-items-center rounded-xl bg-muted/70 text-primary shadow-sm">
                          <Icon className="h-5 w-5" aria-hidden />
                        </span>
                        <p className="text-base font-semibold text-foreground">{feature.title}</p>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                    </MotionDiv>
                  );
                })}
              </div>
            </div>
          </section>

          <section id="how" className="scroll-mt-24 py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <HeaderBlock
                title={t('landing.how.title')}
                subtitle={t('landing.how.subtitle')}
                eyebrow={t('landing.nav.how')}
                align="center"
              />
              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                {steps.map((step, index) => (
                  <MotionDiv
                    key={step.title}
                    className="h-full rounded-2xl border border-border bg-card/80 p-5 shadow-md"
                    {...REVEAL_PROPS}
                    transition={{ ...REVEAL_PROPS.transition, delay: shouldReduceMotion ? 0 : index * 0.05 }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/70 text-primary font-semibold">
                        {index + 1}
                      </span>
                      <p className="text-base font-semibold text-foreground">{step.title}</p>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                  </MotionDiv>
                ))}
              </div>
            </div>
          </section>

          <section id="screens" className="scroll-mt-24 bg-card/40 py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <HeaderBlock
                title={t('landing.screens.title')}
                subtitle={t('landing.screens.subtitle')}
                eyebrow={t('landing.nav.screens')}
                align={isRTL ? 'end' : 'start'}
              />
              <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
                {(t('landing.screens.highlights') as string[]).map((highlight, index) => (
                  <MotionDiv
                    key={highlight}
                    className="rounded-2xl border border-border bg-card/85 p-5 shadow-md"
                    {...REVEAL_PROPS}
                    transition={{ ...REVEAL_PROPS.transition, delay: shouldReduceMotion ? 0 : index * 0.05 }}
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-subtle text-primary shadow">
                        <Layers className="h-5 w-5" aria-hidden />
                      </span>
                      <p className="text-sm font-semibold text-foreground">{t('landing.hero.eyebrow')}</p>
                    </div>
                    <div className="space-y-3">
                      <div className="h-32 rounded-xl bg-muted/70 shadow-inner" />
                      <p className="text-sm text-muted-foreground">{highlight}</p>
                    </div>
                  </MotionDiv>
                ))}
              </div>
            </div>
          </section>

          <section id="testimonials" className="scroll-mt-24 py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <HeaderBlock
                title={t('landing.testimonials.title')}
                subtitle={t('landing.testimonials.subtitle')}
                eyebrow={t('landing.nav.testimonials')}
                align="center"
              />
              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                {testimonials.map((item, index) => (
                  <MotionDiv
                    key={item.name}
                    className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card/80 p-5 shadow-md"
                    {...REVEAL_PROPS}
                    transition={{ ...REVEAL_PROPS.transition, delay: shouldReduceMotion ? 0 : index * 0.05 }}
                  >
                    <Sparkles className="h-5 w-5 text-primary" aria-hidden />
                    <p className="flex-1 text-sm leading-relaxed text-foreground">{item.quote}</p>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.role}</p>
                    </div>
                  </MotionDiv>
                ))}
              </div>
            </div>
          </section>

          <section id="pricing" className="scroll-mt-24 bg-card/40 py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <HeaderBlock
                title={t('landing.pricing.title')}
                subtitle={t('landing.pricing.subtitle')}
                eyebrow={t('landing.nav.pricing')}
                align="center"
              />
              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                {plans.map((plan) => (
                  <MotionDiv
                    key={plan.name}
                    className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-card/85 p-6 shadow-md"
                    {...REVEAL_PROPS}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-lg font-semibold text-foreground">{plan.name}</p>
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                      </div>
                      {plan.badge && (
                        <span className="rounded-full bg-muted/80 px-3 py-1 text-xs font-semibold text-muted-foreground border border-border">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-foreground">{plan.price}</p>
                      <p className="text-sm text-muted-foreground">{plan.period}</p>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-foreground">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" aria-hidden />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={handleOpenLogin}
                      className="mt-auto rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                    >
                      {t('landing.loginCta')}
                    </button>
                  </MotionDiv>
                ))}
              </div>
              <p className="mt-4 text-center text-sm text-muted-foreground">{t('landing.pricing.note')}</p>
            </div>
          </section>

          <section id="faq" className="scroll-mt-24 py-16">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <HeaderBlock
                title={t('landing.faq.title')}
                subtitle={t('landing.faq.subtitle')}
                eyebrow={t('landing.nav.faq')}
                align="center"
              />
              <div className="mt-8 space-y-3">
                {faqItems.map((item, index) => (
                  <AccordionItem key={item.question} question={item.question} answer={item.answer} delay={index * 0.04} />
                ))}
              </div>
            </div>
          </section>

          <section id="contact" className="scroll-mt-24 bg-card/40 py-16">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="rounded-3xl border border-border bg-card/90 p-8 shadow-lg lg:p-12">
                <HeaderBlock
                  title={t('landing.contact.title')}
                  subtitle={t('landing.contact.subtitle')}
                  eyebrow={t('landing.nav.contact')}
                  align="center"
                />
                <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <button
                    type="button"
                    onClick={handleOpenLogin}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  >
                    {t('landing.contact.primary')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavClick('hero')}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card/80 px-6 py-3 text-base font-semibold text-foreground shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  >
                    {t('landing.contact.secondary')}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
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

const HeaderBlock = ({
  title,
  subtitle,
  eyebrow,
  align = 'center',
}: {
  title: string;
  subtitle: string;
  eyebrow: string;
  align?: 'start' | 'center' | 'end';
}) => (
  <div className={`space-y-2 ${align === 'center' ? 'text-center' : align === 'end' ? 'text-right' : 'text-left'}`}>
    <p className="text-xs font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>
    <h2 className="text-2xl font-heading text-foreground sm:text-3xl">{title}</h2>
    <p className="text-sm text-muted-foreground sm:text-base">{subtitle}</p>
  </div>
);

const AccordionItem = ({
  question,
  answer,
  delay,
}: {
  question: string;
  answer: string;
  delay: number;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <MotionDiv
      className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm"
      {...REVEAL_PROPS}
      transition={{ ...REVEAL_PROPS.transition, delay }}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="text-sm font-semibold text-foreground">{question}</span>
        <span className="text-primary">{open ? '−' : '+'}</span>
      </button>
      {open && <p className="mt-2 text-sm text-muted-foreground">{answer}</p>}
    </MotionDiv>
  );
};

export default HomePage;
