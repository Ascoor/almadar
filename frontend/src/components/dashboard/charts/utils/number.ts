
/**
 * Number formatting utilities with internationalization support
 */

interface NumberFormatOptions {
  locale?: string;
  style?: 'decimal' | 'currency' | 'percent';
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  notation?: 'standard' | 'scientific' | 'engineering' | 'compact';
}

/**
 * Format number with locale-aware formatting
 */
export function formatNumber(
  value: number,
  options: NumberFormatOptions = {}
): string {
  const {
    locale = 'ar-EG',
    style = 'decimal',
    currency = 'EGP',
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    notation = 'standard'
  } = options;

  return new Intl.NumberFormat(locale, {
    style,
    currency: style === 'currency' ? currency : undefined,
    minimumFractionDigits,
    maximumFractionDigits,
    notation
  }).format(value);
}

/**
 * Format percentage value
 */
export function formatPercent(value: number, locale = 'ar-EG'): string {
  return formatNumber(value, {
    locale,
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
  });
}

/**
 * Format currency value
 */
export function formatCurrency(
  value: number,
  currency = 'EGP',
  locale = 'ar-EG'
): string {
  return formatNumber(value, {
    locale,
    style: 'currency',
    currency
  });
}

/**
 * Format large numbers with compact notation
 */
export function formatCompact(value: number, locale = 'ar-EG'): string {
  return formatNumber(value, {
    locale,
    notation: 'compact',
    maximumFractionDigits: 1
  });
}

/**
 * Format delta/change percentage with sign
 */
export function formatDelta(value: number, locale = 'ar-EG'): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${formatPercent(value / 100, locale)}`;
}
