/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        chiapas: {
          blue: '#1B5E9F',
          'blue-dark': '#164A7E',
          'blue-light': '#2E7BBF',
          jade: '#10B981',
          teal: '#14B8A6',
          orange: '#F97316',
          red: '#EF4444',
          yellow: '#EAB308',
        },
      },
    },
  },
  plugins: [],
};
