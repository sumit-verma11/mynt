/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          bg: '#0a0a0a',
          card: '#111111',
          elevated: '#171717',
          hover: '#1c1c1c',
        },
      },
    },
  },
  plugins: [],
};
