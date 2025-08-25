import React from 'react';

export default function ChartCard({ title, children }) {
  return (
    <section className="bg-card rounded-2xl p-4 shadow-sm" aria-label={title}>
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      <div className="h-64 w-full">{children}</div>
    </section>
  );
}
