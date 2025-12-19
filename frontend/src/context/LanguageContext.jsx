import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from '@/i18n/translations';

const LanguageContext = createContext(null);

const getByPath = (obj, path) => {
  if (!obj || !path) return undefined;
  return path
    .split('.')
    .reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
};

const interpolate = (str, params = {}) =>
  String(str).replace(/\{(\w+)\}/g, (_, k) => (params?.[k] ?? ''));

const getInitialLanguage = () => {
  if (typeof window === 'undefined') return 'en';
  const storedLang = localStorage.getItem('lang');
  if (storedLang === 'ar' || storedLang === 'en') return storedLang;
  return navigator.language?.toLowerCase().startsWith('ar') ? 'ar' : 'en';
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(getInitialLanguage);

  useEffect(() => {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
  }, [lang]);

  const toggleLanguage = () => setLang((prev) => (prev === 'en' ? 'ar' : 'en'));

  const translationsMemo = useMemo(() => translations[lang] || translations.en, [lang]);

  const t = (path, params) => {
    const value = getByPath(translationsMemo, path);
    if (value === undefined) return path;
    return typeof value === 'string' ? interpolate(value, params) : value;
  };

  const formatNumber = (num, language = lang) =>
    new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US').format(num);

  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const isRTL = lang === 'ar';

  return (
    <LanguageContext.Provider
      value={{
        lang,
        language: lang,
        dir,
        isRTL,
        setLang,
        toggleLanguage,
        t,
        formatNumber,
        translations: translationsMemo,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
