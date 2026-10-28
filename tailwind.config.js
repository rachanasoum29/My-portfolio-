/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#F8F4ED',
          200: '#F4EFE6',
          300: '#E9E0D3',
          400: '#DCCFBE',
        },
        oxblood: {
          50: '#FDF2F3',
          100: '#FBE8E9',
          500: '#8E1727',
          700: '#60121D',
          800: '#460C14',
          900: '#2E060C',
        },
        sand: {
          100: '#F2EDE5',
          200: '#E3DAC9',
          300: '#D5C9B3',
          500: '#7A6B63',
          700: '#554A43',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Bodoni Moda"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(70, 12, 20, 0.15)',
        'luxury-lg': '0 30px 60px -20px rgba(70, 12, 20, 0.25)',
      }
    },
  },
  plugins: [],
}
