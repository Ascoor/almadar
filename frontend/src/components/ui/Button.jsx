import React from 'react';
import clsx from 'clsx';

export default function Button({ as: Tag = 'button', className, variant = 'primary', ...props }) {
  return (
    <Tag
      className={clsx(
        'btn',
        variant === 'primary' && 'btn-primary',
        variant === 'outline' && 'btn-outline',
        variant === 'ghost' && 'btn-ghost',
        className
      )}
      {...props}
    />
  );
}
