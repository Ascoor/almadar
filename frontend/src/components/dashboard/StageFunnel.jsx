import React from 'react';
import { FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer } from 'recharts';
import { useThemeVars } from './useThemeVars';
import { useLang } from './useLang';

const stageNames = {
  intake: { en: 'Intake', ar: 'إدخال' },
  investigation: { en: 'Investigation', ar: 'تحقيق' },
  court: { en: 'Court', ar: 'محكمة' },
  closed: { en: 'Closed', ar: 'إغلاق' }
};

export default function StageFunnel({ data = [] }) {
  const theme = useThemeVars();
  const { dir, lang } = useLang();
  const entries = data.map((d, i) => ({
    ...d,
    name: stageNames[d.stage]?.[lang] || d.stage,
    fill: theme.fills[i % theme.fills.length]
  }));

  return (
    <div className="w-full h-full" dir={dir} aria-label="stage-funnel">
      <ResponsiveContainer width="100%" height={300}>
        <FunnelChart>
          <Tooltip />
          <Funnel data={entries} dataKey="count" isAnimationActive>
            <LabelList dataKey="name" position="right" fill={theme.text} />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
}
