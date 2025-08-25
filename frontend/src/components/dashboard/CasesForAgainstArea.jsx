import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import { useThemeVars } from './useThemeVars';
import { useLang } from './useLang';

export default function CasesForAgainstArea({ data = [] }) {
  const theme = useThemeVars();
  const { t, dir } = useLang();

  return (
    <div className="w-full h-full" dir={dir} aria-label={t('casesForAgainst')}>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 20, left: 10, right: 10 }}>
          <CartesianGrid stroke={theme.grid} />
          <XAxis dataKey="month" stroke={theme.axis} tickFormatter={m => dayjs(m).format('MMM')} />
          <YAxis stroke={theme.axis} />
          <Tooltip labelFormatter={m => dayjs(m).format('MMMM YYYY')} />
          <Area type="monotone" dataKey="for_company" name={t('forCompany')} stackId="1" stroke={theme.strokes[0]} fill={theme.fills[0]} />
          <Area type="monotone" dataKey="against_company" name={t('againstCompany')} stackId="1" stroke={theme.strokes[1]} fill={theme.fills[1]} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
