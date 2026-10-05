// ============================================================================
// StudyPal Design Tokens — "Say Briefly" Creative-Studio Aesthetic
// ============================================================================
// Export for: Tailwind (web), NativeWind (mobile), and direct JS/TS usage.
// Light theme only; structured so a dark theme can be layered later.
// ============================================================================

// ---------------------------------------------------------------------------
// 1. Colors
// ---------------------------------------------------------------------------

export const colors = {
  /** Primary text, filled CTAs, borders — the "ink" of the sketchbook */
  'forest-ink': '#1a3300',
  /** Highlight wash behind keywords & badges. NEVER a CTA fill. */
  'highlighter-yellow': '#ffe95c',
  /** Canvas / cards / nav — the paper */
  'cream-paper': '#fcfaf5',
  /** Hairlines & disabled states */
  'pencil-gray': '#b6b6b6',
  /** Ultra-light backgrounds, dividers */
  'whisper-gray': '#f1f1f1',
  /** Pastel accent — AI Study Room */
  'sticky-teal': '#a8e5e5',
  /** Pastel accent — Curriculum */
  'sticky-mint': '#d5f5c2',
  /** Pastel accent — Practice & Exams */
  'sticky-blush': '#f6d0ff',
  /** Accent for Map Lab section */
  terracotta: '#cb5521',
} as const;

export type TokenColor = keyof typeof colors;

// Semantic aliases for Tailwind `extend.colors`
export const tailwindColors = {
  'forest-ink': colors['forest-ink'],
  'highlighter-yellow': colors['highlighter-yellow'],
  'cream-paper': colors['cream-paper'],
  'pencil-gray': colors['pencil-gray'],
  'whisper-gray': colors['whisper-gray'],
  'sticky-teal': colors['sticky-teal'],
  'sticky-mint': colors['sticky-mint'],
  'sticky-blush': colors['sticky-blush'],
  terracotta: colors.terracotta,
} as const;

// ---------------------------------------------------------------------------
// 2. Fonts
// ---------------------------------------------------------------------------

export const fontFamilies = {
  /** Display headlines ≥ 40 px only */
  display: [
    'Bricolage Grotesque',
    'Inter',
    'Noto Sans Sinhala',
    'Noto Sans Tamil',
    'system-ui',
    'sans-serif',
  ],
  /** All UI / body text */
  sans: ['Inter', 'Noto Sans Sinhala', 'Noto Sans Tamil', 'system-ui', 'sans-serif'],
  /** Micro-labels, metadata, code */
  mono: ['Roboto Mono', 'ui-monospace', 'monospace'],
  /** Sinhala-optimised stack */
  sinhala: ['Noto Sans Sinhala', 'Inter', 'sans-serif'],
  /** Tamil-optimised stack */
  tamil: ['Noto Sans Tamil', 'Inter', 'sans-serif'],
} as const;

// React Native cannot use CSS font stacks — provide platform font names
export const nativeFonts = {
  display: 'BricolageGrotesque-ExtraBold', // loaded via expo-font or asset link
  sans400: 'Inter-Regular',
  sans500: 'Inter-Medium',
  sans600: 'Inter-SemiBold',
  sans700: 'Inter-Bold',
  mono: 'RobotoMono-Regular',
  sinhala: 'NotoSansSinhala-Regular',
  tamil: 'NotoSansTamil-Regular',
} as const;

// ---------------------------------------------------------------------------
// 3. Type Scale (px)
// ---------------------------------------------------------------------------

export const typeScale = [11, 14, 16, 18, 20, 28, 40, 55, 66, 90] as const;

/** Named size aliases */
export const fontSize = {
  'micro': '11px',      // Roboto Mono micro-labels
  'caption': '14px',    // small helper text
  'body-sm': '16px',    // compact body
  'body': '18px',       // default body — Inter 400
  'body-lg': '20px',    // large body / sub-headings
  'heading-sm': '28px', // section headings — Inter 700
  'heading': '40px',    // display headings — Bricolage 800
  'display-sm': '55px', // large display
  'display': '66px',    // hero display
  'display-lg': '90px', // splash / oversized display
} as const;

export const tailwindFontSize = {
  'micro':      ['11px', { lineHeight: '1.4', letterSpacing: '0.02em' }],
  'caption':    ['14px', { lineHeight: '1.5' }],
  'body-sm':    ['16px', { lineHeight: '1.5' }],
  'body':       ['18px', { lineHeight: '1.5' }],
  'body-lg':    ['20px', { lineHeight: '1.4' }],
  'heading-sm': ['28px', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
  'heading':    ['40px', { lineHeight: '1.0', letterSpacing: '0.04em' }],
  'display-sm': ['55px', { lineHeight: '1.0', letterSpacing: '0.04em' }],
  'display':    ['66px', { lineHeight: '1.0', letterSpacing: '0.05em' }],
  'display-lg': ['90px', { lineHeight: '1.0', letterSpacing: '0.05em' }],
} as const;

// ---------------------------------------------------------------------------
// 4. Spacing (8 px base)
// ---------------------------------------------------------------------------

export const spacing = {
  '1':  '8px',
  '2':  '16px',
  '3':  '24px',
  '4':  '32px',
  '5':  '40px',
  '6':  '48px',
  '7':  '56px',
  '8':  '64px',
  '10': '80px',
  '12': '96px',
  '15': '120px',
} as const;

/** Raw numeric values (for RN StyleSheet) */
export const spacingNum = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
  '2xl': 48,
  '3xl': 56,
  '4xl': 64,
  '5xl': 80,
  '6xl': 96,
  '7xl': 120,
} as const;

// ---------------------------------------------------------------------------
// 5. Border Radius
// ---------------------------------------------------------------------------

export const borderRadius = {
  'btn':  '6px',
  'card': '12px',
  'nav':  '16px',
  'tag':  '9999px',
} as const;

export const borderRadiusNum = {
  btn: 6,
  card: 12,
  nav: 16,
  tag: 9999,
} as const;

// ---------------------------------------------------------------------------
// 6. Shadows — almost none
// ---------------------------------------------------------------------------

export const boxShadow = {
  /** Only shadow used on buttons */
  'btn': '0 1px 2px rgba(0,0,0,0.05)',
  /** Optional glow for floating nav */
  'nav-glow': '0 2px 8px rgba(0,0,0,0.04)',
  'none': 'none',
} as const;

// ---------------------------------------------------------------------------
// 7. Layout
// ---------------------------------------------------------------------------

export const layout = {
  maxWidth: '1200px',
  sectionGap: '64px',
  cardPadding: '24px',
  elementGap: '16px',
} as const;

// ---------------------------------------------------------------------------
// 8. Section → Pastel Mapping
// ---------------------------------------------------------------------------

export const sectionColors = {
  dashboard:       colors['cream-paper'],
  curriculum:      colors['sticky-mint'],
  library:         colors['cream-paper'],    // cream + border
  studyRoom:       colors['sticky-teal'],
  practiceExams:   colors['sticky-blush'],
  mapLab:          colors.terracotta,
  progress:        colors['highlighter-yellow'],
} as const;

// ---------------------------------------------------------------------------
// 9. Tailwind Preset (consumed by apps/web/tailwind.config.ts)
// ---------------------------------------------------------------------------

export const tailwindPreset = {
  theme: {
    extend: {
      colors: tailwindColors,
      fontFamily: fontFamilies,
      fontSize: tailwindFontSize,
      spacing,
      borderRadius,
      boxShadow,
      maxWidth: {
        'layout': layout.maxWidth,
      },
    },
  },
};

export default tailwindPreset;
