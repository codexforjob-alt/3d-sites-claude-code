import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: 'var(--ink)',
          soft: 'var(--ink-soft)',
        },
        brand: {
          DEFAULT: 'var(--brand)',
          deep: 'var(--brand-deep)',
        },
        mint: {
          DEFAULT: 'var(--mint)',
          50: 'var(--mint-50)',
        },
        soft: {
          blue: 'var(--blue)',
          50: 'var(--blue-50)',
        },
        mist: 'var(--mist)',
        line: 'var(--line)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      maxWidth: {
        prose: '62ch',
      },
    },
  },
  plugins: [],
}

export default config
