/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'steel-blue': {
          50: '#f0f4fa',
          100: '#dde5f3',
          200: '#c2d1ea',
          300: '#9ab3dc',
          400: '#6c8dcb',
          500: '#4f6fb8',
          600: '#3f5aa0',
          700: '#364a83',
          800: '#30416c',
          900: '#2c395b',
          950: '#1e2539',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'inner-glow': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.05)',
      },
    },
  },
  plugins: [],
} 