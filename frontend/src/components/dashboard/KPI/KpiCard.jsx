import React from 'react';

function KpiCard({ label, value }) {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm text-center" role="group" aria-label={label}>
      <div className="text-sm text-muted mb-1">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

export default React.memo(KpiCard);
