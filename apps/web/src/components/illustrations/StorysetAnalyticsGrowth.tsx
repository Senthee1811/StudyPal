import React from 'react';

/**
 * Storyset-style vector illustration: Progress & Mastery Analytics.
 * Features rising growth bars, target bullseye, and celebratory milestone badge.
 */
export function StorysetAnalyticsGrowth({
  className = 'w-56 h-56',
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Progress Growth illustration"
    >
      {/* Background Soft Blobs */}
      <circle cx="250" cy="250" r="180" fill="#fcfaf5" />
      <circle cx="260" cy="240" r="150" fill="#d5f5c2" opacity="0.4" />
      <circle cx="210" cy="180" r="70" fill="#ffe95c" opacity="0.45" />

      {/* Target Bullseye on Top Right */}
      <g transform="translate(340, 90)">
        <circle cx="45" cy="45" r="40" fill="#ffffff" stroke="#1a3300" strokeWidth="3" />
        <circle cx="45" cy="45" r="28" fill="#ffe95c" stroke="#1a3300" strokeWidth="2.5" />
        <circle cx="45" cy="45" r="14" fill="#cb5521" />
        {/* Arrow Hit */}
        <line x1="15" y1="75" x2="45" y2="45" stroke="#1a3300" strokeWidth="4" strokeLinecap="round" />
        <polygon points="12,78 18,72 22,82" fill="#1a3300" />
      </g>

      {/* Growth Chart Floor Line */}
      <line x1="80" y1="380" x2="420" y2="380" stroke="#1a3300" strokeWidth="5" strokeLinecap="round" />

      {/* Rising Bar 1 (25% - Red/Terracotta start) */}
      <rect x="110" y="300" width="45" height="80" rx="8" fill="#cb5521" stroke="#1a3300" strokeWidth="3.5" />
      <text x="122" y="345" fontFamily="monospace" fontSize="13" fontWeight="bold" fill="#ffffff">
        25%
      </text>

      {/* Rising Bar 2 (50% - Yellow revision) */}
      <rect x="180" y="240" width="45" height="140" rx="8" fill="#ffe95c" stroke="#1a3300" strokeWidth="3.5" />
      <text x="192" y="315" fontFamily="monospace" fontSize="13" fontWeight="bold" fill="#1a3300">
        50%
      </text>

      {/* Rising Bar 3 (75% - Teal competent) */}
      <rect x="250" y="180" width="45" height="200" rx="8" fill="#a8e5e5" stroke="#1a3300" strokeWidth="3.5" />
      <text x="262" y="285" fontFamily="monospace" fontSize="13" fontWeight="bold" fill="#1a3300">
        75%
      </text>

      {/* Rising Bar 4 (95% - Forest-ink Mastery) */}
      <rect x="320" y="120" width="45" height="260" rx="8" fill="#1a3300" stroke="#1a3300" strokeWidth="3.5" />
      <text x="330" y="255" fontFamily="monospace" fontSize="13" fontWeight="bold" fill="#ffe95c">
        95%
      </text>

      {/* Ascending Trend Arrow Line */}
      <path
        d="M130 280 Q 200 210 270 160 T 360 85"
        fill="none"
        stroke="#1a3300"
        strokeWidth="4"
        strokeDasharray="6 4"
      />
      {/* Arrowhead */}
      <polygon points="360,75 370,95 348,90" fill="#1a3300" />

      {/* Floating Trophy Badge on Bar 4 */}
      <g transform="translate(325, 45)">
        <circle cx="17" cy="17" r="16" fill="#ffe95c" stroke="#1a3300" strokeWidth="2.5" />
        <path
          d="M11 12H23V19C23 22 20 24 17 24C14 24 11 22 11 19V12Z"
          fill="#1a3300"
        />
        <line x1="17" y1="24" x2="17" y2="28" stroke="#1a3300" strokeWidth="2" />
        <line x1="13" y1="28" x2="21" y2="28" stroke="#1a3300" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}
