import React from 'react';

export default function CompactTable({ rows }) {
  return (
    <table className="min-w-full text-sm">
      <thead>
        <tr className="text-left border-b">
          <th className="p-2">Title</th>
          <th className="p-2">Type</th>
          <th className="p-2">Region</th>
          <th className="p-2">Status</th>
          <th className="p-2">Date</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.id} className="border-b last:border-0">
            <td className="p-2">{r.title}</td>
            <td className="p-2">{r.type}</td>
            <td className="p-2">{r.region}</td>
            <td className="p-2">{r.status}</td>
            <td className="p-2">{r.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
