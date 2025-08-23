import React, { createContext, useContext, useEffect, useState } from 'react';

const translations = {
  ar: {
    home: 'الرئيسية',
    contracts: 'التعاقدات',
    investigations: 'التحقيقات',
    legalAdvices: 'المشورة القانونية',
    litigations: 'التقاضي',
    management: 'إدارة التطبيق',
    lists: 'القوائم',
    users: 'إدارة المستخدمين',
    usersList: 'المستخدمين',
    archive: 'الأرشيف',
    fatwa: 'الرأي والفتوى'
  },
  en: {
    home: 'Home',
    contracts: 'Contracts',
    investigations: 'Investigations',
    legalAdvices: 'Legal Advices',
    litigations: 'Litigations',
    management: 'App Management',
    lists: 'Lists',
    users: 'Users Management',
    usersList: 'Users',
    archive: 'Archive',
    fatwa: 'Fatwa'
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('ar');

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const toggleLanguage = () => setLang(prev => (prev === 'ar' ? 'en' : 'ar'));

  const t = key => translations[lang][key] || key;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ lang, dir, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

