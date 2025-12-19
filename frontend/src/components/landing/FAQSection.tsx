import { useState } from 'react'
import useI18n from '@/hooks/useI18n'
import { ChevronDown } from 'lucide-react'

const FAQSection = () => {
  const { t, dir } = useI18n()
  const items = t('faq.items') as { question: string; answer: string }[]
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="bg-background py-16" dir={dir}>
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">{t('faq.title')}</p>
          <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">{t('nav.links.faq')}</h2>
        </div>

        <div className="mt-8 divide-y divide-border/60 rounded-2xl border border-border/60 bg-card/70 shadow-lg">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx
            return (
              <button
                key={item.question}
                className="w-full px-4 py-4 text-start"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-base font-semibold text-foreground">{item.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </div>
                {isOpen && <p className="mt-3 text-sm text-muted-foreground">{item.answer}</p>}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FAQSection
