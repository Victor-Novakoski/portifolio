/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cinzel', 'serif'],
        body: ['"Source Sans 3"', 'sans-serif'],
      },
      colors: {
        souls: {
          ember: '#C7A25D',
          abyss: '#0A0A0B',
          mist: '#868E96',
        },
      },
    },
  },
  plugins: [],
}
