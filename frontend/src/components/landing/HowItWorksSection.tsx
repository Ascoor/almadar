import useI18n from '@/hooks/useI18n'
import { ArrowRightCircle } from 'lucide-react'

const HowItWorksSection = () => {
  const { t, dir } = useI18n()
  const steps = t('workflow.steps') as { title: string; description: string }[]

  return (
    <section id="workflow" className="bg-card py-16" dir={dir}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">{t('workflow.title')}</p>
          <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">{t('workflow.subtitle')}</h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative flex h-full flex-col gap-3 rounded-2xl border border-border/60 bg-background/70 p-5 shadow-lg"
            >
              <span className="absolute -top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                {index + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="flex-1 text-muted-foreground">{step.description}</p>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                <ArrowRightCircle className="h-4 w-4" />
                {t('nav.links.workflow')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection
