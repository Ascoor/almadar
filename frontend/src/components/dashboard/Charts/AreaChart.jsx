import React from 'react';
import { AreaChart as ReAreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AreaChart({ data, xKey, yKey, dir = 'ltr' }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReAreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} reversed={dir === 'rtl'} />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey={yKey} stroke="var(--color-primary)" fill="var(--color-primary-light)" />
      </ReAreaChart>
    </ResponsiveContainer>
  );
}
