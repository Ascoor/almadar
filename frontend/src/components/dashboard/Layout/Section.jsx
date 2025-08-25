import React from 'react';

export default function Section({ title, description, children }) {
  return (
    <section className="space-y-2" aria-label={title}>
      {title && <h2 className="text-xl font-semibold">{title}</h2>}
      {description && <p className="text-sm text-muted">{description}</p>}
      {children}
    </section>
  );
}
