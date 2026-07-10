/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        greenco: {
          900: '#0F5132', // Forest Green (Primary)
          600: '#198754', // Mint Green (Secondary)
          500: '#20C997', // Light Green
          100: '#D1E7DD', // Pale Green (Background focus)
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
