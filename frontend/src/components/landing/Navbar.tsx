import { useEffect, useMemo, useState } from 'react'
import { Menu, MoonStar, Scale, SunMedium, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LanguageToggle from '@/components/common/LanguageToggle'
import useI18n from '@/hooks/useI18n'
import { useTheme } from '@/hooks/useTheme'
import { useNavigate } from 'react-router-dom'

interface NavbarProps {
  onSignInClick?: () => void
}

const sections = ['hero', 'features', 'workflow', 'preview', 'pricing', 'testimonials', 'faq', 'contact'] as const

const Navbar = ({ onSignInClick }: NavbarProps) => {
  const { t, lang, dir } = useI18n()
  const navigate = useNavigate()
  const { resolvedTheme, toggleTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<typeof sections[number]>('hero')

  const navLinks = useMemo(
    () =>
      sections.map((id) => ({
        id,
        label: t(`nav.links.${id}`),
      })),
    [t],
  )

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('id') as typeof sections[number]
            if (sectionId) setActiveSection(sectionId)
          }
        })
      },
      {
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0.25,
      },
    )

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const handleNavClick = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setIsMobileMenuOpen(false)
    }
  }

  const handleLogin = () => {
    if (onSignInClick) onSignInClick()
    navigate('/login')
    setIsMobileMenuOpen(false)
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <header className="fixed inset-x-0 top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
            <Scale className="h-5 w-5" />
          </span>
          <div className="flex flex-col">
            <span className="font-heading text-lg font-semibold leading-tight">{t('nav.brand')}</span>
            <span className="text-xs text-muted-foreground">{t('hero.badge')}</span>
          </div>
        </div>

        <nav className="hidden items-center gap-2 md:flex" aria-label={t('nav.language')} dir={dir}>
          {navLinks.map((link) => (
            <button
              key={link.id}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeSection === link.id
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              onClick={() => handleNavClick(link.id)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex" dir={dir}>
          <LanguageToggle />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={isDark ? t('nav.day') : t('nav.night')}
            className="rounded-full border border-border/60 bg-card text-foreground hover:bg-muted"
            onClick={toggleTheme}
          >
            {isDark ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
          </Button>
          <Button
            variant="outline"
            className="border-border bg-card text-foreground"
            onClick={handleLogin}
          >
            {t('nav.login')}
          </Button>
          <Button onClick={() => handleNavClick('contact')} className="bg-primary text-primary-foreground">
            {t('nav.getStarted')}
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-card text-foreground md:hidden"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-border/60 bg-background/95 backdrop-blur-lg md:hidden" dir={dir}>
          <div className="space-y-2 px-4 py-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                className={`w-full rounded-xl px-4 py-3 text-start text-sm font-medium transition-colors ${
                  activeSection === link.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-foreground hover:bg-muted'
                }`}
                onClick={() => handleNavClick(link.id)}
              >
                {link.label}
              </button>
            ))}
            <div className="flex items-center justify-between gap-3 pt-2">
              <LanguageToggle />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={isDark ? t('nav.day') : t('nav.night')}
                className="rounded-full border border-border/60 bg-card text-foreground hover:bg-muted"
                onClick={toggleTheme}
              >
                {isDark ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
              </Button>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="outline" className="border-border bg-card text-foreground" onClick={handleLogin}>
                {t('nav.login')}
              </Button>
              <Button className="bg-primary text-primary-foreground" onClick={() => handleNavClick('contact')}>
                {t('nav.getStarted')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
