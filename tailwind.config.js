/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Assistant"', '"Heebo"', 'system-ui', 'sans-serif'],
        display: ['"Frank Ruhl Libre"', 'Georgia', 'serif'],
      },
      colors: {
        parchment: {
          50: '#fdfbf7',
          100: '#f8f3ea',
          200: '#efe5d4',
          300: '#e2d3b8',
          400: '#cfb98f',
        },
        ink: {
          900: '#12203a',
          800: '#1b2d4f',
          700: '#274067',
          600: '#3b5680',
          400: '#7288a8',
        },
        gold: {
          500: '#c19a4b',
          600: '#a37f36',
          100: '#f5e9d2',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(18,32,58,.05), 0 8px 24px -12px rgba(18,32,58,.18)',
        pop: '0 12px 40px -12px rgba(18,32,58,.30)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-in-right': {
          from: { transform: 'translateX(-24px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-up': {
          from: { transform: 'translateY(16px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in .25s ease-out both',
        'slide-in-right': 'slide-in-right .28s cubic-bezier(.2,.8,.2,1) both',
        'slide-up': 'slide-up .3s cubic-bezier(.2,.8,.2,1) both',
      },
    },
  },
  plugins: [],
};
