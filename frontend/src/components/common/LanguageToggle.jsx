import { Button } from '@/components/ui/button'
import useI18n from '@/hooks/useI18n'

export default function LanguageToggle() {
  const { lang, toggleLanguage, t } = useI18n()
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      aria-label={lang === 'ar' ? t('nav.language') : t('nav.language')}
      className="rounded-full border border-border/60 bg-card text-foreground hover:bg-muted px-3"
      onClick={toggleLanguage}
    >
      <span className="text-sm font-medium">{lang === 'ar' ? 'EN' : 'ع'}</span>
    </Button>
  )
}
