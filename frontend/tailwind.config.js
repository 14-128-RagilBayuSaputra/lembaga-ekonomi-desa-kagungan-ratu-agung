/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        desa: {
          primary: '#059669', // Emerald 600
          secondary: '#10b981', // Emerald 500
          dark: '#064e3b', // Emerald 900
          accent: '#f59e0b', // Amber 500 (untuk tombol aksi/warning)
          danger: '#dc2626', // Red 600
          light: '#f0fdf4', // Emerald 50 (background tipis)
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
};