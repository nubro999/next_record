/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#121212',
        foreground: '#d1b48c',
        primary: '#8b0000',
        secondary: '#482d2d',
        accent: '#d1b48c',
        muted: '#392727',
        card: '#1a1a1a',
        'card-foreground': '#d1b48c',
        border: '#392727',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        fell: ['IM Fell English', 'serif'],
        eczar: ['Eczar', 'serif'],
      },
      backgroundImage: {
        'gradient-gothic': 'linear-gradient(to bottom, #121212, #1a0a0a)',
        'gradient-accent': 'linear-gradient(90deg, transparent, #8b0000, transparent)',
      },
      animation: {
        'flicker': 'flicker 4s infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: 0.8 },
          '50%': { opacity: 1 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'gothic': '0 4px 10px rgba(0, 0, 0, 0.5), 0 0 40px rgba(139, 0, 0, 0.1)',
        'inner-gothic': 'inset 0 2px 4px rgba(0, 0, 0, 0.5)',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}