import PropTypes from 'prop-types';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

/** Displayed when no data is available */
export function NoData({ message }) {
  const { t } = useTranslation();
  return (
    <Card className="p-8 text-center text-muted" aria-label="empty">
      {message || t('noData')}
    </Card>
  );
}

NoData.propTypes = {
  message: PropTypes.string,
};

/** Displayed when an error occurs */
export function ErrorState({ message }) {
  const { t } = useTranslation();
  return (
    <Card className="p-8 text-center text-destructive" aria-label="error">
      {message || t('error')}
    </Card>
  );
}

ErrorState.propTypes = {
  message: PropTypes.string,
};

export default { NoData, ErrorState };
