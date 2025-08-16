import React from 'react';
import clsx from 'clsx';

export default function Card({ className, children, ...props }) {
  return (
    <div className={clsx('card p-6', className)} {...props}>
      {children}
    </div>
  );
}
