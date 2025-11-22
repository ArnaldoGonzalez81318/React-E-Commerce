/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#dde5ff',
          200: '#bac7ff',
          300: '#96a8ff',
          400: '#738aff',
          500: '#516cff',
          600: '#3c52db',
          700: '#2d3ca8',
          800: '#1e2676',
          900: '#0f1244',
        },
      },
    },
  },
  plugins: [],
}
