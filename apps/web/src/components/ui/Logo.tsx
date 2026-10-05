'use client';

import React from 'react';

/**
 * StudyPal Logo — 38×38 highlighter-yellow square with hand-drawn monogram + wordmark.
 * Sized and vertically aligned to fit seamlessly inside headers and cards without overflow.
 */
export function Logo({
  className = '',
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* 38×38 yellow square with monogram */}
      <div className="w-[38px] h-[38px] min-w-[38px] min-h-[38px] rounded-[7px] bg-highlighter-yellow flex items-center justify-center flex-shrink-0 border border-forest-ink/15 shadow-sm">
        <svg
          width="20"
          height="20"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Hand-drawn "S" monogram in forest-ink */}
          <path
            d="M15 5.5C14.2 3.8 12 3 10.5 3C8 3 6 4.5 6 6.8C6 9 7.5 10 10 11C13 12.2 15 13 15 15.5C15 17.8 13 19.5 10.5 19.5C8 19.5 6.2 18 5.5 16"
            stroke="#1a3300"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Wordmark */}
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span className="font-sans text-[18px] font-bold text-forest-ink tracking-tight">
            StudyPal
          </span>
          <span className="text-[10px] font-mono font-medium text-forest-ink/50 uppercase tracking-wider mt-0.5">
            Sri Lanka
          </span>
        </div>
      )}
    </div>
  );
}
