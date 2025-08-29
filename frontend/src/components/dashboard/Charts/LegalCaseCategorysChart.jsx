import React, { useMemo } from 'react';
import { ResponsiveContainer, RadialBarChart, RadialBar, Legend, Tooltip } from 'recharts';
import { useLanguage } from '@/context/LanguageContext';
import { getPalette, tooltipStyle, legendStyle, chartMargin } from './chartTheme';

// Radial bars alternative to the pie — same data idea, unique look
// Tokenized colors, RTL-safe rendering, and AR/EN demo labels

const demoData = {
  ar: [
    { name: 'تجارية', value: 1200 },
    { name: 'جنائية', value: 800 },
    { name: 'عمالية', value: 500 },
    { name: 'أحوال شخصية', value: 450 },
    { name: 'إدارية', value: 350 },
  ],
  en: [
    { name: 'Commercial', value: 1200 },
    { name: 'Criminal', value: 800 },
    { name: 'Labor', value: 500 },
    { name: 'Personal', value: 450 },
    { name: 'Administrative', value: 350 },
  ],
};

export default function LegalCaseCategorysChart({ height = '100%' }) {
  const { lang, formatNumber } = useLanguage();
  const palette = getPalette(8);

  const data = useMemo(() => {
    const src = lang === 'ar' ? demoData.ar : demoData.en;
    // RadialBarChart expects an angle mapping; keep original values
    return src.map((d, i) => ({ ...d, fill: palette[i % palette.length] }));
  }, [lang, palette]);

  return (
    <div style={{ height }} className="w-full min-w-0" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          data={data}
          innerRadius={20}
          outerRadius={110}
          startAngle={90}
          endAngle={-270}
          margin={chartMargin}
        >
          <RadialBar
            background
            dataKey="value"
            cornerRadius={6}
            minAngle={4}
            clockWise
            label={{
              position: 'insideStart',
              fill: 'var(--fg)',
              fontSize: 11,
              formatter: (v) => (typeof v === 'number' ? formatNumber(v, lang) : v),
            }}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v) => (typeof v === 'number' ? formatNumber(v, lang) : v)}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={legendStyle}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}

