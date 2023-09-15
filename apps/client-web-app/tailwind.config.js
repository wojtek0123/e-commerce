const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],
    },
    boxShadow: {
      default:
        '0 0 #0000, 0 0 #0000, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      none: 'none',
    },
    colors: {
      background: {
        0: '#ffffff',
        100: '#f2f2f2',
        200: '#d9d9d9',
        300: '#bfbfbf',
        400: '#a6a6a6',
        500: '#8c8c8c',
        600: '#737373',
        700: '#414654',
        800: '#282832',
        900: '#212327',
        950: '#000000',
      },
      blue: {
        100: '#e6eeff',
        200: '#b3ccff',
        300: '#80aafe',
        400: '#4d87fe',
        500: '#1b65fe',
        600: '#014ce4',
        700: '#013bb2',
        800: '#012a7f',
        900: '#00194c',
        950: '#000819',
      },
      'yellow-green': {
        100: '#fcffe5',
        200: '#f5ffb3',
        300: '#eeff80',
        400: '#e7ff4d',
        500: '#bfdc00',
        600: '#c7e600',
        700: '#9bb300',
        800: '#6f8000',
        900: '#424d00',
        950: '#161a00',
      },
      green: {
        100: '#edf8f0',
        200: '#c8ead1',
        300: '#a3dcb2',
        400: '#7ecd94',
        500: '#63C37D',
        600: '#40a65b',
        700: '#328147',
        800: '#235c33',
        900: '#15371e',
        950: '#07120a',
      },
      foreground: {
        0: '#ffffff',
        100: '#f2f2f2',
        200: '#d9d9d9',
        300: '#bfbfbf',
        400: '#a6a6a6',
        500: '#8c8c8c',
        600: '#737373',
        700: '#414654',
        900: '#212327',
        950: '#000000',
      },
    },
  },
  plugins: [],
};
