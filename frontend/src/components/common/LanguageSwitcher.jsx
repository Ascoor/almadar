import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';

export default function LanguageSwitcher() {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={toggleLanguage}
      className="shadow-sm"
    >
      {lang === 'ar' ? 'English' : 'العربية'}
    </Button>
  );
}
