/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#4A90E2',
        'dark-blue': '#2F5DA8',
        'light-blue': '#6FAFF5',
        'white': '#FFFFFF',
        'light-gray': '#F5F7FA',
        'gray': '#D1D5DB',
        'dark-text': '#333333',
        'light-text': '#777777',
        'red': '#E74C3C',
      },
    },
  },
  plugins: [],
}