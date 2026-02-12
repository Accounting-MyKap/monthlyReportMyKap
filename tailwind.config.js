/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        primary: {
          DEFAULT: '#004dda',
          light: '#3b7aff',
          dark: '#003399',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#004dda',
          600: '#003cb3',
          700: '#003399',
          800: '#002b80',
          900: '#001f5c',
        },
        // Accent Colors
        accent: {
          orange: '#f97316',
          green: '#22c55e',
          cyan: '#0891b2',
          purple: '#8b5cf6',
          pink: '#d946ef',
        },
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(0, 77, 218, 0.3)',
        'glow-cyan': '0 0 20px rgba(8, 145, 178, 0.3)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.3)',
        'card': '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08)',
        'card-hover': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'fade-in-scale': 'fadeInScale 0.25s ease-out forwards',
        'slide-up': 'slideUp 0.35s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInScale: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 77, 218, 0.3)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
    },
  },
  plugins: [],
}