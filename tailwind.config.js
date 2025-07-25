/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          400: '#00FF9D',
          500: '#00FF9D',
          600: '#00FF9D',
        },
        cyan: {
          400: '#00FFFF',
          500: '#00FFFF',
          600: '#00FFFF',
        },
        slate: {
          800: '#1A1A1A',
          900: '#0A0A0A',
        },
      },
      animation: {
        'morph': 'morph 8s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
      },
      keyframes: {
        morph: {
          '0%': { borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40%/50% 60% 30% 60%' },
          '100%': { borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%' },
        },
        sparkle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
      backgroundImage: {
        'mystical-gradient': 'linear-gradient(45deg, #00FF9D 0%, #00FFFF 100%)',
      },
    },
  },
  plugins: [],
} 