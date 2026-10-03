const { themeColors, fontFamilies } = require('@studypal/ui-tokens');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: themeColors,
      fontFamily: fontFamilies,
    },
  },
  plugins: [],
};
