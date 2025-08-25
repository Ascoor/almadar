import React from 'react';
import { useLang } from './useLang';

export default function RecentTable({ items }) {
  const { dir } = useLang();

  return (
    <div className="overflow-auto" dir={dir} aria-label="recent-items">
      <table className="min-w-full text-sm">
        <thead className="bg-[var(--color-card)] text-[var(--color-fg)]">
          <tr>
            <th className="p-2 text-start">ID</th>
            <th className="p-2 text-start">Type</th>
            <th className="p-2 text-start">Title</th>
            <th className="p-2 text-start">Client</th>
            <th className="p-2 text-start">Status</th>
            <th className="p-2 text-start">Created</th>
          </tr>
        </thead>
        <tbody>
          {items.map(it => (
            <tr key={it.id} className="border-b border-[var(--color-border)]">
              <td className="p-2">{it.id}</td>
              <td className="p-2">{it.type}</td>
              <td className="p-2">{it.title}</td>
              <td className="p-2">{it.client}</td>
              <td className="p-2">{it.status}</td>
              <td className="p-2">{it.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
