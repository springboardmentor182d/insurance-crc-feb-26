/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true, 
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'insure-green': '#14532d',
      }
    },
  },
  plugins: [],
}