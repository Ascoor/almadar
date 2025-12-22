import { useEffect, useMemo, useRef, useState, type ElementType } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeftRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Layers,
  Menu,
  Moon,
  ShieldCheck,
  Sparkles,
  SunMedium,
  X,
} from 'lucide-react';
import Login from '@/components/organisms/Login';
import { LogoTextArtGreen, LogoTextArtWhite, WelcomeImage2 } from '@/assets/images';
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

interface LayoutPreviewItem {
  id: string;
  tone: 'day' | 'night';
  title: string;
  subtitle: string;
  badge: string;
  gradient: string;
}

interface ThemeCardItem {
  tone: 'day' | 'night';
  title: string;
  description: string;
  badge: string;
  note: string;
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

const FLOATING_KEYWORD_POSITIONS = [
  { x: '12%', y: '18%' },
  { x: '68%', y: '12%' },
  { x: '22%', y: '62%' },
  { x: '70%', y: '58%' },
  { x: '38%', y: '32%' },
  { x: '52%', y: '72%' },
];

const THEME_GRADIENTS: Record<'day' | 'night', string> = {
  day: 'linear-gradient(135deg, hsla(170, 65%, 92%, 0.95), hsla(214, 70%, 97%, 0.9), hsla(166, 55%, 88%, 0.92))',
  night: 'linear-gradient(140deg, hsla(218, 32%, 14%, 0.95), hsla(214, 45%, 18%, 0.92), hsla(172, 38%, 20%, 0.88))',
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
      { id: 'themes', label: t('landing.nav.themes') },
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

  const sampleLayouts: LayoutPreviewItem[] = useMemo(
    () => [
      {
        id: 'daybreak',
        tone: 'day',
        title: t('landing.hero.title'),
        subtitle: t('landing.features.subtitle'),
        badge: t('landing.nav.hero'),
        gradient:
          'linear-gradient(135deg, hsla(166, 60%, 86%, 0.65), hsla(214, 65%, 92%, 0.55), hsla(168, 50%, 84%, 0.65))',
      },
      {
        id: 'dusk-shield',
        tone: 'night',
        title: t('landing.nav.features'),
        subtitle: t('landing.hero.supporting'),
        badge: t('landing.nav.features'),
        gradient:
          'linear-gradient(140deg, hsla(218, 28%, 12%, 0.9), hsla(218, 32%, 16%, 0.85), hsla(172, 30%, 20%, 0.8))',
      },
      {
        id: 'oasis',
        tone: 'day',
        title: t('landing.pricing.title'),
        subtitle: t('landing.pricing.subtitle'),
        badge: t('landing.nav.pricing'),
        gradient:
          'linear-gradient(145deg, hsla(155, 60%, 82%, 0.52), hsla(214, 58%, 86%, 0.42), hsla(218, 42%, 80%, 0.45))',
      },
    ],
    [t],
  );

  const themeCards: ThemeCardItem[] = useMemo(
    () => (t('landing.themes.cards') as unknown as ThemeCardItem[]) || [],
    [t],
  );

  const floatingKeywords = useMemo(
    () => (t('landing.hero.keywords') as unknown as string[]) || [],
    [t],
  );

  const heroHighlights = useMemo(
    () => (t('landing.hero.highlights') as unknown as string[]) || [],
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
    <div
      className="min-h-screen bg-gradient-to-b from-bg via-muted/30 to-bg text-fg"
      style={{
        backgroundImage:
          'radial-gradient(circle at 20% 20%, rgba(82, 143, 255, 0.08), transparent 32%), radial-gradient(circle at 80% 12%, rgba(16, 185, 129, 0.08), transparent 30%), radial-gradient(circle at 10% 80%, rgba(94, 234, 212, 0.08), transparent 26%)',
      }}
      dir={dir}
    >
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
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -left-12 top-20 h-80 w-80 rounded-full bg-primary/15 blur-3xl" aria-hidden />
            <div className="absolute bottom-10 right-4 h-72 w-72 rounded-full bg-accent/20 blur-3xl" aria-hidden />
          </div>
          <AnimatedBackdrop />
        </div>

        <header className="sticky top-0 z-30 border-b border-border/80 bg-card/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 p-2 shadow-lg shadow-primary/10 ring-1 ring-primary/10 dark:bg-secondary/40 dark:shadow-primary/20 dark:ring-primary/30">
                <img
                  src={LogoTextArtGreen}
                  alt={t('landing.brand')}
                  className="h-full w-full object-contain dark:hidden"
                  loading="lazy"
                />
                <img
                  src={LogoTextArtWhite}
                  alt={t('landing.brand')}
                  className="hidden h-full w-full object-contain dark:block"
                  loading="lazy"
                />
              </div>
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
            <div className="mx-auto grid max-w-6xl items-center gap-10 rounded-[32px] border border-border/70 bg-card/50 px-4 pb-16 pt-14 shadow-2xl shadow-primary/5 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:px-8">
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

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {heroHighlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="flex items-center gap-3 rounded-2xl border border-border bg-card/80 p-4 shadow-sm backdrop-blur-lg"
                    >
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 via-accent/30 to-primary/10 shadow-inner" />
                      <p className="text-sm font-semibold text-foreground">{highlight}</p>
                    </div>
                  ))}
                </div>
              </MotionDiv>

              <MotionDiv
                className="relative overflow-hidden rounded-3xl border border-border bg-card/80 p-6 shadow-xl backdrop-blur-xl"
                {...heroAnimation}
                transition={{ duration: 0.7, ease: 'easeOut', delay: shouldReduceMotion ? 0 : 0.08 }}
              >
                <div className="absolute inset-0 opacity-60">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/15" aria-hidden />
                  <motion.div
                    className="absolute -left-10 top-6 h-32 w-32 rounded-full bg-primary/25 blur-3xl"
                    animate={shouldReduceMotion ? undefined : { y: [0, -10, 0], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="absolute -bottom-12 right-4 h-40 w-40 rounded-full bg-accent/25 blur-3xl"
                    animate={shouldReduceMotion ? undefined : { y: [0, 12, 0], opacity: [0.35, 0.75, 0.35] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                  />
                </div>

                <div className="relative space-y-5">
                  <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    {floatingKeywords.map((word, index) => {
                      const position = FLOATING_KEYWORD_POSITIONS[index % FLOATING_KEYWORD_POSITIONS.length];
                      const horizontalStyle = isRTL ? { right: position.x } : { left: position.x };

                      return (
                        <motion.span
                          key={word}
                          className="absolute rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-semibold text-muted-foreground shadow-sm backdrop-blur-md"
                          style={{ top: position.y, ...horizontalStyle }}
                          animate={
                            shouldReduceMotion
                              ? undefined
                              : { y: [0, -6, 0], opacity: [0.65, 1, 0.65], scale: [1, 1.03, 1] }
                          }
                          transition={{ duration: 6 + index * 0.4, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          {word}
                        </motion.span>
                      );
                    })}
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">{t('landing.social.label')}</p>
                      <p className="text-xs text-muted-foreground">{t('landing.hero.supporting')}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-muted/70 px-3 py-1 text-xs font-semibold text-muted-foreground border border-border">
                        {t('landing.hero.eyebrow')}
                      </span>
                      <span className="rounded-full bg-gradient-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground shadow">
                        {t('landing.nav.features')}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 rounded-2xl bg-card/90 p-4 shadow-inner">
                    <div className="flex items-center justify-between gap-3 text-sm font-semibold text-foreground">
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" aria-hidden />
                        {t('landing.features.subtitle')}
                      </span>
                      <motion.span
                        className="text-xs text-primary"
                        animate={shouldReduceMotion ? undefined : { opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2.6, repeat: Infinity }}
                      >
                        {t('landing.nav.hero')}
                      </motion.span>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-color:theme(colors.primary.DEFAULT)_transparent]">
                      {(t('landing.social.items') as string[]).map((item) => (
                        <div
                          key={item}
                          className="flex min-w-[230px] items-center justify-between gap-3 rounded-xl border border-border bg-gradient-subtle/80 px-4 py-3 shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <span className="grid h-10 w-10 place-items-center rounded-xl bg-card text-primary shadow">
                              <CheckCircle2 className="h-5 w-5" aria-hidden />
                            </span>
                            <p className="text-sm font-semibold text-foreground">{item}</p>
                          </div>
                          <span className="text-xs font-semibold text-muted-foreground">{t('landing.hero.supporting')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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

                    <MotionDiv
                      className="flex items-center justify-between rounded-2xl border border-border bg-card/90 p-4 shadow-sm"
                      initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.12 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary shadow-inner">
                          <BarChart3 className="h-6 w-6" aria-hidden />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{t('landing.stats.title')}</p>
                          <p className="text-xs text-muted-foreground">{t('landing.features.subtitle')}</p>
                        </div>
                      </div>
                      <ArrowLeftRight className="h-5 w-5 text-muted-foreground" aria-hidden />
                    </MotionDiv>
                  </div>
                </div>
              </MotionDiv>
            </div>
          </section>

          <section id="themes" className="scroll-mt-24 py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <HeaderBlock
                title={t('landing.themes.title')}
                subtitle={t('landing.themes.subtitle')}
                eyebrow={t('landing.nav.themes')}
                align={isRTL ? 'end' : 'start'}
              />
              <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                <MotionDiv
                  className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/80 p-6 shadow-xl"
                  {...REVEAL_PROPS}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/10 to-primary/5" aria-hidden />
                  <div className="relative space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <img
                          src={LogoTextArtGreen}
                          alt={t('landing.brand')}
                          className="h-10 w-auto rounded-xl bg-white/70 p-2 shadow-lg shadow-primary/10 ring-1 ring-primary/10 dark:hidden"
                          loading="lazy"
                        />
                        <img
                          src={LogoTextArtWhite}
                          alt={t('landing.brand')}
                          className="hidden h-10 w-auto rounded-xl bg-secondary/40 p-2 shadow-lg shadow-primary/20 ring-1 ring-primary/30 dark:block"
                          loading="lazy"
                        />
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          <p className="text-sm font-semibold text-foreground">{t('landing.brand')}</p>
                          <p className="text-xs text-muted-foreground">{t('landing.hero.supporting')}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-muted/70 px-3 py-1 text-xs font-semibold text-muted-foreground border border-border">
                        {t('landing.themes.ribbon')}
                      </span>
                    </div>

                    <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                      {t('landing.themes.description')}
                    </p>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {themeCards.map((card) => {
                        const isNight = card.tone === 'night';
                        return (
                          <div
                            key={card.title}
                            className="group relative overflow-hidden rounded-2xl border border-border/70 p-4 shadow-lg shadow-primary/5"
                            style={{ background: THEME_GRADIENTS[card.tone] }}
                          >
                            <div
                              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-primary/5 dark:from-black/20 dark:via-black/10 dark:to-primary/20"
                              aria-hidden
                            />
                            <div className="relative flex items-start justify-between gap-3">
                              <div className="space-y-2">
                                <span
                                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                                    isNight
                                      ? 'bg-white/10 text-white ring-1 ring-white/20'
                                      : 'bg-white/70 text-primary ring-1 ring-primary/10'
                                  }`}
                                >
                                  {card.badge}
                                </span>
                                <h3
                                  className={`text-lg font-semibold leading-tight ${
                                    isNight ? 'text-white drop-shadow' : 'text-foreground'
                                  }`}
                                >
                                  {card.title}
                                </h3>
                                <p
                                  className={`text-sm leading-relaxed ${
                                    isNight ? 'text-slate-100/80' : 'text-muted-foreground'
                                  }`}
                                >
                                  {card.description}
                                </p>
                              </div>
                              <div className="relative h-12 w-12 shrink-0 rounded-2xl bg-white/70 p-2 shadow-lg shadow-primary/20 ring-1 ring-primary/10 dark:bg-secondary/50 dark:shadow-primary/30 dark:ring-primary/30">
                                <img
                                  src={card.tone === 'day' ? LogoTextArtGreen : LogoTextArtWhite}
                                  alt={card.title}
                                  className="h-full w-full object-contain"
                                  loading="lazy"
                                />
                              </div>
                            </div>
                            <p
                              className={`relative mt-3 text-xs font-semibold ${
                                isNight ? 'text-slate-100/70' : 'text-primary'
                              }`}
                            >
                              {card.note}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </MotionDiv>

                <MotionDiv
                  className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/80 p-6 shadow-xl"
                  {...REVEAL_PROPS}
                  transition={{ ...REVEAL_PROPS.transition, delay: shouldReduceMotion ? 0 : 0.08 }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(82,143,255,0.08),transparent_32%),radial-gradient(circle_at_85%_12%,rgba(56,189,248,0.12),transparent_28%),radial-gradient(circle_at_30%_75%,rgba(16,185,129,0.1),transparent_30%)] dark:bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.1),transparent_32%),radial-gradient(circle_at_85%_12%,rgba(82,143,255,0.16),transparent_28%),radial-gradient(circle_at_30%_75%,rgba(16,185,129,0.14),transparent_30%)]" aria-hidden />
                  <div className="relative space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-foreground">{t('landing.themes.energy.title')}</p>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        {t('landing.themes.energy.badge')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground sm:text-base">{t('landing.themes.energy.copy')}</p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {heroHighlights.map((highlight) => (
                        <div
                          key={highlight}
                          className="flex items-center gap-3 rounded-2xl border border-border bg-gradient-subtle/80 p-4 shadow-sm"
                        >
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/15 via-accent/20 to-primary/10 shadow-inner" />
                          <p className="text-sm font-semibold text-foreground">{highlight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </MotionDiv>
              </div>
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
                      className="group relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-card/80 p-5 shadow-md"
                      {...REVEAL_PROPS}
                    >
                      <div className="pointer-events-none absolute -right-6 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition duration-500 group-hover:scale-110" aria-hidden />
                      <div className="flex items-center gap-3">
                        <span className="grid h-12 w-12 place-items-center rounded-xl bg-muted/70 text-primary shadow-sm">
                          <Icon className="h-5 w-5" aria-hidden />
                        </span>
                        <p className="text-base font-semibold text-foreground">{feature.title}</p>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                      <div className="mt-auto flex items-center gap-2 text-xs font-semibold text-primary">
                        <span className="h-1 w-1 rounded-full bg-primary" />
                        {t('landing.hero.supporting')}
                      </div>
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
              <div className="relative mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div
                  className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-primary/0 via-primary/40 to-primary/0 md:block"
                  aria-hidden
                />
                {steps.map((step, index) => (
                  <MotionDiv
                    key={step.title}
                    className="relative h-full overflow-hidden rounded-2xl border border-border bg-card/80 p-5 shadow-md"
                    {...REVEAL_PROPS}
                    transition={{ ...REVEAL_PROPS.transition, delay: shouldReduceMotion ? 0 : index * 0.05 }}
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" aria-hidden />
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
              <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_1fr]">
                <MotionDiv
                  className="relative overflow-hidden rounded-3xl border border-border bg-card/85 p-6 shadow-xl"
                  {...REVEAL_PROPS}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/15" aria-hidden />
                  <div className="relative space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-muted/70 px-3 py-1 text-xs font-semibold text-muted-foreground border border-border">
                        {t('landing.nav.screens')}
                      </span>
                      <span className="rounded-full bg-gradient-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground shadow">
                        {t('landing.nav.hero')}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {(t('landing.screens.highlights') as string[]).map((highlight) => (
                        <div
                          key={highlight}
                          className="flex h-full flex-col justify-between gap-3 rounded-2xl border border-border bg-card/90 p-4 shadow-md"
                        >
                          <div className="flex items-center gap-3">
                            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-subtle text-primary shadow">
                              <Layers className="h-5 w-5" aria-hidden />
                            </span>
                            <p className="text-sm font-semibold text-foreground">{t('landing.hero.eyebrow')}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{highlight}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {stats.slice(0, 4).map((stat) => (
                        <div key={stat.label} className="rounded-xl border border-border bg-card/90 p-3 text-center shadow-sm">
                          <p className="text-xs text-muted-foreground">{stat.label}</p>
                          <p className="text-lg font-bold text-foreground">{stat.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </MotionDiv>

                <MotionDiv
                  className="flex flex-col gap-4 overflow-hidden rounded-3xl border border-border bg-card/85 p-6 shadow-xl"
                  {...REVEAL_PROPS}
                  transition={{ ...REVEAL_PROPS.transition, delay: shouldReduceMotion ? 0 : 0.08 }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">{t('landing.features.subtitle')}</p>
                    <span className="rounded-full bg-muted/70 px-3 py-1 text-xs font-semibold text-muted-foreground border border-border">
                      {t('landing.hero.supporting')}
                    </span>
                  </div>
                  <div className="flex snap-x gap-3 overflow-x-auto pb-2 [scrollbar-color:theme(colors.primary.DEFAULT)_transparent]">
                    {features.map((feature) => (
                      <div
                        key={feature.title}
                        className="min-w-[220px] snap-start rounded-2xl border border-border bg-card/90 p-4 shadow-md"
                      >
                        <div className="flex items-center gap-3">
                          <span className="grid h-10 w-10 place-items-center rounded-xl bg-muted/70 text-primary shadow-sm">
                            {(() => {
                              const Icon = ICON_MAP[feature.icon] as ElementType;
                              return <Icon className="h-5 w-5" aria-hidden />;
                            })()}
                          </span>
                          <p className="text-sm font-semibold text-foreground">{feature.title}</p>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card/90 p-4 shadow-sm">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t('landing.contact.title')}</p>
                      <p className="text-xs text-muted-foreground">{t('landing.contact.subtitle')}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenLogin}
                      className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                    >
                      {t('landing.hero.primaryCta')}
                    </button>
                  </div>
                </MotionDiv>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                {sampleLayouts.map((layout, index) => (
                  <MotionDiv
                    key={layout.id}
                    className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/90 p-4 shadow-lg"
                    {...REVEAL_PROPS}
                    transition={{ ...REVEAL_PROPS.transition, delay: shouldReduceMotion ? 0 : index * 0.05 }}
                    style={{ backgroundImage: layout.gradient }}
                  >
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-br from-card/70 via-transparent to-accent/10"
                      aria-hidden
                    />
                    <div className="relative space-y-3">
                      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="inline-flex items-center gap-2 rounded-full bg-card/80 px-3 py-1 text-xs font-semibold text-muted-foreground border border-border/60 backdrop-blur">
                          {layout.badge}
                        </span>
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-card/80 text-primary shadow-inner border border-border/70">
                          {layout.tone === 'day' ? <SunMedium className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
                        </span>
                      </div>
                      <div className="relative rounded-xl border border-border/80 bg-card/60 p-3 shadow-sm backdrop-blur">
                        <p className="text-base font-semibold text-foreground">{layout.title}</p>
                        <p className="text-xs text-muted-foreground">{layout.subtitle}</p>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                          <span className="rounded-lg border border-border/60 bg-muted/60 px-2 py-1 font-semibold text-foreground">
                            {t('landing.nav.features')}
                          </span>
                          <span className="rounded-lg border border-border/60 bg-muted/60 px-2 py-1 font-semibold text-foreground">
                            {t('landing.nav.pricing')}
                          </span>
                          <span className="rounded-lg border border-border/60 bg-muted/60 px-2 py-1 font-semibold text-foreground">
                            {t('landing.nav.faq')}
                          </span>
                          <span className="rounded-lg border border-border/60 bg-muted/60 px-2 py-1 font-semibold text-foreground">
                            {t('landing.nav.contact')}
                          </span>
                        </div>
                      </div>
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
                    className="relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-card/80 p-5 shadow-md"
                    {...REVEAL_PROPS}
                    transition={{ ...REVEAL_PROPS.transition, delay: shouldReduceMotion ? 0 : index * 0.05 }}
                  >
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" aria-hidden />
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
                    className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card/85 p-6 shadow-md"
                    {...REVEAL_PROPS}
                  >
                    <div className="pointer-events-none absolute inset-x-6 top-0 h-24 rounded-b-full bg-gradient-to-b from-primary/20 via-primary/5 to-transparent opacity-70 transition duration-500 group-hover:opacity-100" aria-hidden />
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
              <div className="relative overflow-hidden rounded-3xl border border-border bg-card/90 p-8 shadow-lg lg:p-12">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/15" aria-hidden />
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

      <AnimatePresence>
        {!showLoginForm && (
          <motion.div
            className="fixed inset-x-4 bottom-4 z-30 md:hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card/95 px-4 py-3 shadow-xl backdrop-blur">
              <div>
                <p className="text-sm font-semibold text-foreground">{t('landing.hero.title')}</p>
                <p className="text-xs text-muted-foreground">{t('landing.hero.subtitle')}</p>
              </div>
              <button
                type="button"
                onClick={handleOpenLogin}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md"
              >
                {t('landing.hero.primaryCta')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AnimatedBackdrop = () => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-primary/15 blur-3xl"
        aria-hidden
        animate={reduceMotion ? undefined : { y: [0, -20, 0], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent/20 blur-3xl"
        aria-hidden
        animate={reduceMotion ? undefined : { y: [0, 18, 0], opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
      />
      <motion.div
        className="absolute left-1/3 top-1/4 h-40 w-40 rounded-full bg-primary/10 blur-2xl"
        aria-hidden
        animate={reduceMotion ? undefined : { scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
      />
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
  const reduceMotion = useReducedMotion();
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
        <motion.span
          animate={{ rotate: open && !reduceMotion ? 90 : 0 }}
          className="text-primary"
        >
          {open ? '−' : '+'}
        </motion.span>
      </button>
      {open && <p className="mt-2 text-sm text-muted-foreground">{answer}</p>}
    </MotionDiv>
  );
};

export default HomePage;
