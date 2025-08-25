import React from 'react';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function BarChart({ data, xKey, yKey }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Bar dataKey={yKey} fill="var(--color-primary)" />
      </ReBarChart>
    </ResponsiveContainer>
  );
}
