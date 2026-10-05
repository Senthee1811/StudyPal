'use client';

import React from 'react';

export type CardVariant = 'default' | 'mint' | 'teal' | 'blush' | 'bordered';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  /** Padding override (default 24px via p-3 = 24px in our spacing) */
  compact?: boolean;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'card',
  mint: 'card-mint',
  teal: 'card-teal',
  blush: 'card-blush',
  bordered: 'card-bordered',
};

export function Card({
  variant = 'default',
  compact = false,
  className = '',
  children,
  ...props
}: CardProps) {
  const padding = compact ? 'p-2' : '';
  const classes = `${variantClasses[variant]} ${padding} ${className}`.trim();

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
