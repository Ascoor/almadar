import { useLanguage } from '@/context/LanguageContext';

export const useI18n = () => {
  const { t, lang, language, setLang, toggleLanguage, dir, isRTL, formatNumber } = useLanguage();
  return {
    t,
    lang,
    language,
    setLang,
    toggleLanguage,
    dir,
    isRTL,
    formatNumber,
  };
};
