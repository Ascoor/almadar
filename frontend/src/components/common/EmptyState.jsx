import React from 'react';

export default function EmptyState({ message = 'No data', className = '' }) {
  return (
    <div className={`text-center p-8 text-gray-500 ${className}`}>{message}</div>
  );
}
