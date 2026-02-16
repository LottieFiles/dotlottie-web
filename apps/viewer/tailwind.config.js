/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lottie: '#019D91',
        // Dark mode colors (VS Code inspired)
        'dark-bg': '#1e1e1e',
        'dark-surface': '#252526',
        'dark-border': '#3c3c3c',
        'dark-text': '#cccccc',
        'dark-text-muted': '#858585',
      },
      textColor: {
        primary: '#20272C',
        secondary: '#4C5863',
        tertiary: '#63727E',
      },
      backgroundColor: {
        primary: '#019D91',
        subtle: '#F3F6F8',
        strong: '#D9E0E6',
        hover: '#f9fafb',
      },
      borderColor: {
        subtle: '#D9E0E6',
      },
    },
  },
  plugins: [],
};
