/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          'green-deep': '#243D2C',
          'green-mid': '#3A6647',
          'green-light': '#5A9468',
          'green-pale': '#D4E8DA',
          cream: '#F4EFE4',
          'cream-dark': '#E5DDC9',
          sand: '#C8BFA8',
          text: '#1C2B21',
          muted: '#607060',
          white: '#FDFCF9',
        },
        surface: {
          DEFAULT: '#F4EFE4',
          card: '#FDFCF9',
          dark: '#1C2B21',
          'dark-card': '#243D2C',
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
        soft: '0 1px 4px rgba(36, 61, 44, 0.04)',
        card: '0 12px 32px rgba(36, 61, 44, 0.1)',
        nav: '0 2px 16px rgba(36, 61, 44, 0.08)',
        hero: '0 4px 20px rgba(36, 61, 44, 0.25)',
        'hero-hover': '0 8px 30px rgba(36, 61, 44, 0.3)',
        cta: '0 16px 40px rgba(36, 61, 44, 0.12)',
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
