import type { Config } from 'tailwindcss';
import {
  tailwindColors,
  fontFamilies,
  tailwindFontSize,
  spacing,
  borderRadius,
  boxShadow,
  layout,
} from '@studypal/ui-tokens';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Light theme only — structured for future dark mode via 'class' strategy
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ...tailwindColors,
        'eager-green': '#58cc02',
        'eager-green-dark': '#46a302',
        'storybook-green': '#d7ffb8',
        'spark-blue': '#1cb0f6',
        'spark-blue-dark': '#1899d6',
        'fresh-leaf': '#a5ed6e',
        'night-ink': '#000437',
        'duo-charcoal': '#4b4b4b',
        'pencil-gray': '#777777',
        'faded-gray': '#afafaf',
      },
      fontFamily: {
        ...(fontFamilies as any),
        feather: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: tailwindFontSize as any,
      borderRadius,
      boxShadow,
      maxWidth: {
        layout: layout.maxWidth,
      },
      // Bricolage Grotesque letter-spacing for display headings
      letterSpacing: {
        display: '0.04em',
        'display-wide': '0.05em',
      },
      lineHeight: {
        'display': '1.0',
        'sinhala': '1.6',
        'tamil': '1.6',
      },
    },
  },
  plugins: [],
};

export default config;
