import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = [
  "hsl(172, 84%, 45%)", // Primary turquoise
  "hsl(172, 84%, 65%)", // Secondary mint  
  "hsl(84, 81%, 56%)",  // Accent lime
  "hsl(142, 71%, 45%)", // Green
  "hsl(200, 98%, 39%)"  // Blue
];

export default function PieChartBasic({ 
  data, 
  nameKey = "label", 
  valueKey = "value", 
  height = 300,
  innerRadius = 60 
}) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
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
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '12px',
              boxShadow: 'var(--glass-shadow)',
              color: 'hsl(var(--foreground))'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{
              fontSize: '12px',
              color: 'hsl(var(--muted-foreground))'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}