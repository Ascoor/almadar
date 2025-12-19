import { useI18n } from '@/hooks/useI18n';
import { Globe2 } from 'lucide-react';

export const LanguageToggle = () => {
  const { lang, toggleLanguage } = useI18n();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary"
      aria-label="Toggle language"
    >
      <Globe2 className="h-4 w-4" />
      <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
    </button>
  );
};
