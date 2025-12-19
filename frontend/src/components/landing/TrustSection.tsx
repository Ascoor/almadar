import useI18n from '@/hooks/useI18n'
import { Quote } from 'lucide-react'

const TrustSection = () => {
  const { t, dir } = useI18n()
  const testimonials = t('testimonials.items') as { quote: string; name: string; role: string }[]

  return (
    <section id="testimonials" className="bg-background py-16" dir={dir}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">{t('testimonials.title')}</p>
          <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">{t('testimonials.subtitle')}</h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {testimonials.map((item) => (
            <article
              key={item.name}
              className="relative h-full rounded-2xl border border-border/60 bg-card/70 p-6 shadow-lg"
            >
              <Quote className="absolute -left-3 -top-3 h-8 w-8 text-primary/70" />
              <p className="text-lg text-foreground">“{item.quote}”</p>
              <div className="mt-4 text-sm text-muted-foreground">
                <div className="font-semibold text-foreground">{item.name}</div>
                <div>{item.role}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustSection
