/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060b18',
          900: '#0a0f1e',
          800: '#0d1529',
          700: '#111827',
          600: '#1a2744',
        },
        teal: {
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
        },
        slate: {
          750: '#2a3a52',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(20,184,166,0.15), transparent)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      boxShadow: {
        'glow-teal': '0 0 30px rgba(20,184,166,0.25)',
        'glow-sm': '0 0 10px rgba(20,184,166,0.15)',
      }
    },
  },
  plugins: [],
}
