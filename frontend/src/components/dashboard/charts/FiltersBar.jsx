import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

/**
 * Sticky bar that exposes dashboard filters.
 * @param {{filters: import('./types').Filters, onChange: Function}} props
 */
export default function FiltersBar({ filters, onChange }) {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();

  const handleInput = (e) => {
    onChange({ [e.target.name]: e.target.value });
  };

  return (
    <div dir={dir} className="sticky top-0 z-10 bg-bg p-4 shadow">
      <div className="grid gap-2 md:grid-cols-6" aria-label="dashboard-filters">
        <Input
          type="date"
          name="dateFrom"
          value={filters.dateFrom || ''}
          onChange={handleInput}
          aria-label={t('filters.dateFrom')}
        />
        <Input
          type="date"
          name="dateTo"
          value={filters.dateTo || ''}
          onChange={handleInput}
          aria-label={t('filters.dateTo')}
        />
        <Select onValueChange={(v) => onChange({ region: v })} value={filters.region || ''}>
          <SelectTrigger>
            <SelectValue placeholder={t('filters.region')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mena">{t('regions.mena')}</SelectItem>
            <SelectItem value="emea">{t('regions.emea')}</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="search"
          name="search"
          value={filters.search || ''}
          onChange={handleInput}
          placeholder={t('filters.search')}
        />
        <Button onClick={() => onChange({})}>{t('filters.reset')}</Button>
      </div>
    </div>
  );
}

FiltersBar.propTypes = {
  filters: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
