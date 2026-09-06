import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ts: {
          green: '#72C100', // Pantone 368 C
          'green-hover': '#61A600',
          'green-dark': '#4A8000',
          'green-light': '#F2FBE5',
          'green-subtle': '#E2F7C2',
          blue: '#2E5090', // Pantone 7684 C
          'blue-hover': '#244177',
          'blue-dark': '#16243D',
          'blue-light': '#EFF6FF',
          'blue-subtle': '#DBEAFE',
          navy: '#16243D',
          'navy-card': '#1C2E4E',
          'navy-border': '#2A3F66',
        },
        status: {
          diagnostic: '#D97706',
          reparation: '#2563EB',
          pieces: '#7C3AED',
          controle: '#059669',
          livraison: '#0D9488',
          livre: '#16A34A',
          bloque: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'ts-sm': '0 1px 3px rgba(22, 36, 61, 0.05)',
        'ts': '0 4px 12px rgba(22, 36, 61, 0.08)',
        'ts-md': '0 8px 24px rgba(22, 36, 61, 0.12)',
        'ts-lg': '0 16px 36px rgba(22, 36, 61, 0.16)',
        'ts-green': '0 4px 14px rgba(114, 193, 0, 0.35)',
        'ts-blue': '0 4px 14px rgba(46, 80, 144, 0.35)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-left': 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};

export default config;
