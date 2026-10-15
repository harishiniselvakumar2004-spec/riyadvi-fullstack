/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT: '#D4AF37', 50: '#fbf6e3', 100: '#f4e8b5', 300: '#e6cb6a', 400: '#dcb94a', 500: '#D4AF37', 600: '#b08d22', 700: '#8a6d1a', 900: '#3a2e0a' },
        ink: { DEFAULT: '#000000', 900: '#050505', 800: '#0b0b0c', 700: '#121214', 600: '#1a1a1d', 500: '#26262b' },
      },
      fontFamily: {
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: { glow: '0 0 60px -10px rgba(212,175,55,.45)' },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
      },
      animation: { marquee: 'marquee 30s linear infinite', float: 'float 6s ease-in-out infinite' },
    },
  },
  plugins: [],
};
