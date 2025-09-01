import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useLanguage } from "@/context/LanguageContext";
import { axisTick, tooltipStyle, chartMargin } from "./chartTheme";

export default function BarChartBasic({ 
  data, 
  xKey = "x", 
  yKey = "y", 
  height = '100%'
}) {
  const { lang, formatNumber } = useLanguage();
  return (
    <div style={{ height }} className="w-full min-w-0" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="20%" margin={chartMargin}>
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
          <Bar 
            dataKey={yKey} 
            fill="url(#primaryGradient)" 
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
