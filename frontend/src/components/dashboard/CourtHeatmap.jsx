import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { useThemeVars } from './useThemeVars';
import { useLang } from './useLang';

export default function CourtHeatmap({ data }) {
  const theme = useThemeVars();
  const { t, dir } = useLang();

  const grouped = useMemo(() => {
    const map = {};
    data.forEach(d => {
      const month = dayjs(d.date).format('YYYY-MM');
      if (!map[month]) map[month] = [];
      map[month].push(d);
    });
    return map;
  }, [data]);

  const color = count => {
    if (count === 0) return theme.fills[3];
    if (count === 1) return theme.fills[2];
    if (count === 2) return theme.fills[1];
    return theme.fills[0];
  };

  return (
    <div dir={dir} className="space-y-4" aria-label={t('courtHeatmap')}>
      {Object.entries(grouped).map(([month, days]) => (
        <div key={month}>
          <h4 className="mb-2 text-sm font-medium">
            {dayjs(month).format('MMMM YYYY')}
          </h4>
          <div className="grid grid-cols-7 gap-1">
            {days.map(d => (
              <div
                key={d.date}
                title={`${d.date}: ${d.sessions}`}
                className="w-6 h-6"
                style={{ background: color(d.sessions) }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
