import React from 'react';

export default function Toolbar({ filters, onChange, onReset }) {
  const handleChange = e => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  };
  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4" dir={filters.dir || 'ltr'}>
      <input
        type="date"
        name="from"
        value={filters.from || ''}
        onChange={handleChange}
        className="border rounded p-2"
      />
      <input
        type="date"
        name="to"
        value={filters.to || ''}
        onChange={handleChange}
        className="border rounded p-2"
      />
      <select name="region" value={filters.region || ''} onChange={handleChange} className="border rounded p-2">
        <option value="">All</option>
        <option value="TRP">Tripoli</option>
        <option value="BEN">Benghazi</option>
      </select>
      <select name="status" value={filters.status || ''} onChange={handleChange} className="border rounded p-2">
        <option value="">All</option>
        <option value="open">Open</option>
        <option value="closed">Closed</option>
      </select>
      <button onClick={onReset} className="ml-auto bg-primary text-white rounded px-3 py-2">Reset</button>
    </div>
  );
}
