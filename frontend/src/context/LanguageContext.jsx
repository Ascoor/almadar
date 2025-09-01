import React, { createContext, useContext, useEffect, useState } from 'react';
import ar from '@/locales/ar.json';
import en from '@/locales/en.json';

const translations = { ar, en };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('ar');

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  const t = (key) => translations[lang][key] || key;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const formatNumber = (num, language = 'ar') =>
    new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US').format(num);

  return (
    <LanguageContext.Provider value={{ lang, dir, toggleLanguage, t, formatNumber }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
