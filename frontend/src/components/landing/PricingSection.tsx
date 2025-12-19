import useI18n from '@/hooks/useI18n'
import { CheckCircle2 } from 'lucide-react'

const PricingSection = () => {
  const { t, dir } = useI18n()
  const plans = t('pricing.plans') as {
    name: string
    price: string
    period: string
    features: string[]
    highlighted?: boolean
  }[]

  return (
    <section id="pricing" className="bg-card py-16" dir={dir}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">{t('pricing.title')}</p>
          <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">{t('pricing.subtitle')}</h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border border-border/60 bg-background/80 p-6 shadow-lg ${
                plan.highlighted ? 'ring-2 ring-primary' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                  <p className="text-muted-foreground">{t('pricing.subtitle')}</p>
                </div>
                <div className="text-end">
                  <div className="text-3xl font-bold text-foreground">{plan.price}</div>
                  <div className="text-sm text-muted-foreground">{plan.period}</div>
                </div>
              </div>

              <ul className="mt-4 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className="mt-6 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-md">
                {plan.highlighted ? t('nav.getStarted') : t('nav.login')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PricingSection
