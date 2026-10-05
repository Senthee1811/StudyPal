const {
  tailwindColors,
  fontFamilies,
  tailwindFontSize,
  spacing,
  borderRadius,
  boxShadow,
  layout,
} = require('@studypal/ui-tokens');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: tailwindColors,
      fontFamily: fontFamilies,
      fontSize: tailwindFontSize,
      spacing,
      borderRadius,
      boxShadow,
      maxWidth: {
        layout: layout.maxWidth,
      },
      letterSpacing: {
        display: '0.04em',
        'display-wide': '0.05em',
      },
      lineHeight: {
        display: '1.0',
        sinhala: '1.6',
        tamil: '1.6',
      },
    },
  },
  plugins: [],
};
