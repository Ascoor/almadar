
export const t = (key, language = 'ar') => {
  return translations[language]?.[key] || key;
};
export const formatNumber = (num, language = 'ar') => {
  if (language === 'ar') {
    return new Intl.NumberFormat('ar-EG').format(num);
  }
  return new Intl.NumberFormat('en-US').format(num);
};