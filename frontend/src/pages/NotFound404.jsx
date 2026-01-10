import { SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

export default function NotFound404() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="card p-8 text-center max-w-xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <SearchX className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold text-fg">
          {lang === 'en' ? '404 - Page Not Found' : '404 - الصفحة غير موجودة'}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {lang === 'en'
            ? 'We could not find the page you were looking for.'
            : 'لم نعثر على الصفحة التي تبحث عنها.'}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button asChild variant="outline">
            <Link to="/dashboard">{lang === 'en' ? 'Back to dashboard' : 'العودة للوحة التحكم'}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
