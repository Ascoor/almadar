import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useLanguage } from '@/context/LanguageContext';
import {
  axisTick,
  chartMargin,
  tooltipStyle,
  makeTickFormatter,
} from './chartTheme';

function SmartTooltip({ active, payload, label, dir, formatNumber, lang }) {
  if (!active || !payload?.length) return null;

  const item = payload[0];
  const value = item?.value;

  return (
    <div
      dir={dir}
      style={tooltipStyle}
      className="rounded-xl px-3 py-2 text-sm"
    >
      <div className="font-semibold text-fg mb-1">{label}</div>
      <div className="text-muted-foreground">
        {typeof value === 'number'
          ? formatNumber(value, lang)
          : String(value ?? '—')}
      </div>
    </div>
  );
}

export default function BarChartBasic({
  data,
  xKey = 'x',
  yKey = 'y',
  height = '100%',
}) {
  const { lang, dir, formatNumber } = useLanguage();

  const safeData = Array.isArray(data) ? data : [];
  const yTick = useMemo(
    () => makeTickFormatter(formatNumber, lang),
    [formatNumber, lang],
  );

  return (
    <div style={{ height }} className="w-full min-w-0" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={safeData} barCategoryGap="22%" margin={chartMargin}>
          <CartesianGrid stroke="var(--chart-grid)" strokeOpacity={1} />

          <XAxis
            dataKey={xKey}
            tick={axisTick}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={12}
          />

          <YAxis
            tick={axisTick}
            tickFormatter={yTick}
            axisLine={false}
            tickLine={false}
            width={42}
          />

          <Tooltip
            cursor={{
              fill: 'color-mix(in oklab, var(--primary) 10%, transparent)',
            }}
            content={(props) => (
              <SmartTooltip
                {...props}
                dir={dir}
                formatNumber={formatNumber}
                lang={lang}
              />
            )}
          />

          <Bar
            dataKey={yKey}
            fill="url(#primaryGradient)"
            radius={[10, 10, 0, 0]}
            isAnimationActive={false} // يقلل flicker
            maxBarSize={44} // يحمي الموبايل
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
