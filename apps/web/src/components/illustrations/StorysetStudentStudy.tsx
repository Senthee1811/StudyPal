import React from 'react';

/**
 * Storyset-style vector illustration: Student studying with books and laptop.
 * Crafted using Storyset's clean outline + flat pastel palette tailored to StudyPal.
 */
export function StorysetStudentStudy({
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
      aria-label="Student studying illustration"
    >
      {/* Background Pastel Wash Circles (Storyset style) */}
      <circle cx="250" cy="250" r="190" fill="#fcfaf5" />
      <circle cx="270" cy="230" r="160" fill="#d5f5c2" opacity="0.6" />
      <circle cx="200" cy="180" r="70" fill="#ffe95c" opacity="0.45" />

      {/* Floating decorative math/curriculum shapes */}
      <g opacity="0.7">
        {/* Plus & multiplication symbols */}
        <path d="M120 160V180M110 170H130" stroke="#1a3300" strokeWidth="3" strokeLinecap="round" />
        <path d="M380 130L395 145M395 130L380 145" stroke="#cb5521" strokeWidth="2.5" strokeLinecap="round" />
        {/* Sparkles */}
        <path d="M160 110Q160 125 175 125Q160 125 160 140Q160 125 145 125Q160 125 160 110Z" fill="#ffe95c" stroke="#1a3300" strokeWidth="1.5" />
        <path d="M350 200Q350 210 360 210Q350 210 350 220Q350 210 340 210Q350 210 350 200Z" fill="#a8e5e5" stroke="#1a3300" strokeWidth="1.5" />
      </g>

      {/* Desk Base */}
      <rect x="80" y="340" width="340" height="14" rx="7" fill="#1a3300" />
      <path d="M130 354V430M370 354V430" stroke="#1a3300" strokeWidth="8" strokeLinecap="round" />
      <path d="M110 430H150M350 430H390" stroke="#1a3300" strokeWidth="8" strokeLinecap="round" />

      {/* Plant Pot on Left */}
      <path d="M115 340L122 300H148L155 340Z" fill="#cb5521" stroke="#1a3300" strokeWidth="3" />
      <path d="M135 300C125 270 105 275 120 255C140 270 145 285 135 300Z" fill="#1a3300" />
      <path d="M138 300C150 275 170 275 155 258C140 270 135 285 138 300Z" fill="#1a3300" />

      {/* Laptop on Desk */}
      <path d="M175 340L210 275H290L325 340Z" fill="#ffffff" stroke="#1a3300" strokeWidth="3" />
      <path d="M210 275H290V330H210Z" fill="#a8e5e5" stroke="#1a3300" strokeWidth="3" />
      {/* Screen code/text lines */}
      <line x1="222" y1="290" x2="278" y2="290" stroke="#1a3300" strokeWidth="3" strokeLinecap="round" />
      <line x1="222" y1="302" x2="265" y2="302" stroke="#1a3300" strokeWidth="3" strokeLinecap="round" />
      <line x1="222" y1="314" x2="272" y2="314" stroke="#1a3300" strokeWidth="3" strokeLinecap="round" />

      {/* Stack of Textbooks on Right */}
      <rect x="330" y="322" width="75" height="18" rx="3" fill="#ffe95c" stroke="#1a3300" strokeWidth="3" />
      <rect x="335" y="304" width="70" height="18" rx="3" fill="#f6d0ff" stroke="#1a3300" strokeWidth="3" />
      <rect x="340" y="286" width="65" height="18" rx="3" fill="#d5f5c2" stroke="#1a3300" strokeWidth="3" />
      {/* Bookmark ribbon */}
      <path d="M375 286V300L380 295L385 300V286" fill="#cb5521" />

      {/* Student Character (sitting behind desk) */}
      {/* Body / Torso */}
      <path
        d="M215 340V240C215 220 285 220 285 240V340"
        fill="#ffe95c"
        stroke="#1a3300"
        strokeWidth="3.5"
      />
      {/* Collar & Tie */}
      <path d="M238 220L250 245L262 220" fill="#ffffff" stroke="#1a3300" strokeWidth="2.5" />
      <path d="M247 245L253 245L255 270L250 276L245 270Z" fill="#cb5521" stroke="#1a3300" strokeWidth="2" />

      {/* Head & Neck */}
      <rect x="242" y="200" width="16" height="22" fill="#ffd4b2" stroke="#1a3300" strokeWidth="2.5" />
      <circle cx="250" cy="180" r="32" fill="#ffd4b2" stroke="#1a3300" strokeWidth="3.5" />

      {/* Face features: smiling, focused */}
      <circle cx="240" cy="178" r="3" fill="#1a3300" />
      <circle cx="260" cy="178" r="3" fill="#1a3300" />
      <path d="M244 192C247 196 253 196 256 192" stroke="#1a3300" strokeWidth="2.5" strokeLinecap="round" />

      {/* Spectacles / Glasses */}
      <circle cx="240" cy="178" r="8" fill="none" stroke="#1a3300" strokeWidth="2" />
      <circle cx="260" cy="178" r="8" fill="none" stroke="#1a3300" strokeWidth="2" />
      <line x1="248" y1="178" x2="252" y2="178" stroke="#1a3300" strokeWidth="2" />

      {/* Hair (neat, dark forest-ink) */}
      <path
        d="M218 175C218 145 245 145 250 145C265 145 282 152 282 175C282 165 270 155 250 155C230 155 220 168 218 175Z"
        fill="#1a3300"
      />
      {/* Side hair */}
      <path d="M218 175V190C222 185 224 180 224 175" fill="#1a3300" />
      <path d="M282 175V190C278 185 276 180 276 175" fill="#1a3300" />

      {/* Idea bulb floating above */}
      <g transform="translate(300, 100)">
        <path
          d="M20 10C11.7 10 5 16.7 5 25C5 30 7.5 34.5 11 37.5L11 43C11 44 12 45 13 45L27 45C28 45 29 44 29 43L29 37.5C32.5 34.5 35 30 35 25C35 16.7 28.3 10 20 10Z"
          fill="#ffe95c"
          stroke="#1a3300"
          strokeWidth="2.5"
        />
        <line x1="14" y1="48" x2="26" y2="48" stroke="#1a3300" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M8 8L2 2M32 8L38 2M20 5V0" stroke="#1a3300" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}
