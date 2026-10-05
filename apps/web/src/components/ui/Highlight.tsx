'use client';

import React from 'react';

/**
 * Highlighted word — yellow wash inside Bricolage display headlines.
 * Usage: <DisplayHeading>Learn <Highlight>smarter</Highlight> today</DisplayHeading>
 */
export function Highlight({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={`highlight ${className}`}>{children}</span>;
}
