import React from 'react';
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useThemeVars } from './useThemeVars';
import { useLang } from './useLang';

export default function TrendArea({ data }) {
  const theme = useThemeVars();
  const { t, dir } = useLang();

  return (
    <div className="w-full h-full" dir={dir} aria-label={t('casesOpenedClosed')}>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={theme.grid} />
          <XAxis dataKey="date" stroke={theme.axis} />
          <YAxis stroke={theme.axis} />
          <Tooltip />
          <Area type="monotone" dataKey="opened" stackId="1" stroke={theme.strokes[0]} fill={theme.fills[0]} name={t('opened')} />
          <Area type="monotone" dataKey="closed" stackId="1" stroke={theme.strokes[1]} fill={theme.fills[1]} name={t('closed')} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
