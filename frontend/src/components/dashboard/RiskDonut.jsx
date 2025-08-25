import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useThemeVars } from './useThemeVars';
import { useLang } from './useLang';

export default function RiskDonut({ data }) {
  const theme = useThemeVars();
  const { t, dir } = useLang();
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const colors = [theme.fills[0], theme.fills[1], theme.fills[2]];

  return (
    <div className="w-full h-full" dir={dir} aria-label={t('riskLevels')}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="level"
            innerRadius={60}
            outerRadius={80}
            label={({ level }) => t(level)}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center mt-2 text-sm text-[var(--color-muted)]">{total}</div>
    </div>
  );
}
