import React from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from 'react-i18next';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="language-switcher">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-50 bg-popover border border-border">
        <DropdownMenuItem
          onClick={() => setLanguage('ar')}
          className={`cursor-pointer ${language === 'ar' ? 'bg-accent' : ''}`}
        >
          <span className="font-bold me-2">ع</span>
          {t('language.arabic')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage('en')}
          className={`cursor-pointer ${language === 'en' ? 'bg-accent' : ''}`}
        >
          <span className="font-bold me-2">En</span>
          {t('language.english')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}