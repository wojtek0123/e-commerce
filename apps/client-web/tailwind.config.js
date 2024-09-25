const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');
const theme = require('tailwindcss-primeui/src/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      padding: { gap: '2rem' },
      boxShadow: {
        base: '0px 3px 5px rgba(0, 0, 0, 0.02), 0px 0px 2px rgba(0, 0, 0, 0.05), 0px 1px 4px rgba(0,0,0,0.08)',
      },
      backgroundColor: {
        'content-background': 'var(--p-content-background)',
      },
    },
  },
  plugins: [require('tailwindcss-primeui')],
};
