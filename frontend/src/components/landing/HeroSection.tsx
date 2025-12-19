import useI18n from '@/hooks/useI18n'
import { Button } from '@/components/ui/button'
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'

interface HeroProps {
  onSignInClick?: () => void
}

const HeroSection = ({ onSignInClick }: HeroProps) => {
  const { t, dir } = useI18n()

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-b from-background via-background to-card pb-20 pt-28 md:pt-32"
    >
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-48 w-48 rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 md:px-6">
        <div className="flex flex-col gap-6 text-center" dir={dir}>
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-2 text-sm text-foreground shadow-md">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>{t('hero.badge')}</span>
          </div>
          <div className="space-y-4">
            <h1 className="font-heading text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
              {t('hero.title')}
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground md:text-xl">
              {t('hero.subtitle')}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3" dir={dir}>
            <Button className="bg-primary text-primary-foreground shadow-lg" size="lg" onClick={onSignInClick}>
              <span>{t('hero.primary')}</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-border bg-card text-foreground"
              onClick={() => {
                const section = document.getElementById('preview')
                if (section) section.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              {t('hero.secondary')}
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 rounded-2xl border border-border/70 bg-card/60 p-4 shadow-lg sm:grid-cols-3">
            {t('hero.stats').map((stat: { label: string; value: string }) => (
              <div key={stat.label} className="rounded-xl bg-background/70 p-4 text-center">
                <div className="text-2xl font-semibold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative rounded-3xl border border-border/60 bg-card/70 p-6 shadow-xl" dir={dir}>
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10" />
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl space-y-3">
              <h3 className="text-xl font-semibold text-foreground">
                {t('preview.title')}
              </h3>
              <p className="text-muted-foreground">{t('preview.subtitle')}</p>
              <div className="flex flex-wrap gap-2">
                {t('preview.highlights').map((highlight: string) => (
                  <span
                    key={highlight}
                    className="rounded-full bg-background px-3 py-1 text-xs text-muted-foreground border border-border/60"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-1 items-center justify-center">
              <div className="w-full max-w-md rounded-2xl border border-border bg-background/80 p-4 shadow-lg">
                <div className="mb-4 flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{t('nav.brand')}</span>
                  <ShieldCheck className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-3">
                  <div className="h-3 rounded-full bg-muted" />
                  <div className="h-3 w-5/6 rounded-full bg-muted" />
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="h-20 rounded-xl bg-muted" />
                    <div className="h-20 rounded-xl bg-muted" />
                    <div className="h-20 rounded-xl bg-muted" />
                  </div>
                  <div className="h-3 w-2/3 rounded-full bg-muted" />
                  <div className="h-3 w-1/2 rounded-full bg-muted" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
