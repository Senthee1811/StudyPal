'use client';

import React from 'react';

/**
 * Micro label — Roboto Mono 400, 11px, for metadata and small labels.
 */
export function MicroLabel({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={`text-micro-label text-forest-ink/60 ${className}`} {...props}>
      {children}
    </span>
  );
}
