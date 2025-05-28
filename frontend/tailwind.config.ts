import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        'primary-dark': 'var(--color-primary-dark)',
        accent: 'var(--color-accent)',
        'accent-dark': 'var(--color-accent-dark)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'surface-light': 'var(--color-surface-light)',
        text: 'var(--color-text)',
        'text-light': 'var(--color-text-light)',
        'text-muted': 'var(--color-text-muted)',
        error: 'var(--color-error)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        border: 'var(--color-border)',
        'border-hover': 'var(--color-border-hover)',
      },
    },
  },
  plugins: [],
};

export default config; 