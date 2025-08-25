import React from 'react';
import { PieChart as RePieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
];

export default function PieChart({ data, dataKey = 'value' }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RePieChart>
        <Pie data={data} dataKey={dataKey} label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </RePieChart>
    </ResponsiveContainer>
  );
}
