import LanguageToggle from '@/components/common/LanguageToggle'
import ThemeToggle from '@/components/common/ThemeToggle'
import useI18n from '@/hooks/useI18n'

const Footer = () => {
  const { t, dir } = useI18n()

  return (
    <footer className="border-t border-border/60 bg-background py-8" dir={dir}>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="space-y-2">
          <div className="text-lg font-semibold text-foreground">{t('nav.brand')}</div>
          <p className="max-w-xl text-sm text-muted-foreground">{t('footer.description')}</p>
          <p className="text-xs text-muted-foreground">{t('footer.rights')}</p>
        </div>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </footer>
  )
}

export default Footer
