import React from 'react';
import { LineChart as ReLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function LineChart({ data, xKey, yKey, dir = 'ltr' }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} reversed={dir === 'rtl'} />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey={yKey} stroke="var(--color-primary)" />
      </ReLineChart>
    </ResponsiveContainer>
  );
}
