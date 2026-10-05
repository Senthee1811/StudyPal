import React from 'react';

/**
 * Storyset-style vector illustration: Sri Lanka Geography Map Lab.
 * Features an island topography map with compass, location pin, and magnifying glass.
 */
export function StorysetMapExplore({
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
      aria-label="Geography Map Lab illustration"
    >
      {/* Background Soft Circle */}
      <circle cx="250" cy="250" r="180" fill="#fcfaf5" />
      <circle cx="250" cy="250" r="155" fill="#a8e5e5" opacity="0.45" />

      {/* Ocean waves around island */}
      <path d="M120 180C130 185 140 185 150 180" stroke="#1a3300" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M340 330C350 335 360 335 370 330" stroke="#1a3300" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M100 290C110 295 120 295 130 290" stroke="#1a3300" strokeWidth="2.5" strokeLinecap="round" />

      {/* Sri Lanka Island Contour (Teardrop shape) */}
      <path
        d="M250 110
           C265 120 285 140 295 180
           C305 220 315 260 305 310
           C295 360 270 395 245 400
           C225 395 205 365 195 320
           C185 270 195 220 210 170
           C220 135 240 115 250 110 Z"
        fill="#d5f5c2"
        stroke="#1a3300"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Central Highlands (Elevated Topography) */}
      <path
        d="M245 250
           C260 255 270 270 268 295
           C265 315 250 325 240 325
           C228 320 225 300 230 280
           C235 260 240 250 245 250 Z"
        fill="#ffe95c"
        stroke="#1a3300"
        strokeWidth="2.5"
      />
      {/* Mountain Peak (Pidurutalagala) */}
      <polygon points="252,275 260,290 244,290" fill="#cb5521" stroke="#1a3300" strokeWidth="2" />

      {/* Mahaweli River Path */}
      <path
        d="M250 290C255 275 265 265 260 245C255 225 275 200 285 185"
        stroke="#0284c7"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Target Pin Marker (Red/Terracotta Location Pin) */}
      <g transform="translate(240, 160)">
        <path
          d="M15 0C6.7 0 0 6.7 0 15C0 26 15 42 15 42C15 42 30 26 30 15C30 6.7 23.3 0 15 0Z"
          fill="#cb5521"
          stroke="#1a3300"
          strokeWidth="3"
        />
        <circle cx="15" cy="15" r="5" fill="#ffffff" stroke="#1a3300" strokeWidth="2" />
      </g>

      {/* Compass Rose on Top Left */}
      <g transform="translate(90, 90)">
        <circle cx="40" cy="40" r="32" fill="#ffffff" stroke="#1a3300" strokeWidth="3" />
        <polygon points="40,15 46,36 40,40" fill="#cb5521" />
        <polygon points="40,15 34,36 40,40" fill="#1a3300" />
        <polygon points="40,65 46,44 40,40" fill="#ffffff" stroke="#1a3300" strokeWidth="1" />
        <polygon points="40,65 34,44 40,40" fill="#1a3300" />
        <text x="35" y="12" fontFamily="sans-serif" fontSize="11" fontWeight="bold" fill="#1a3300">
          N
        </text>
      </g>

      {/* Magnifying Glass on Bottom Right */}
      <g transform="translate(300, 270) rotate(-20)">
        <circle cx="45" cy="45" r="35" fill="#ffffff" stroke="#1a3300" strokeWidth="4" />
        <circle cx="45" cy="45" r="28" fill="#a8e5e5" opacity="0.4" />
        <line x1="72" y1="72" x2="115" y2="115" stroke="#1a3300" strokeWidth="8" strokeLinecap="round" />
        <circle cx="45" cy="45" r="3" fill="#1a3300" />
      </g>
    </svg>
  );
}
