import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';

export default function LanguageToggle() {
  const { lang, toggleLanguage } = useLanguage();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      aria-label={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      {lang === 'ar' ? 'EN' : 'ع'}
    </Button>
  );
}
