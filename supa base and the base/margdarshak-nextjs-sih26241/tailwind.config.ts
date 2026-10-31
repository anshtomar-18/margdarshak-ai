import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          tint: 'var(--color-primary-tint)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          tint: 'var(--color-accent-tint)',
        },
        background: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
        },
        semantic: {
          success: '#2E7D32',
          warning: '#B26A00',
          error: '#C62828',
          info: '#1F5FA8',
        }
      },
      fontFamily: {
        heading: ['var(--font-poppins)', 'var(--font-noto-devanagari)', 'sans-serif'],
        sans: ['var(--font-inter)', 'var(--font-noto-devanagari)', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
      }
    },
  },
  plugins: [],
};

export default config;
