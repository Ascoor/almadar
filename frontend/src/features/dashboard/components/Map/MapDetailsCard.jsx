import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { topCities as TOP_CITIES } from './topCities';

export default function MapDetailsCard() {
  const { lang, formatNumber, t } = useLanguage();
  const cities = TOP_CITIES.map(c => ({ name: lang === 'ar' ? c.ar : c.en, ...c }));

  const totalCases = cities.reduce((s, c) => s + c.cases, 0);
  const totalContracts = cities.reduce((s, c) => s + c.contracts, 0);

  return (
    <div className="card card-p">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="text-base md:text-lg font-semibold">{t('geographicDistribution', lang)}</h3>
        <div className="flex items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-1"><i className="inline-block w-3 h-3 rounded-full" style={{ background: 'var(--chart-1)' }} />{t('cases', lang)}: {formatNumber(totalCases, lang)}</span>
          <span className="inline-flex items-center gap-1"><i className="inline-block w-3 h-3 rounded-full" style={{ background: 'var(--chart-3)' }} />{t('contracts', lang)}: {formatNumber(totalContracts, lang)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cities.map((c, idx) => (
          <div key={idx} className="flex items-center justify-between rounded-xl border border-border bg-card/60 px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-muted text-xs font-semibold">{idx + 1}</span>
              <span className="font-medium">{c.name}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1"><i className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: 'var(--chart-1)' }} />{formatNumber(c.cases, lang)}</span>
              <span className="inline-flex items-center gap-1"><i className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: 'var(--chart-3)' }} />{formatNumber(c.contracts, lang)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

