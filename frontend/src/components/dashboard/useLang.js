import { useLanguage } from '@/context/LanguageContext';

export function useLang() {
  try {
    return useLanguage();
  } catch {
    return { t: k => k, dir: 'ltr', lang: 'en' };
  }
}
