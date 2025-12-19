import { FormEvent, useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/hooks/useI18n';
import { Navbar } from '@/components/Navbar';

const isValidEmail = (value: string) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value);

const Login = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !isValidEmail(email)) {
      setError(t('login.error'));
      return;
    }
    if (!password) {
      setError(t('login.error'));
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setSuccess(t('login.success'));
      if (remember) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      setTimeout(() => navigate('/'), 900);
    } catch (err) {
      console.error(err);
      setError(t('login.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-fg">
      <Navbar />
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-card/80 shadow-xl backdrop-blur">
          <div className="border-b border-border/60 bg-gradient-subtle px-6 py-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">{t('login.title')}</p>
            <h1 className="mt-2 text-3xl font-bold text-foreground">{t('login.subtitle')}</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
            {error && (
              <div className="rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-xl border border-success/60 bg-success/10 px-4 py-3 text-sm text-foreground">
                {success}
              </div>
            )}
            <label className="block space-y-2 text-left">
              <span className="text-sm font-semibold text-foreground">{t('login.email')}</span>
              <div className="relative">
                <Mail className="absolute inset-y-0 start-3 my-auto h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-border bg-background/70 px-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </label>

            <label className="block space-y-2 text-left">
              <span className="text-sm font-semibold text-foreground">{t('login.password')}</span>
              <div className="relative">
                <Lock className="absolute inset-y-0 start-3 my-auto h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-border bg-background/70 px-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 end-3 my-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:text-foreground"
                  aria-label={showPassword ? t('login.hide') : t('login.show')}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border border-border bg-background text-primary focus:ring-2 focus:ring-ring"
                />
                <span>{t('login.remember')}</span>
              </label>
              <button type="button" className="text-primary hover:underline">
                {t('login.forgot')}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:shadow-glow disabled:opacity-60"
            >
              {loading ? t('hero.secondaryCta') : t('login.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
