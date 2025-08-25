
/**
 * Geographic utilities for world map and country data
 */

// ISO2 to ISO3 country code mapping
export const ISO2_TO_ISO3: Record<string, string> = {
  'EG': 'EGY',
  'US': 'USA',
  'SA': 'SAU',
  'AE': 'ARE',
  'GB': 'GBR',
  'DE': 'DEU',
  'FR': 'FRA',
  'IT': 'ITA',
  'ES': 'ESP',
  'CN': 'CHN',
  'JP': 'JPN',
  'IN': 'IND',
  'RU': 'RUS',
  'BR': 'BRA',
  'AU': 'AUS',
  'CA': 'CAN',
  'MX': 'MEX',
  // Add more mappings as needed
};

// Country names in Arabic and English
export const COUNTRY_NAMES: Record<string, { ar: string; en: string }> = {
  'EGY': { ar: 'مصر', en: 'Egypt' },
  'USA': { ar: 'الولايات المتحدة', en: 'United States' },
  'SAU': { ar: 'السعودية', en: 'Saudi Arabia' },
  'ARE': { ar: 'الإمارات', en: 'United Arab Emirates' },
  'GBR': { ar: 'المملكة المتحدة', en: 'United Kingdom' },
  'DEU': { ar: 'ألمانيا', en: 'Germany' },
  'FRA': { ar: 'فرنسا', en: 'France' },
  'ITA': { ar: 'إيطاليا', en: 'Italy' },
  'ESP': { ar: 'إسبانيا', en: 'Spain' },
  'CHN': { ar: 'الصين', en: 'China' },
  'JPN': { ar: 'اليابان', en: 'Japan' },
  'IND': { ar: 'الهند', en: 'India' },
  'RUS': { ar: 'روسيا', en: 'Russia' },
  'BRA': { ar: 'البرازيل', en: 'Brazil' },
  'AUS': { ar: 'أستراليا', en: 'Australia' },
  'CAN': { ar: 'كندا', en: 'Canada' },
  'MEX': { ar: 'المكسيك', en: 'Mexico' },
};

/**
 * Convert ISO2 to ISO3 country code
 */
export function iso2ToIso3(iso2: string): string {
  return ISO2_TO_ISO3[iso2.toUpperCase()] || iso2;
}

/**
 * Get country name by ISO3 code and locale
 */
export function getCountryName(
  iso3: string,
  locale: 'ar' | 'en' = 'ar'
): string {
  const country = COUNTRY_NAMES[iso3.toUpperCase()];
  return country ? country[locale] : iso3;
}

/**
 * Load and parse world topology data
 */
export async function loadWorldTopology() {
  try {
    // This would normally load from a CDN or local file
    const response = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/world-110m.json');
    return await response.json();
  } catch (error) {
    console.error('Failed to load world topology:', error);
    return null;
  }
}

/**
 * Geographic projection settings
 */
export const GEO_CONFIG = {
  projection: 'geoNaturalEarth1',
  scale: 140,
  center: [0, 20] as [number, number],
};

/**
 * Calculate bubble radius based on value
 */
export function calculateBubbleRadius(
  value: number,
  minValue: number,
  maxValue: number,
  minRadius = 4,
  maxRadius = 20
): number {
  if (maxValue === minValue) return minRadius;
  
  const ratio = (value - minValue) / (maxValue - minValue);
  return minRadius + (maxRadius - minRadius) * Math.sqrt(ratio);
}
