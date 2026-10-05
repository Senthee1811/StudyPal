import React from 'react';

/**
 * Storyset-style vector illustration: AI Study Room Tutor.
 * Features an intelligent, friendly AI mentor character with graduation cap and trilingual speech bubble.
 */
export function StorysetAiTutor({
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
      aria-label="AI Tutor illustration"
    >
      {/* Background Soft Glow */}
      <circle cx="250" cy="250" r="180" fill="#fcfaf5" />
      <circle cx="240" cy="240" r="150" fill="#a8e5e5" opacity="0.4" />
      <circle cx="310" cy="180" r="60" fill="#ffe95c" opacity="0.5" />

      {/* Floating Sparkles & Network Nodes */}
      <g opacity="0.8">
        <circle cx="110" cy="200" r="5" fill="#1a3300" />
        <circle cx="150" cy="150" r="8" fill="#ffe95c" stroke="#1a3300" strokeWidth="2" />
        <line x1="110" y1="200" x2="150" y2="150" stroke="#1a3300" strokeWidth="2" strokeDasharray="4 4" />
        <circle cx="380" cy="220" r="6" fill="#cb5521" />
        <circle cx="410" cy="170" r="8" fill="#d5f5c2" stroke="#1a3300" strokeWidth="2" />
        <line x1="380" y1="220" x2="410" y2="170" stroke="#1a3300" strokeWidth="2" strokeDasharray="4 4" />
      </g>

      {/* Robot Base / Body */}
      <rect x="175" y="240" width="150" height="150" rx="30" fill="#ffffff" stroke="#1a3300" strokeWidth="4" />
      {/* Inner Screen Panel */}
      <rect x="195" y="260" width="110" height="90" rx="16" fill="#a8e5e5" stroke="#1a3300" strokeWidth="3" />
      {/* Waveform / Heartbeat on screen */}
      <path
        d="M210 305H230L240 285L250 325L260 295L270 305H290"
        stroke="#1a3300"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Power Button */}
      <circle cx="250" cy="370" r="7" fill="#ffe95c" stroke="#1a3300" strokeWidth="2" />

      {/* Robot Head */}
      <rect x="185" y="140" width="130" height="95" rx="28" fill="#ffffff" stroke="#1a3300" strokeWidth="4" />
      {/* Antenna */}
      <line x1="250" y1="140" x2="250" y2="115" stroke="#1a3300" strokeWidth="4" strokeLinecap="round" />
      <circle cx="250" cy="108" r="9" fill="#ffe95c" stroke="#1a3300" strokeWidth="3" />

      {/* Visor Screen */}
      <rect x="200" y="158" width="100" height="55" rx="16" fill="#1a3300" />
      {/* Digital Eyes (Friendly Curvature) */}
      <circle cx="230" cy="184" r="8" fill="#a8e5e5" />
      <circle cx="270" cy="184" r="8" fill="#a8e5e5" />
      <path d="M243 194C247 197 253 197 257 194" stroke="#a8e5e5" strokeWidth="2" strokeLinecap="round" />

      {/* Graduation Cap (Mortarboard on Head) */}
      <g transform="translate(190, 60)">
        <polygon points="60,20 120,42 60,65 0,42" fill="#1a3300" />
        <rect x="35" y="55" width="50" height="20" rx="4" fill="#1a3300" />
        {/* Tassel */}
        <circle cx="60" cy="42" r="3" fill="#ffe95c" />
        <path d="M60 42L105 55V78" stroke="#ffe95c" strokeWidth="2.5" fill="none" />
        <rect x="102" y="78" width="6" height="12" rx="2" fill="#ffe95c" />
      </g>

      {/* Robot Arms */}
      <path d="M175 280C140 280 140 330 155 350" stroke="#1a3300" strokeWidth="8" strokeLinecap="round" />
      <circle cx="155" cy="350" r="10" fill="#ffd4b2" stroke="#1a3300" strokeWidth="3" />

      <path d="M325 280C360 280 375 250 385 220" stroke="#1a3300" strokeWidth="8" strokeLinecap="round" />
      <circle cx="385" cy="220" r="10" fill="#ffd4b2" stroke="#1a3300" strokeWidth="3" />
      {/* Pointer stick held in right hand */}
      <line x1="385" y1="220" x2="425" y2="150" stroke="#1a3300" strokeWidth="4" strokeLinecap="round" />
      <circle cx="427" cy="147" r="4" fill="#cb5521" />

      {/* Trilingual Speech Bubble */}
      <g transform="translate(70, 70)">
        <path
          d="M0 20C0 9 9 0 20 0H140C151 0 160 9 160 20V60C160 71 151 80 140 80H40L15 95V80H20C9 80 0 71 0 60Z"
          fill="#ffffff"
          stroke="#1a3300"
          strokeWidth="3"
        />
        <text x="24" y="32" fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill="#1a3300">
          ආයුබෝවන්!
        </text>
        <text x="24" y="52" fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill="#1a3300">
          வணக்கம்!
        </text>
        <text x="24" y="70" fontFamily="sans-serif" fontSize="12" fontWeight="bold" fill="#1a3300">
          Hello! Let's learn.
        </text>
      </g>
    </svg>
  );
}
