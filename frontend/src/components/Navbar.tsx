import { useEffect, useMemo, useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useI18n } from '@/hooks/useI18n';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

const sections = ['features', 'how', 'screens', 'pricing', 'testimonials', 'faq', 'contact'];

export const Navbar = () => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  const links = useMemo(
    () =>
      sections.map((id) => ({
        id,
        label: t(`nav.${id === 'how' ? 'how' : id}`),
      })),
    [t],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.4 },
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-md">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm text-muted-foreground">{t('nav.brand')}</span>
            <span className="text-base font-semibold text-foreground">Almadar</span>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => handleScroll(link.id)}
              className={clsx(
                'transition-colors hover:text-foreground',
                active === link.id && 'text-foreground underline underline-offset-8 decoration-primary'
              )}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageToggle />
          <ThemeToggle />
          <Link
            to="/login"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md transition hover:shadow-glow"
          >
            {t('nav.login')}
          </Link>
          <button
            onClick={() => handleScroll('contact')}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary"
          >
            {t('nav.getStarted')}
          </button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-border p-2 text-foreground md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background/95 px-4 pb-6 pt-4 shadow-md md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => handleScroll(link.id)}
                className={clsx(
                  'rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition hover:bg-card hover:text-foreground',
                  active === link.id && 'bg-card text-foreground'
                )}
              >
                {link.label}
              </button>
            ))}
            <div className="flex flex-col gap-3 border-t border-border/60 pt-3">
              <LanguageToggle />
              <ThemeToggle />
              <Link
                to="/login"
                className="rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground shadow-md transition hover:shadow-glow"
              >
                {t('nav.login')}
              </Link>
              <button
                onClick={() => handleScroll('contact')}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary"
              >
                {t('nav.getStarted')}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
