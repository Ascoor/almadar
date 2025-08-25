/**
 * Empty states for dashboard widgets.
 * i18n keys: 'dashboard.noData', 'dashboard.noResults'
 */

import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';

export function NoData() {
  const { t } = useTranslation();
  return (
    <Card className="p-8 text-center">{t('dashboard.noData')}</Card>
  );
}

export function NoResults() {
  const { t } = useTranslation();
  return <Card className="p-8 text-center">{t('dashboard.noResults')}</Card>;
}

