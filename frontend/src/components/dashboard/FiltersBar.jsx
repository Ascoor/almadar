/**
 * FiltersBar.jsx
 * Sticky filters row.
 * i18n keys: 'dashboard.filters', 'dashboard.dateRange', 'dashboard.team', 'dashboard.entity',
 * 'dashboard.status', 'dashboard.court'
 */

import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';

/**
 * @param {{ onChange?: (f:Record<string,any>)=>void }} props
 */
export default function FiltersBar({ onChange }) {
  const { t } = useTranslation();
  const handle = (field) => (value) => onChange?.({ [field]: value });
  return (
    <Card className="sticky top-16 z-30 backdrop-blur border border-border rounded-2xl p-2 flex flex-wrap gap-2">
      <Select onValueChange={handle('range')}>
        <SelectTrigger className="w-32">{t('dashboard.dateRange')}</SelectTrigger>
        <SelectContent>
          <SelectItem value="30">30</SelectItem>
          <SelectItem value="90">90</SelectItem>
        </SelectContent>
      </Select>
      <Select onValueChange={handle('team')}>
        <SelectTrigger className="w-32">{t('dashboard.team')}</SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('dashboard.all')}</SelectItem>
        </SelectContent>
      </Select>
      <Select onValueChange={handle('entity')}>
        <SelectTrigger className="w-32">{t('dashboard.entity')}</SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('dashboard.all')}</SelectItem>
        </SelectContent>
      </Select>
      <Select onValueChange={handle('status')}>
        <SelectTrigger className="w-32">{t('dashboard.status')}</SelectTrigger>
        <SelectContent>
          <SelectItem value="open">{t('dashboard.open')}</SelectItem>
          <SelectItem value="closed">{t('dashboard.closed')}</SelectItem>
        </SelectContent>
      </Select>
      <Select onValueChange={handle('court')}>
        <SelectTrigger className="w-32">{t('dashboard.court')}</SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('dashboard.all')}</SelectItem>
        </SelectContent>
      </Select>
    </Card>
  );
}
