import useI18n from '@/hooks/useI18n'
import { CheckCircle2, Layers, Shield, Workflow } from 'lucide-react'

const icons = [Layers, Workflow, CheckCircle2, Shield]

const FeaturesSection = () => {
  const { t, dir } = useI18n()
  const items = t('features.items') as { title: string; description: string }[]

  return (
    <section id="features" className="bg-background py-16 md:py-20" dir={dir}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">{t('features.title')}</p>
          <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">{t('features.subtitle')}</h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((feature, index) => {
            const Icon = icons[index % icons.length]
            return (
              <div
                key={feature.title}
                className="flex h-full flex-col gap-3 rounded-2xl border border-border/60 bg-card/70 p-5 shadow-lg"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
