import { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, PlayCircle, Shield, Sparkles, Timer } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useI18n } from '@/hooks/useI18n';
import { Link } from 'react-router-dom';

const SectionTitle = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="mx-auto max-w-3xl text-center">
    <p className="mb-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
      {subtitle}
    </p>
    <h2 className="text-3xl font-bold text-foreground sm:text-4xl">{title}</h2>
  </div>
);

const Home = () => {
  const { t, formatNumber } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const features = useMemo(() => t('features.items'), [t]) as Array<{ title: string; description: string }>;
  const howSteps = useMemo(() => t('how.steps'), [t]) as Array<{ title: string; description: string }>;
  const testimonials = useMemo(() => t('testimonials.items'), [t]) as Array<{
    quote: string;
    name: string;
    role: string;
  }>;
  const plans = useMemo(() => t('pricing.plans'), [t]) as Array<{
    name: string;
    price: string;
    period: string;
    features: string[];
  }>;
  const faqItems = useMemo(() => t('faq.items'), [t]) as Array<{
    question: string;
    answer: string;
  }>;

  return (
    <div className="min-h-screen bg-bg text-fg">
      <Navbar />
      <main className="pt-24">
        <section className="relative overflow-hidden bg-gradient-subtle" id="hero">
          <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-background/60 to-background" aria-hidden />
          <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  <Sparkles className="h-4 w-4" />
                  {t('hero.badge')}
                </span>
                <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl">
                  {t('hero.title')}
                </h1>
                <p className="text-lg text-muted-foreground sm:text-xl">{t('hero.description')}</p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:shadow-glow"
                  >
                    {t('hero.primaryCta')}
                    <ArrowRight className="ms-2 h-4 w-4" />
                  </Link>
                  <a
                    href="#screens"
                    className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:border-primary"
                  >
                    <PlayCircle className="me-2 h-4 w-4" />
                    {t('hero.secondaryCta')}
                  </a>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-border bg-card p-4 shadow-md">
                    <p className="text-sm text-muted-foreground">{t('hero.metrics.cases')}</p>
                    <p className="text-2xl font-bold text-foreground">{formatNumber(1320)}</p>
                    <p className="text-xs text-muted-foreground">{t('features.title')}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-4 shadow-md">
                    <p className="text-sm text-muted-foreground">{t('hero.metrics.savings')}</p>
                    <p className="text-2xl font-bold text-foreground">{formatNumber(4200)}</p>
                    <p className="text-xs text-muted-foreground">{t('how.title')}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-4 shadow-md">
                    <p className="text-sm text-muted-foreground">{t('hero.metrics.approvals')}</p>
                    <p className="text-2xl font-bold text-foreground">{formatNumber(94)}%</p>
                    <p className="text-xs text-muted-foreground">{t('hero.metrics.reliability')}</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 -z-10 rounded-full bg-primary/10 blur-3xl" aria-hidden />
                <div className="overflow-hidden rounded-2xl border border-border bg-card/80 shadow-xl backdrop-blur">
                  <div className="grid grid-cols-2 gap-3 p-6">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="aspect-video rounded-xl bg-gradient-to-br from-primary/10 via-card to-background p-3 shadow-inner"
                      >
                        <div className="flex h-full flex-col justify-between rounded-lg border border-border/60 bg-background/60 p-3">
                          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <Shield className="h-4 w-4 text-primary" />
                            {t('nav.screens')}
                          </div>
                          <div className="text-xs text-muted-foreground">{t('screens.subtitle')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border/60 px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Timer className="h-4 w-4 text-primary" />
                      {t('how.subtitle')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionTitle title={t('features.title')} subtitle={t('features.subtitle')} />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => (
              <div
                key={feature.title}
                className="flex h-full flex-col rounded-2xl border border-border bg-card/80 p-6 shadow-md transition hover:-translate-y-1 hover:border-primary"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                <div className="mt-auto pt-4 text-xs font-medium text-primary">
                  {t('nav.features')} #{idx + 1}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="how" className="bg-card/40 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionTitle title={t('how.title')} subtitle={t('how.subtitle')} />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {howSteps.map((step, idx) => (
                <div
                  key={step.title}
                  className="relative rounded-2xl border border-border bg-background/80 p-6 shadow-md"
                >
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                    {idx + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="screens" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionTitle title={t('screens.title')} subtitle={t('screens.subtitle')} />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[1, 2, 3].map((card) => (
              <div
                key={card}
                className="rounded-2xl border border-border bg-card/80 p-4 shadow-md transition hover:-translate-y-1 hover:border-primary"
              >
                <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/10 via-card to-background" />
                <div className="mt-4 space-y-2">
                  <div className="h-3 w-24 rounded-full bg-muted" />
                  <div className="h-3 w-32 rounded-full bg-muted/70" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="bg-card/40 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionTitle title={t('pricing.title')} subtitle={t('pricing.subtitle')} />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {plans.map((plan, idx) => (
                <div
                  key={plan.name}
                  className="flex h-full flex-col rounded-2xl border border-border bg-background/80 p-6 shadow-lg transition hover:-translate-y-1 hover:border-primary"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                    {idx === 1 && (
                      <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">Popular</span>
                    )}
                  </div>
                  <p className="mt-4 text-3xl font-bold text-foreground">{plan.price}</p>
                  <p className="text-sm text-muted-foreground">{plan.period}</p>
                  <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                    {plan.features.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="mt-auto rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary">
                    {t('nav.getStarted')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionTitle title={t('testimonials.title')} subtitle={t('testimonials.subtitle')} />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <div
                key={item.name}
                className="h-full rounded-2xl border border-border bg-card/80 p-6 shadow-md"
              >
                <p className="text-sm text-muted-foreground">“{item.quote}”</p>
                <div className="mt-4">
                  <p className="text-base font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="bg-card/40 py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <SectionTitle title={t('faq.title')} subtitle={t('faq.subtitle')} />
            <div className="mt-8 space-y-3">
              {faqItems.map((item, idx) => (
                <div key={item.question} className="overflow-hidden rounded-2xl border border-border bg-background/80 shadow-md">
                  <button
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-foreground"
                    onClick={() => setOpenFaq((prev) => (prev === idx ? null : idx))}
                  >
                    {item.question}
                    <span className="text-primary">{openFaq === idx ? '−' : '+'}</span>
                  </button>
                  {openFaq === idx && (
                    <div className="border-t border-border/60 px-4 py-3 text-sm text-muted-foreground">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-card to-background shadow-xl">
            <div className="grid gap-10 p-8 md:grid-cols-2 md:p-12">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">{t('contact.title')}</p>
                <h3 className="text-3xl font-bold text-foreground">{t('contact.subtitle')}</h3>
              </div>
              <div className="flex flex-col justify-center gap-3 sm:flex-row sm:items-center">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:shadow-glow"
                >
                  {t('nav.login')}
                </Link>
                <a
                  href="#hero"
                  className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition hover:border-primary"
                >
                  {t('contact.cta')}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-background/90 py-8">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            © 2024 Almadar. {t('nav.contact')}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
