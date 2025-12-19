import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import LanguageToggle from '@/components/common/LanguageToggle'
import ThemeToggle from '@/components/common/ThemeToggle'
import useI18n from '@/hooks/useI18n'
import { useAuth } from '@/context/AuthContext'

const emailRegex = /[^@\s]+@[^@\s]+\.[^@\s]+/

const LoginPage = () => {
  const { t, dir } = useI18n()
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    if (!emailRegex.test(email)) {
      setError(t('login.error'))
      return false
    }
    if (!password) {
      setError(t('login.error'))
      return false
    }
    setError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    const response = await login(email, password)
    if (response?.success) {
      setError('')
    } else {
      setError(response?.message || t('login.error'))
    }
    setIsSubmitting(false)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background" dir={dir}>
      <div className="flex items-center justify-between border-b border-border/60 bg-card/60 px-6 py-4">
        <div>
          <p className="text-sm font-semibold text-primary">{t('nav.brand')}</p>
          <p className="text-xs text-muted-foreground">{t('hero.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center px-4 py-12">
        <div className="grid w-full gap-8 md:grid-cols-5">
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">{t('login.title')}</h1>
            <p className="mt-2 text-muted-foreground">{t('login.subtitle')}</p>
            <div className="mt-6 space-y-2 rounded-2xl border border-border/60 bg-card/70 p-4 shadow-lg">
              <p className="text-sm font-semibold text-foreground">{t('nav.links.features')}</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• {t('features.items.0.description')}</li>
                <li>• {t('features.items.1.description')}</li>
                <li>• {t('features.items.2.description')}</li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-3xl border border-border/70 bg-card/80 p-6 shadow-xl"
            >
              <div>
                <Label htmlFor="email" className="text-foreground">
                  {t('login.emailLabel')}
                </Label>
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-border/60 bg-background px-3 py-2">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    className="border-0 bg-transparent focus-visible:ring-0"
                    placeholder={t('login.emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-foreground">
                  {t('login.passwordLabel')}
                </Label>
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-border/60 bg-background px-3 py-2">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="border-0 bg-transparent focus-visible:ring-0"
                    placeholder={t('login.passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="text-sm text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border/70 bg-background text-primary focus:ring-ring"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span>{t('login.remember')}</span>
                </label>
                <a href="#" className="text-primary hover:underline">
                  {t('login.forgot')}
                </a>
              </div>

              {error && (
                <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('login.loggingIn')}
                  </span>
                ) : (
                  t('login.submit')
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                {t('login.noAccount')}{' '}
                <button
                  type="button"
                  className="font-semibold text-primary hover:underline"
                  onClick={() => navigate('/')}
                >
                  {t('login.createAccount')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
