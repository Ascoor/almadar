import React from 'react';
import clsx from 'clsx';

export default function ProCard({ title, subtitle, children, className, footer }) {
  return (
    <section className={clsx('card-surface rounded-xl2 p-6 animate-fade-up', className)}>
      {(title || subtitle) && (
        <header className="mb-4">
          {title && <h3 className="text-xl font-semibold">{title}</h3>}
          {subtitle && <p className="text-muted mt-1">{subtitle}</p>}
        </header>
      )}
      <div>{children}</div>
      {footer && <footer className="mt-6 pt-4 border-t border-black/5">{footer}</footer>}
    </section>
  );
}
