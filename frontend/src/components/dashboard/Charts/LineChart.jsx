import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useLanguage } from "@/context/LanguageContext";
import { axisTick, tooltipStyle, chartMargin } from "./chartTheme";

export default function LineChartBasic({ 
  data, 
  xKey = "x", 
  yKey = "y", 
  height = '100%'
}) {
  const { lang, formatNumber } = useLanguage();
  return (
    <div style={{ height }} className="w-full min-w-0" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={chartMargin}>
          <CartesianGrid stroke="var(--chart-grid)" strokeOpacity={1} />
          <XAxis 
            dataKey={xKey} 
            tick={axisTick}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={axisTick}
            tickFormatter={(v) => (typeof v === 'number' ? formatNumber(v, lang) : v)}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            contentStyle={tooltipStyle}
          />
          <Line 
            type="monotone" 
            dataKey={yKey} 
            stroke="url(#primaryGradient)" 
            strokeWidth={3} 
            dot={false}
            activeDot={{ 
              r: 6, 
              fill: 'var(--primary)',
              stroke: 'var(--bg)',
              strokeWidth: 2
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
