import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { getPalette, tooltipStyle, legendStyle, chartMargin } from './chartTheme';

export default function PieChartBasic({ 
  data, 
  nameKey = "label", 
  valueKey = "value", 
  height = '100%',
  innerRadius = 60 
}) {
  return (
    <div style={{ height }} className="w-full min-w-0" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={chartMargin}>
          <Pie 
            data={data} 
            nameKey={nameKey} 
            dataKey={valueKey} 
            innerRadius={innerRadius} 
            outerRadius={90} 
            paddingAngle={3}
            strokeWidth={0}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={getPalette(8)[index % 8]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend verticalAlign="bottom" height={36} wrapperStyle={legendStyle} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
