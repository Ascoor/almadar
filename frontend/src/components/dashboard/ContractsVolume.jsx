import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import { useThemeVars } from './useThemeVars';
import { useLang } from './useLang';

const formatValue = v => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return v;
};

export default function ContractsVolume({ data = [] }) {
  const theme = useThemeVars();
  const { t, dir } = useLang();

  return (
    <div className="w-full h-full" dir={dir} aria-label={t('contractsVolume')}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, left: 20, right: 20 }}>
          <CartesianGrid stroke={theme.grid} />
          <XAxis dataKey="month" stroke={theme.axis} tickFormatter={m => dayjs(m).format('MMM')} />
          <YAxis stroke={theme.axis} tickFormatter={formatValue} />
          <Tooltip formatter={formatValue} labelFormatter={m => dayjs(m).format('MMMM YYYY')} />
          <Legend />
          <Bar dataKey="international_value" name="International" fill={theme.fills[0]} />
          <Bar dataKey="domestic_value" name="Domestic" fill={theme.fills[1]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
