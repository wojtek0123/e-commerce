const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'index.html'),
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}',
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: 'selector',
  theme: {
    extend: {
      padding: { gap: '1rem', base: '1rem' },
      gap: { base: '1rem' },
      borderRadius: { base: '1rem' },
      maxWidth: { 'book-card': '22rem' },
      height: { content: 'calc(100svh - 2 * 1rem)' },
      minHeight: { content: 'calc(100svh - 2 * 1rem)' },
      maxheight: { content: 'calc(100svh - 2 * 1rem)' },
      boxShadow: {
        base: '0px 3px 5px rgba(0, 0, 0, 0.02), 0px 0px 2px rgba(0, 0, 0, 0.05), 0px 1px 4px rgba(0,0,0,0.08)',
      },
      backgroundColor: {
        'content-background': 'var(--surface-ground)',
      },
      textColor: {
        'text-error': 'var(--red-300)',
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
      containers: {
        '8xl': '86.25rem',
        '9xl': '100rem',
        '10xl': '125rem',
        '11xl': '150rem',
        '12xl': '165rem',
        '13xl': '187.5rem',
        '14xl': '210rem',
      },
      colors: {
        'primary-50': 'var(--primary-50)',
        'primary-100': 'var(--primary-100)',
        'primary-200': 'var(--primary-200)',
        'primary-300': 'var(--primary-300)',
        'primary-400': 'var(--primary-400)',
        'primary-500': 'var(--primary-500)',
        'primary-600': 'var(--primary-600)',
        'primary-700': 'var(--primary-700)',
        'primary-800': 'var(--primary-800)',
        'primary-900': 'var(--primary-900)',
        'primary-950': 'var(--primary-950)',

        'surface-0': 'var(--surface-0)',
        'surface-50': 'var(--surface-50)',
        'surface-100': 'var(--surface-100)',
        'surface-200': 'var(--surface-200)',
        'surface-300': 'var(--surface-300)',
        'surface-400': 'var(--surface-400)',
        'surface-500': 'var(--surface-500)',
        'surface-600': 'var(--surface-600)',
        'surface-700': 'var(--surface-700)',
        'surface-800': 'var(--surface-800)',
        'surface-900': 'var(--surface-900)',
        'surface-950': 'var(--surface-950)'
      }

    },
  },
  plugins: [require('@tailwindcss/container-queries')],
};
