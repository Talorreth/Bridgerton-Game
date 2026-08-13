/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'royal-blue': {
          DEFAULT: '#A4C3D2',
          light: '#C3D9E3',
          dark: '#7FA6B9',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E6CB6E',
          dark: '#A6862A',
        },
        cream: '#FAFAFA',
        rose: {
          DEFAULT: '#FADADD',
          dark: '#F2B9C1',
        },
        ink: '#3A3A3C',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Cormorant Garamond"', 'serif'],
      },
      backgroundImage: {
        'paper-grain': "radial-gradient(circle at 1px 1px, rgba(164,195,210,0.15) 1px, transparent 0)",
      },
      boxShadow: {
        regency: '0 8px 30px -8px rgba(164, 132, 60, 0.35)',
        'regency-lg': '0 20px 50px -12px rgba(58, 58, 60, 0.25)',
      },
      animation: {
        shimmer: 'shimmer 2.5s linear infinite',
        'float-slow': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      transitionTimingFunction: {
        'out-regency': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'in-out-regency': 'cubic-bezier(0.77, 0, 0.175, 1)',
        'drawer-regency': 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
    },
  },
  plugins: [],
}
