/**
 * Copyright 2023 Design Barn Inc.
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lottie: '#019D91',
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
