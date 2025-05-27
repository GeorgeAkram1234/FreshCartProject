/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}' , './index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      container:{
        center:true
      },
      colors: {
        dark: {
          primary: '#1a1a1a',
          secondary: '#2d2d2d',
          text: '#e5e5e5',
          'text-secondary': '#a3a3a3',
        }
      }
    },
  },
  plugins: [],
}

