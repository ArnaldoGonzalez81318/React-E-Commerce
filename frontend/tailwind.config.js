/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#dbeeff',
          200: '#b7dbff',
          300: '#92c8ff',
          400: '#6eb4ff',
          500: '#4aa1ff',
          600: '#2e7edb',
          700: '#215fa8',
          800: '#143f75',
          900: '#072043',
        },
      },
    },
  },
  plugins: [],
}
