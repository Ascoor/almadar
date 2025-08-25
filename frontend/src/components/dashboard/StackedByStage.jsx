import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useThemeVars } from './useThemeVars';
import { useLang } from './useLang';

export default function StackedByStage({ data }) {
  const theme = useThemeVars();
  const { t, dir } = useLang();
  const stageLabels = {
    intake: 'Intake',
    investigation: 'Investigation',
    court: 'Court',
    closed: 'Closed'
  };

  return (
    <div className="w-full h-full" dir={dir} aria-label={t('byStage')}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ top: 20, left: 20, right: 20 }}>
          <XAxis type="number" stroke={theme.axis} />
          <YAxis dataKey="stage" type="category" stroke={theme.axis} tickFormatter={(v) => stageLabels[v] || v} />
          <Tooltip />
          <Bar dataKey="count" fill={theme.fills[2]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
