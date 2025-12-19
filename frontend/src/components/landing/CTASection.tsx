import useI18n from '@/hooks/useI18n'
import { Button } from '@/components/ui/button'
import { PhoneCall, Send } from 'lucide-react'

interface CTAProps {
  onSignInClick?: () => void
}

const CTASection = ({ onSignInClick }: CTAProps) => {
  const { t, dir } = useI18n()

  return (
    <section id="contact" className="bg-card py-16" dir={dir}>
      <div className="mx-auto max-w-5xl rounded-3xl border border-border/60 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 px-6 py-10 shadow-xl md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">{t('contact.title')}</p>
            <h3 className="text-3xl font-bold text-foreground">{t('contact.subtitle')}</h3>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="bg-primary text-primary-foreground" onClick={onSignInClick}>
              <Send className="h-5 w-5" />
              <span>{t('contact.primary')}</span>
            </Button>
            <Button variant="outline" className="border-border bg-card text-foreground">
              <PhoneCall className="h-5 w-5" />
              <span>{t('contact.secondary')}</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
