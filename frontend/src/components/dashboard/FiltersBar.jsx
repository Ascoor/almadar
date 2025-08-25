import React from 'react';
import { useLang } from './useLang';

export default function FiltersBar({ filters, onChange }) {
  const { t, dir } = useLang();

  const handleSelect = (e) => {
    onChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div
      dir={dir}
      className="sticky top-0 z-10 backdrop-blur bg-[var(--color-bg)/0.8] p-4 flex flex-wrap gap-2 border-b border-[var(--color-border)]"
      aria-label={t('filters')}
    >
      <label className="text-sm">
        {t('dateRange')}
        <input
          type="date"
          name="dateRange"
          className="ms-2 p-1 border rounded bg-[var(--color-card)]"
          onChange={handleSelect}
        />
      </label>
      <label className="text-sm">
        {t('region')}
        <select
          name="region"
          className="ms-2 p-1 border rounded bg-[var(--color-card)]"
          onChange={handleSelect}
        >
          <option value="">{t('all')}</option>
          <option value="tripoli">Tripoli</option>
          <option value="benghazi">Benghazi</option>
          <option value="misrata">Misrata</option>
        </select>
      </label>
    </div>
  );
}
