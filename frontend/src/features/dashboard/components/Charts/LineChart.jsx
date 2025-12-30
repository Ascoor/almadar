import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import {
  getPalette,
  tooltipStyle,
  legendStyle,
  chartMargin,
} from './chartTheme';

export default function PieChartBasic({
  data,
  nameKey = 'label',
  valueKey = 'value',
  height = '100%',
  innerRadius = 60,
  colorsCount = 8,
}) {
  const palette = useMemo(() => getPalette(colorsCount), [colorsCount]);
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div style={{ height }} className="w-full min-w-0" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={chartMargin}>
          <Pie
            data={safeData}
            nameKey={nameKey}
            dataKey={valueKey}
            innerRadius={innerRadius}
            outerRadius={90}
            paddingAngle={3}
            strokeWidth={0}
            isAnimationActive={false} // optional: يقلل flicker
          >
            {safeData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={palette[index % palette.length]}
              />
            ))}
          </Pie>

          <Tooltip contentStyle={tooltipStyle} />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={legendStyle}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
