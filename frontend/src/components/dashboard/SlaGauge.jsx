import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useThemeVars } from './useThemeVars';
import { useLang } from './useLang';

export default function SlaGauge({ value }) {
  const theme = useThemeVars();
  const { t, dir } = useLang();
  const data = [
    { name: 'value', value },
    { name: 'rest', value: 100 - value }
  ];
  let color = theme.fills[0];
  if (value < 80) color = 'var(--color-warning)';
  else if (value > 95) color = 'var(--color-primary)';
  else color = 'var(--color-success)';

  return (
    <div className="w-full h-full" dir={dir} aria-label={t('sla')}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            startAngle={180}
            endAngle={0}
            innerRadius={70}
            outerRadius={80}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill={theme.fills[3]} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center -mt-24 text-xl font-bold text-[var(--color-fg)]">{value}%</div>
    </div>
  );
}
