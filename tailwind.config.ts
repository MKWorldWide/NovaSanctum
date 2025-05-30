import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mystical: {
          emerald: '#00FF9D',
          cyan: '#00FFFF',
          dark: '#1A1A1A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'morph': 'morph 15s ease infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'neon-flicker': 'neon-flicker 2s ease-in-out infinite',
      },
      keyframes: {
        morph: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        'neon-flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      backgroundImage: {
        'mystical-gradient': 'linear-gradient(45deg, rgba(0, 255, 157, 0.1), rgba(0, 255, 255, 0.1), rgba(26, 26, 26, 0.1))',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(0, 255, 157, 0.3)',
      },
    },
  },
  plugins: [],
}

export default config 