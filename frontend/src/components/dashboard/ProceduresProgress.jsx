import React from 'react';
import { useThemeVars } from './useThemeVars';
import { useLang } from './useLang';

export default function ProceduresProgress({ data = [] }) {
  const theme = useThemeVars();
  const { dir } = useLang();
  const max = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="space-y-2" dir={dir} aria-label="procedures-progress">
      {data.map((d, i) => (
        <div key={d.step} className="flex items-center text-sm">
          <span className="w-32">{dir === 'rtl' ? d.label_ar : d.label_en}</span>
          <div className="flex-1 bg-[var(--color-border)] h-3 rounded ms-2 me-2">
            <div
              className="h-3 rounded"
              style={{ width: `${(d.count / max) * 100}%`, background: theme.fills[i % theme.fills.length] }}
            />
          </div>
          <span className="w-8 text-end">{d.count}</span>
        </div>
      ))}
    </div>
  );
}
