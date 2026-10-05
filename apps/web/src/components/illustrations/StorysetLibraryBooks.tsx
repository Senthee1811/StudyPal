import React from 'react';

/**
 * Storyset-style vector illustration: My Library & Textbook Archive.
 * Inspired by the storybook favicon motif: an open magical textbook with floating chapters, citations, and sparkles.
 */
export function StorysetLibraryBooks({
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
      aria-label="Storybook Library illustration"
    >
      {/* Background Soft Blob */}
      <circle cx="250" cy="250" r="180" fill="#fcfaf5" />
      <circle cx="260" cy="230" r="140" fill="#f6d0ff" opacity="0.4" />
      <circle cx="200" cy="210" r="80" fill="#ffe95c" opacity="0.35" />

      {/* Floating Sparkles (matching the favicon sparkles) */}
      <g>
        <path d="M140 130Q140 145 155 145Q140 145 140 160Q140 145 125 145Q140 145 140 130Z" fill="#cb5521" />
        <path d="M370 120Q370 138 388 138Q370 138 370 156Q370 138 352 138Q370 138 370 120Z" fill="#cb5521" />
        <path d="M250 80Q250 92 262 92Q250 92 250 104Q250 92 238 92Q250 92 250 80Z" fill="#ffe95c" stroke="#1a3300" strokeWidth="1.5" />
        <path d="M360 280Q360 290 370 290Q360 290 360 300Q360 290 350 290Q360 290 360 280Z" fill="#a8e5e5" />
      </g>

      {/* Floating Verified Citation Badges */}
      <g transform="translate(80, 200)">
        <rect width="90" height="28" rx="14" fill="#ffe95c" stroke="#1a3300" strokeWidth="2.5" />
        <text x="14" y="18" fontFamily="monospace" fontSize="11" fontWeight="bold" fill="#1a3300">
          p. 14 CITATION
        </text>
      </g>
      <g transform="translate(330, 210)">
        <rect width="95" height="28" rx="14" fill="#d5f5c2" stroke="#1a3300" strokeWidth="2.5" />
        <text x="16" y="18" fontFamily="monospace" fontSize="11" fontWeight="bold" fill="#1a3300">
          100% NIE RAG
        </text>
      </g>

      {/* Main Open Storybook (matching icons8 storybook structure) */}
      {/* Book Cover Base (Purple / Forest-ink spine) */}
      <path
        d="M95 340C155 330 225 345 250 365C275 345 345 330 405 340V365C345 355 275 370 250 390C225 370 155 355 95 365V340Z"
        fill="#1a3300"
      />
      <path
        d="M90 330C155 320 225 335 250 355C275 335 345 320 410 330V355C345 345 275 360 250 380C225 360 155 345 90 355V330Z"
        fill="#8a4fff"
        stroke="#1a3300"
        strokeWidth="3.5"
      />

      {/* Pages Layer (Left Wing) */}
      <path
        d="M100 220C160 210 225 225 248 245V348C225 328 160 312 100 322V220Z"
        fill="#fcfaf5"
        stroke="#1a3300"
        strokeWidth="3.5"
      />
      {/* Pages Layer (Right Wing) */}
      <path
        d="M400 220C340 210 275 225 252 245V348C275 328 340 312 400 322V220Z"
        fill="#fcfaf5"
        stroke="#1a3300"
        strokeWidth="3.5"
      />
      {/* Book Spine Center Line */}
      <line x1="250" y1="245" x2="250" y2="350" stroke="#1a3300" strokeWidth="4" />

      {/* Text Lines on Left Page */}
      <line x1="125" y1="245" x2="225" y2="245" stroke="#1a3300" strokeWidth="3" strokeLinecap="round" />
      <line x1="125" y1="260" x2="215" y2="260" stroke="#1a3300" strokeWidth="3" strokeLinecap="round" />
      <line x1="125" y1="275" x2="220" y2="275" stroke="#1a3300" strokeWidth="3" strokeLinecap="round" />
      <line x1="125" y1="290" x2="195" y2="290" stroke="#1a3300" strokeWidth="3" strokeLinecap="round" />

      {/* Text Lines on Right Page */}
      <line x1="275" y1="245" x2="375" y2="245" stroke="#1a3300" strokeWidth="3" strokeLinecap="round" />
      <line x1="275" y1="260" x2="365" y2="260" stroke="#1a3300" strokeWidth="3" strokeLinecap="round" />
      <line x1="275" y1="275" x2="370" y2="275" stroke="#1a3300" strokeWidth="3" strokeLinecap="round" />
      <line x1="275" y1="290" x2="340" y2="290" stroke="#1a3300" strokeWidth="3" strokeLinecap="round" />

      {/* Bookmark Ribbon Hanging from Spine */}
      <path d="M246 350L250 410L258 402L266 410L270 350Z" fill="#ffe95c" stroke="#1a3300" strokeWidth="2.5" />
    </svg>
  );
}
