'use client';

import React from 'react';

export interface DisplayHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** HTML heading level */
  as?: 'h1' | 'h2' | 'h3';
  /** Size variant — maps to type scale */
  size?: 'heading' | 'display-sm' | 'display' | 'display-lg';
}

const sizeClasses: Record<string, string> = {
  heading: 'text-heading',
  'display-sm': 'text-display-sm',
  display: 'text-display',
  'display-lg': 'text-display-lg',
};

/**
 * Display heading — uses Bricolage Grotesque 800.
 * Never used below 40px (the "heading" size is the minimum).
 */
export function DisplayHeading({
  as: Tag = 'h1',
  size = 'heading',
  className = '',
  children,
  ...props
}: DisplayHeadingProps) {
  return (
    <Tag className={`text-display ${sizeClasses[size] || ''} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
