import React from 'react';
import clsx from 'clsx';

export default function SmartButton({
  as: Comp = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center rounded-xl transition-all font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus-visible:ring-primary-400',
    outline: 'border border-primary-200 text-primary-700 hover:bg-primary-50',
    ghost: 'text-ink hover:bg-black/5 dark:hover:bg-white/5',
    danger: 'bg-danger hover:bg-red-700 text-white focus-visible:ring-red-400',
  };

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-base',
    lg: 'h-12 px-6 text-lg',
  };

  return (
    <Comp
      className={clsx(base, variants[variant], sizes[size], 'shadow-soft', className)}
      {...props}
    >
      {children}
    </Comp>
  );
}
