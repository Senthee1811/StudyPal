import React from 'react';

/**
 * Storyset-style vector illustration: Practice & Examination Runner.
 * Features an exam test paper with A+ distinction stamp, stopwatch timer, and ribbon badge.
 */
export function StorysetExamPassed({
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
      aria-label="Exam Practice illustration"
    >
      {/* Background Shapes */}
      <circle cx="250" cy="250" r="180" fill="#fcfaf5" />
      <circle cx="270" cy="230" r="150" fill="#f6d0ff" opacity="0.4" />
      <circle cx="180" cy="180" r="70" fill="#d5f5c2" opacity="0.5" />

      {/* Floating Checkmarks & Sparkles */}
      <g>
        <path d="M110 160L125 175L155 145" stroke="#1a3300" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M380 140L395 155L425 125" stroke="#1a3300" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M380 280Q380 295 395 295Q380 295 380 310Q380 295 365 295Q380 295 380 280Z" fill="#ffe95c" />
      </g>

      {/* Stopwatch on Left */}
      <g transform="translate(90, 240)">
        <circle cx="45" cy="55" r="38" fill="#ffffff" stroke="#1a3300" strokeWidth="4" />
        <rect x="39" y="8" width="12" height="12" rx="3" fill="#1a3300" />
        <circle cx="45" cy="55" r="4" fill="#cb5521" />
        {/* Clock Hands */}
        <line x1="45" y1="55" x2="45" y2="30" stroke="#1a3300" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="45" y1="55" x2="62" y2="60" stroke="#cb5521" strokeWidth="3" strokeLinecap="round" />
        {/* Tick marks */}
        <line x1="45" y1="22" x2="45" y2="25" stroke="#1a3300" strokeWidth="2" />
        <line x1="78" y1="55" x2="75" y2="55" stroke="#1a3300" strokeWidth="2" />
        <line x1="45" y1="88" x2="45" y2="85" stroke="#1a3300" strokeWidth="2" />
        <line x1="12" y1="55" x2="15" y2="55" stroke="#1a3300" strokeWidth="2" />
      </g>

      {/* Main Examination Test Paper */}
      <g transform="translate(180, 110)">
        {/* Paper shadow */}
        <rect x="8" y="8" width="190" height="260" rx="12" fill="#1a3300" opacity="0.1" />
        {/* Paper Sheet */}
        <rect width="190" height="260" rx="12" fill="#ffffff" stroke="#1a3300" strokeWidth="4" />

        {/* Header Lines */}
        <rect x="25" y="25" width="80" height="12" rx="4" fill="#ffe95c" stroke="#1a3300" strokeWidth="2" />
        <line x1="25" y1="50" x2="165" y2="50" stroke="#1a3300" strokeWidth="3" strokeLinecap="round" />

        {/* Questions with Radio Checkmarks */}
        {/* Question 1 */}
        <circle cx="35" cy="80" r="7" fill="#d5f5c2" stroke="#1a3300" strokeWidth="2.5" />
        <path d="M32 80L34 82L38 78" stroke="#1a3300" strokeWidth="2" strokeLinecap="round" />
        <line x1="50" y1="80" x2="155" y2="80" stroke="#1a3300" strokeWidth="2.5" strokeLinecap="round" />

        {/* Question 2 */}
        <circle cx="35" cy="115" r="7" fill="#d5f5c2" stroke="#1a3300" strokeWidth="2.5" />
        <path d="M32 115L34 117L38 113" stroke="#1a3300" strokeWidth="2" strokeLinecap="round" />
        <line x1="50" y1="115" x2="140" y2="115" stroke="#1a3300" strokeWidth="2.5" strokeLinecap="round" />

        {/* Question 3 */}
        <circle cx="35" cy="150" r="7" fill="#d5f5c2" stroke="#1a3300" strokeWidth="2.5" />
        <path d="M32 150L34 152L38 148" stroke="#1a3300" strokeWidth="2" strokeLinecap="round" />
        <line x1="50" y1="150" x2="160" y2="150" stroke="#1a3300" strokeWidth="2.5" strokeLinecap="round" />

        {/* Question 4 */}
        <circle cx="35" cy="185" r="7" fill="#ffffff" stroke="#1a3300" strokeWidth="2.5" />
        <line x1="50" y1="185" x2="130" y2="185" stroke="#1a3300" strokeWidth="2.5" strokeLinecap="round" />

        {/* A+ Distinction Stamp */}
        <g transform="translate(105, 175) rotate(-12)">
          <circle cx="32" cy="32" r="30" fill="none" stroke="#cb5521" strokeWidth="4" strokeDasharray="6 3" />
          <text x="14" y="42" fontFamily="sans-serif" fontSize="28" fontWeight="900" fill="#cb5521">
            A+
          </text>
        </g>
      </g>

      {/* Golden Pencil Resting on bottom right */}
      <g transform="translate(320, 320) rotate(-45)">
        <polygon points="0,0 20,0 10,-25" fill="#ffd4b2" stroke="#1a3300" strokeWidth="2.5" />
        <polygon points="0,0 20,0 20,90 0,90" fill="#ffe95c" stroke="#1a3300" strokeWidth="3" />
        <rect x="0" y="90" width="20" height="20" rx="3" fill="#cb5521" stroke="#1a3300" strokeWidth="2.5" />
      </g>
    </svg>
  );
}
