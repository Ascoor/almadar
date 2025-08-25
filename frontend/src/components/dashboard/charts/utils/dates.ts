import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/ar';

// Configure dayjs with Cairo timezone as default
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Africa/Cairo');

export default dayjs;

export function formatDate(date: string | Date, format = 'YYYY-MM-DD', locale = 'en'): string {
  return dayjs(date).locale(locale).tz().format(format);
}

export function formatMonth(date: string | Date, locale = 'en'): string {
  return dayjs(date).locale(locale).tz().format('MMM YYYY');
}
