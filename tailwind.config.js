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
          50: '#f8fafc',
          100: '#f1f5f9', // Le gris très léger pour la profondeur des composants
          600: '#1e293b', // Gris plus clair pour les états de survol (hover)
          900: '#0f172a', // Gris Anthracite Profond (Votre nouvelle couleur primaire)
        },
        accent: {
          400: '#34d399', // Émeraude clair
          500: '#10b981', // Émeraude vif (Votre nouvelle couleur secondaire/action)
          600: '#059669', // Émeraude sombre pour le survol
        },
        tech: {
          500: '#06b6d4', // Le Cyan, en bonus, si vous avez besoin d'une troisième couleur pour des tags
        }
      },
    },
  },
  plugins: [],
}