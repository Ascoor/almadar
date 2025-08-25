import React from 'react';
import { PieChart as RePieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#0ea5e9', '#0d9488', '#9333ea', '#f59e0b'];

export default function PieChart({ data, dataKey = 'value' }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RePieChart>
        <Pie data={data} dataKey={dataKey} fill="var(--color-primary)" label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </RePieChart>
    </ResponsiveContainer>
  );
}
