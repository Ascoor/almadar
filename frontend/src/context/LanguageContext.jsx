import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations } from '@/config/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('ar');

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => setLang(prev => (prev === 'ar' ? 'en' : 'ar'));

  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[lang];
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }
    if (typeof value === 'string') {
      return value.replace(/{{(\w+)}}/g, (_, v) => params[v] ?? '');
    }
    return key;
  };
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const formatNumber = (num, language = 'ar') => {
    if (language === 'ar') {
      return new Intl.NumberFormat('ar-EG').format(num);
    }
    return new Intl.NumberFormat('en-US').format(num);
  };
  return (
    <LanguageContext.Provider value={{ lang, dir, toggleLanguage, t, formatNumber }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
