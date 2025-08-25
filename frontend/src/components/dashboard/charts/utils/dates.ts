
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ar';

// Configure dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);

// Set default timezone
dayjs.tz.setDefault('Africa/Cairo');

/**
 * Date formatting utilities
 */

/**
 * Format date for display
 */
export function formatDate(
  date: string | Date,
  format = 'DD/MM/YYYY',
  locale = 'ar'
): string {
  return dayjs(date).locale(locale).format(format);
}

/**
 * Format date with time
 */
export function formatDateTime(
  date: string | Date,
  format = 'DD/MM/YYYY HH:mm',
  locale = 'ar'
): string {
  return dayjs(date).locale(locale).format(format);
}

/**
 * Get relative time
 */
export function getRelativeTime(
  date: string | Date,
  locale = 'ar'
): string {
  return dayjs(date).locale(locale).fromNow();
}

/**
 * Get date range for chart filters
 */
export function getDateRange(months = 12): { from: string; to: string } {
  const to = dayjs().tz('Africa/Cairo');
  const from = to.subtract(months, 'month');
  
  return {
    from: from.format('YYYY-MM-DD'),
    to: to.format('YYYY-MM-DD')
  };
}

/**
 * Parse and validate date string
 */
export function parseDate(dateStr: string): dayjs.Dayjs | null {
  const parsed = dayjs(dateStr);
  return parsed.isValid() ? parsed : null;
}

/**
 * Generate month labels for time series
 */
export function generateMonthLabels(
  startDate: string,
  endDate: string,
  locale = 'ar'
): string[] {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const labels: string[] = [];
  
  let current = start;
  while (current.isBefore(end) || current.isSame(end)) {
    labels.push(current.locale(locale).format('MMM YYYY'));
    current = current.add(1, 'month');
  }
  
  return labels;
}
