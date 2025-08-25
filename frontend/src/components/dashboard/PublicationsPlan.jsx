import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import { useThemeVars } from './useThemeVars';
import { useLang } from './useLang';

export default function PublicationsPlan({ data = [] }) {
  const theme = useThemeVars();
  const { t, dir } = useLang();

  return (
    <div className="w-full h-full" dir={dir} aria-label={t('publicationsPlan')}>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data} margin={{ top: 20, left: 20, right: 20 }}>
          <CartesianGrid stroke={theme.grid} />
          <XAxis dataKey="month" stroke={theme.axis} tickFormatter={m => dayjs(m).format('MMM')} />
          <YAxis stroke={theme.axis} />
          <Tooltip labelFormatter={m => dayjs(m).format('MMMM YYYY')} />
          <Legend />
          <Bar dataKey="actual" name="Actual" fill={theme.fills[3]} />
          <Line dataKey="planned" name="Planned" stroke={theme.strokes[4]} strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
