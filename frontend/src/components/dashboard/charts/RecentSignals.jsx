import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import dayjs from './utils/dates';

/**
 * List of recent analytical signals or notifications.
 * @param {{items: Array<{id: string|number, message: string, date: string}>}} props
 */
export default function RecentSignals({ items }) {
  const { i18n, t } = useTranslation();
  const dir = i18n.dir();

  return (
    <Card className="p-4" dir={dir} aria-label="recent-signals">
      <h3 className="text-lg font-semibold mb-2">{t('recentSignals')}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between border-b border-border pb-1">
            <span className="text-foreground">{item.message}</span>
            <span className="text-muted text-xs">{dayjs(item.date).fromNow()}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

RecentSignals.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      message: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
    })
  ).isRequired,
};
