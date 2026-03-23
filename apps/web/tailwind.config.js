/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          // Verde — paleta refinada (mais escuro e firme)
          'green-deep': '#192F1A',
          'green-mid': '#25461E',
          'green-light': '#3D6A27',
          'green-pale': '#E6F0DA',
          'green-xs': '#B8D09A',
          // Bege — mais quente e sólido
          cream: '#EDE7DA',
          'cream-dark': '#DDD4C3',
          'cream-darker': '#BDB2A0',
          sand: '#BDB2A0',
          // Backgrounds
          off: '#F7F3EC',
          white: '#F7F3EC',
          // Texto — mais denso
          text: '#141F14',
          'text-md': '#314230',
          muted: '#5C7260',
          'text-xs': '#8A9C8C',
        },
        surface: {
          DEFAULT: '#F7F3EC',
          card: '#FFFFFF',
          dark: '#141F14',
          'dark-card': '#192F1A',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
      },
      borderRadius: {
        card: '18px',
        btn: '100px',
        banner: '24px',
      },
      boxShadow: {
        soft: '0 1px 4px rgba(25, 47, 26, 0.04)',
        card: '0 12px 32px rgba(25, 47, 26, 0.08)',
        nav: '0 2px 16px rgba(25, 47, 26, 0.06)',
        hero: '0 4px 20px rgba(25, 47, 26, 0.25)',
        'hero-hover': '0 8px 30px rgba(25, 47, 26, 0.3)',
        cta: '0 16px 40px rgba(25, 47, 26, 0.12)',
      },
      keyframes: {
        fadeDown: {
          from: { opacity: '0', transform: 'translateY(-14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { transform: 'translateY(-50%) scale(1)' },
          '50%': { transform: 'translateY(-50%) scale(1.07)' },
        },
      },
      animation: {
        'fade-down': 'fadeDown 0.6s ease both',
        'fade-up': 'fadeUp 0.7s ease both',
        'fade-up-1': 'fadeUp 0.7s 0.1s ease both',
        'fade-up-2': 'fadeUp 0.7s 0.2s ease both',
        'fade-up-3': 'fadeUp 0.7s 0.3s ease both',
        'fade-up-4': 'fadeUp 0.7s 0.4s ease both',
        'pulse-slow': 'pulse 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
