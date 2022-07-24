/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      'white': '#FCFCFA',
      'black': '#262422',
      'gray': {
        100: '#FCFCFA',
        200: '#EDECE8',
        300: '#DEDCD7',
        400: '#CFCBC6',
        500: '#BFBBB6',
        600: '#99948F',
        700: '#736E6A',
        800: '#4D4846',
        900: '#262422'
      },
      'main': {
        100: '#FFFCF2',
        200: '#FEF8E8',
        300: '#F7EDD9',
        400: '#E4D6C1',
        500: '#BFAF9B',
        600: '#99816A',
        700: '#735B49',
        800: '#4D3A2F',
        900: '#261C17'
      },
      'blue': {
        100: '#F2F5FF',
        200: '#C1D2FE',
        300: '#8FB3FB',
        400: '#5C96F1',
        500: '#2A7BDE',
        600: '#0E60B0',
        700: '#034B82',
        800: '#003554',
        900: '#001A26',
      },
      'red': {
        100: '#FFF2F2',
        200: '#FEBFC2',
        300: '#FA8B96',
        400: '#ED556D',
        500: '#D42248',
        600: '#A80B37',
        700: '#7D022B',
        800: '#520020',
        900: '#260011',
      },
      'green': {
        100: '#F2FFF6',
        200: '#C0FECE',
        300: '#8BF69D',
        400: '#54E264',
        500: '#22BA29',
        600: '#0C950B',
        700: '#0A7003',
        800: '#0A4B00',
        900: '#072600',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        serif: ['Laila', 'serif'],
        acme: ['Acme', 'serif'],
      }
    },
  },
  plugins: [],
};
