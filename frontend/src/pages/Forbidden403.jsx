import { ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Forbidden403() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="card p-8 text-center max-w-xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold text-fg">
          {lang === 'en' ? '403 Forbidden' : '403 - لا تملك صلاحية الوصول'}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {lang === 'en'
            ? 'You do not have permission to view this page. If you think this is a mistake, contact your administrator.'
            : 'ليست لديك صلاحية لعرض هذه الصفحة. إذا كنت تعتقد أن ذلك خطأ، تواصل مع المسؤول.'}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button asChild>
            <Link to="/dashboard">{lang === 'en' ? 'Go Home' : 'العودة للرئيسية'}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
