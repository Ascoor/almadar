/**
 * SLADonut.jsx
 * Donut chart for SLA performance.
 * i18n keys: 'dashboard.onTime', 'dashboard.breached'
 */

import { useTranslation } from 'react-i18next';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

/**
 * @param {{ data: { onTime: number, breached: number } }} props
 */
export default function SLADonut({ data }) {
  const { t } = useTranslation();
  const chartData = [
    { name: t('dashboard.onTime'), value: data.onTime, color: 'rgb(var(--success))' },
    { name: t('dashboard.breached'), value: data.breached, color: 'rgb(var(--destructive))' },
  ];
  return (
    <div className="bg-card rounded-2xl shadow-lg border border-border p-4" aria-label={t('dashboard.sla')}>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={chartData} dataKey="value" innerRadius={60} outerRadius={100} stroke="none">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
