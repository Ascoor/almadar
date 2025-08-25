import React from 'react';
import { useLang } from './useLang';

// simple static options for demo purposes
const regions = [
  { id: 'tripoli', label: 'Tripoli' },
  { id: 'benghazi', label: 'Benghazi' },
  { id: 'misrata', label: 'Misrata' }
];
const risks = [
  { id: 'high', label: 'High' },
  { id: 'medium', label: 'Medium' },
  { id: 'low', label: 'Low' }
];
const types = [
  { id: 'case', label: 'Case' },
  { id: 'contract', label: 'Contract' },
  { id: 'consultation', label: 'Consultation' }
];
const contractKinds = [
  { id: 'international', label: 'International' },
  { id: 'domestic', label: 'Domestic' }
];

export default function FiltersBar({ filters, onChange }) {
  const { t, dir } = useLang();

  const update = (name, value) => {
    onChange({ ...filters, [name]: value });
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
          className="ms-2 p-1 border rounded bg-[var(--color-card)]"
          value={filters.dateRange || ''}
          onChange={e => update('dateRange', e.target.value)}
        />
      </label>
      <label className="text-sm">
        {t('region')}
        <select
          className="ms-2 p-1 border rounded bg-[var(--color-card)]"
          value={filters.regionIds[0] || ''}
          onChange={e => update('regionIds', e.target.value ? [e.target.value] : [])}
        >
          <option value="">{t('all')}</option>
          {regions.map(r => (
            <option key={r.id} value={r.id}>{r.label}</option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        {t('risk')}
        <select
          className="ms-2 p-1 border rounded bg-[var(--color-card)]"
          value={filters.risk[0] || ''}
          onChange={e => update('risk', e.target.value ? [e.target.value] : [])}
        >
          <option value="">{t('all')}</option>
          {risks.map(r => (
            <option key={r.id} value={r.id}>{r.label}</option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        {t('type')}
        <select
          className="ms-2 p-1 border rounded bg-[var(--color-card)]"
          value={filters.types[0] || ''}
          onChange={e => update('types', e.target.value ? [e.target.value] : [])}
        >
          <option value="">{t('all')}</option>
          {types.map(r => (
            <option key={r.id} value={r.id}>{r.label}</option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        contract
        <select
          className="ms-2 p-1 border rounded bg-[var(--color-card)]"
          value={filters.contractKind[0] || ''}
          onChange={e => update('contractKind', e.target.value ? [e.target.value] : [])}
        >
          <option value="">{t('all')}</option>
          {contractKinds.map(r => (
            <option key={r.id} value={r.id}>{r.label}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
