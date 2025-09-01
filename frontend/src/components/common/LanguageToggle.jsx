import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';

export default function LanguageToggle() {
  const { lang, toggleLanguage, t } = useLanguage();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      aria-label={lang === 'ar' ? t('switchToEnglish') : t('switchToArabic')}
    >
      {lang === 'ar' ? 'EN' : 'ع'}
    </Button>
  );
}
