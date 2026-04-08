/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          600: '#2563eb', // Bleu OptiStage
          900: '#1e3a8a', // Bleu Marine
        },
        accent: {
          500: '#f59e0b', // Orange d'action
        }
      },
    },
  },
  plugins: [],
}