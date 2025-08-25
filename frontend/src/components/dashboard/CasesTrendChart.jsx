/**
 * CasesTrendChart.jsx
 * Stacked area chart of cases trend by status.
 *
 * i18n keys: 'dashboard.trend', 'dashboard.new', 'dashboard.inProgress', 'dashboard.closed'
 */

import { useTranslation } from 'react-i18next';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend } from 'recharts';

/**
 * @typedef {{ month: string, new: number, inProgress: number, closed: number }} TrendPoint
 */

/**
 * @param {{ data: TrendPoint[] }} props
 */
export default function CasesTrendChart({ data }) {
  const { t } = useTranslation();
  return (
    <div className="bg-card rounded-2xl shadow-lg border border-border p-4" aria-label={t('dashboard.trend')}>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ left: 0, right: 0 }}>
          <defs>
            <linearGradient id="new" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="rgb(var(--primary))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="rgb(var(--primary))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="inProgress" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="rgb(var(--secondary))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="rgb(var(--secondary))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="closed" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="rgb(var(--accent))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="rgb(var(--accent))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" tickFormatter={(m) => m.slice(5)} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="new" stackId="1" stroke="rgb(var(--primary))" fill="url(#new)" />
          <Area type="monotone" dataKey="inProgress" stackId="1" stroke="rgb(var(--secondary))" fill="url(#inProgress)" />
          <Area type="monotone" dataKey="closed" stackId="1" stroke="rgb(var(--accent))" fill="url(#closed)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export { type TrendPoint };
