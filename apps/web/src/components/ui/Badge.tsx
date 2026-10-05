'use client';

import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'default' | 'sm';
  /** Optional icon element to render before text */
  icon?: React.ReactNode;
}

export function Badge({
  size = 'default',
  icon,
  className = '',
  children,
  ...props
}: BadgeProps) {
  const baseClass = size === 'sm' ? 'badge-sm' : 'badge';

  return (
    <span className={`${baseClass} ${className}`} {...props}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
