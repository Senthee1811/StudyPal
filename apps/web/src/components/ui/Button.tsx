'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'mint' | 'teal' | 'blush';
  size?: 'default' | 'compact' | 'sm';
  /** Show a leading arrow glyph (primary buttons) */
  arrow?: boolean;
  /** Render as an anchor (for Next.js Link wrapper) */
  asChild?: boolean;
}

const variantClasses: Record<string, string> = {
  primary: 'btn-primary',
  'primary-compact': 'btn-primary-compact',
  outline: 'btn-outline',
  mint: 'btn-mint',
  teal: 'btn-teal',
  blush: 'btn-blush',
};

export function Button({
  variant = 'primary',
  size = 'default',
  arrow = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const isCompact = size === 'compact' || size === 'sm';
  const key = variant === 'primary' && isCompact ? 'primary-compact' : variant;
  const sizeClass = isCompact ? 'py-1.5 px-3 text-[13px]' : '';
  const classes = `${variantClasses[key] || variantClasses.primary} ${sizeClass} ${className}`.trim();

  return (
    <button className={classes} {...props}>
      {children}
      {arrow && <ArrowRight className="w-4 h-4" aria-hidden="true" />}
    </button>
  );
}
