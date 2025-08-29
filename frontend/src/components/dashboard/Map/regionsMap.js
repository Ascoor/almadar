// Minimal region code mapping for Libya to reconcile API + GeoJSON
// Extend as needed by adding more items with the exact GeoJSON name in `nameEn`

export const REGIONS = [
  { code: 'TRP', nameEn: 'Tripoli', nameAr: 'طرابلس' },
  { code: 'BEN', nameEn: 'Benghazi', nameAr: 'بنغازي' },
  { code: 'MIS', nameEn: 'Misrata', nameAr: 'مصراتة' },
  { code: 'ZAW', nameEn: 'Zawiya', nameAr: 'الزاوية' },
  { code: 'SBH', nameEn: 'Sebha', nameAr: 'سبها' },
  { code: 'BAY', nameEn: 'Al Bayda', nameAr: 'البيضاء' },
  { code: 'NAL', nameEn: 'Nalut', nameAr: 'نالوت' },
  { code: 'TOB', nameEn: 'Tobruk', nameAr: 'طبرق' },
  { code: 'DER', nameEn: 'Derna', nameAr: 'درنة' },
];

const byEn = new Map(REGIONS.map(r => [r.nameEn.toLowerCase(), r.code]));
const byAr = new Map(REGIONS.map(r => [r.nameAr, r.code]));
const byCode = new Map(REGIONS.map(r => [r.code, r]));

export function getRegionCodeByName(name) {
  if (!name) return undefined;
  const key = String(name).toLowerCase();
  return byEn.get(key) || byAr.get(name);
}

export function getLocalizedNameByCode(code, lang = 'ar') {
  const r = byCode.get(code);
  if (!r) return undefined;
  return lang === 'ar' ? r.nameAr : r.nameEn;
}

