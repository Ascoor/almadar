import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import arCommon from './locales/ar/common.json';
import enCommon from './locales/en/common.json';

const resources = {
  ar: {
    common: arCommon,
  },
  en: {
    common: enCommon,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar', // Default language
    fallbackLng: 'ar',
    debug: import.meta.env.DEV,
    
    // Default namespace
    defaultNS: 'common',
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    react: {
      useSuspense: false,
    },
  });

export default i18n;