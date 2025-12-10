import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import ar from '@/locales/ar.json';
import en from '@/locales/en.json';

const translations = { ar, en };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const getInitialLanguage = () => {
    if (typeof window === 'undefined') return 'en';
    const storedLang = localStorage.getItem('lang');
    if (storedLang === 'ar' || storedLang === 'en') return storedLang;
    return navigator.language?.toLowerCase().startsWith('ar') ? 'ar' : 'en';
  };

  const [lang, setLang] = useState(getInitialLanguage);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
  }, [lang]);

  const toggleLanguage = () => setLang(prev => (prev === 'en' ? 'ar' : 'en'));
  const translationsMemo = useMemo(() => translations[lang], [lang]);
  const t = (key) => translationsMemo[key] || key;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const formatNumber = (num, language = lang) =>
    new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US').format(num);

  return (
    <LanguageContext.Provider value={{ lang, dir, translations: translationsMemo, toggleLanguage, t, formatNumber }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
