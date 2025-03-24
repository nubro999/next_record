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
        background: '#1A1A40',
        foreground: '#ffffff',
        primary: '#7A0BC0',
        secondary: '#270082',
        accent: '#FA58B6',
        muted: '#2A2A60',
        card: '#121230',
        'card-foreground': '#ffffff',
        border: '#270082',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        fell: ['IM Fell English', 'serif'],
        eczar: ['Eczar', 'serif'],
      },
      backgroundImage: {
        'gradient-gothic': 'linear-gradient(to bottom, #1A1A40, #121230)',
        'gradient-accent': 'linear-gradient(90deg, transparent, #7A0BC0, transparent)',
        'gradient-modern': 'linear-gradient(135deg, #270082, #7A0BC0, #FA58B6)',
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
        'gothic': '0 4px 10px rgba(0, 0, 0, 0.5), 0 0 40px rgba(122, 11, 192, 0.15)',
        'inner-gothic': 'inset 0 2px 4px rgba(0, 0, 0, 0.5)',
        'modern': '0 10px 25px -3px rgba(122, 11, 192, 0.2)',
        'glow': '0 0 15px rgba(250, 88, 182, 0.5)',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}