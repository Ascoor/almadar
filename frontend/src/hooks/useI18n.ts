import { useLanguage } from '@/context/LanguageContext'

export const useI18n = () => {
  const { lang, dir, isRTL, t, toggleLanguage, setLang, setLanguage } = useLanguage()

  return {
    lang,
    dir,
    isRTL,
    t,
    toggleLanguage,
    setLang,
    setLanguage,
  }
}

export default useI18n
