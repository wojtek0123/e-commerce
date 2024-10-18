const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: 'selector',
  theme: {
    extend: {
      padding: { gap: '2rem', base: '2rem' },
      gap: { base: '2rem' },
      borderRadius: { base: '1rem' },
      maxWidth: { 'book-card': '22rem' },
      height: { content: 'calc(100svh - 2 * 2rem)' },
      maxheight: { content: 'calc(100svh - 2 * 2rem)' },
      boxShadow: {
        base: '0px 3px 5px rgba(0, 0, 0, 0.02), 0px 0px 2px rgba(0, 0, 0, 0.05), 0px 1px 4px rgba(0,0,0,0.08)',
      },
      backgroundColor: {
        'content-background': 'var(--p-content-background)',
      },
      screens: {
        '3xl': '1924px',
        '4xl': '2380px',
        '5xl': '2600px',
        '6xl': '2840px',
        '7xl': '3000px',
        '8xl': '3300px',
        '9xl': '3640px',
      },
    },
  },
  plugins: [
    require('tailwindcss-primeui'),
    require('@tailwindcss/container-queries'),
  ],
};
