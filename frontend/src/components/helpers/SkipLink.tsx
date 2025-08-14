import { useTranslation } from 'react-i18next';

export default function SkipLink() {
  const { t } = useTranslation();

  return (
    <a 
      href="#main-content" 
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:right-2 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 transition-all"
      aria-label={t('skipToMainContent')}
    >
      {t('skipToMainContent')}
    </a>
  );
}