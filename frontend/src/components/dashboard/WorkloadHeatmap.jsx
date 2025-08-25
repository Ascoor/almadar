/**
 * WorkloadHeatmap.jsx
 * Weekly workload heatmap (Mon-Sun x AM/PM/EV).
 * i18n keys: 'dashboard.workload'
 */

import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

/**
 * @typedef {{ weekday: number, slot: 'AM'|'PM'|'EV', value: number }} WorkloadPoint
 */

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const slots = ['AM', 'PM', 'EV'];

/**
 * @param {{ data: WorkloadPoint[] }} props
 */
export default function WorkloadHeatmap({ data }) {
  const { t } = useTranslation();
  const grid = Array.from({ length: 7 }, () => ({ AM: 0, PM: 0, EV: 0 }));
  data.forEach(({ weekday, slot, value }) => {
    grid[weekday][slot] = value;
  });

  return (
    <section className="bg-card rounded-2xl shadow-lg border border-border p-4" aria-label={t('dashboard.workload')}>
      <div className="grid grid-cols-8 gap-1 text-center">
        <div></div>
        {weekdays.map((d) => (
          <div key={d} className="text-xs font-medium">
            {d}
          </div>
        ))}
        {slots.map((slot) => (
          <Fragment key={slot}>
            <div className="text-xs font-medium self-center">{slot}</div>
            {grid.map((col, i) => {
              const val = col[slot];
              const intensity = val / 10 + 0.1;
              return (
                <div
                  key={`${slot}-${i}`}
                  className={cn('w-full aspect-square rounded', 'bg-primary')}
                  style={{ opacity: intensity }}
                  title={`${weekdays[i]} ${slot}: ${val}`}
                />
              );
            })}
          </Fragment>
        ))}
      </div>
    </section>
  );
}

export { type WorkloadPoint };
