import React from 'react';

export default function EmptyState({ message = 'No data', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center text-[var(--color-muted)]">
      <p className="mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1 rounded bg-[var(--color-primary)] text-white"
        >
          Retry
        </button>
      )}
    </div>
  );
}
