// src/context/LanguageContext.jsx  ← نفس المسار لكن بدون TypeScript
import React, { createContext, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext(undefined);

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();

  const setLanguage = (lang) => {
    try {
      i18n.changeLanguage(lang);
      // لو احتجت RTL toggle على مستوى الـ <html>:
      if (typeof document !== 'undefined') {
        const rtl = lang === 'ar';
        document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr');
      }
    } catch {}
  };

  const value = useMemo(() => {
    const lang = i18n?.language || 'ar';
    return {
      language: lang,
      setLanguage,
      isRTL: lang === 'ar',
    };
  }, [i18n?.language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
