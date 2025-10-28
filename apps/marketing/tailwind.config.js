/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [  
    './apps/marketing/app/**/*.{js,ts,jsx,tsx,mdx,html}',
    './apps/marketing/components/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx,html}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx}',

  ],
  safelist: [
    { pattern: /^(bg|text|border|ring)-(primary|secondary|accent|background|foreground|border|muted|error|success|warning|info|hover)$/ },
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],       // body text
        heading: ['var(--font-heading)', 'sans-serif'],               // headings
        mono: ['Fira Code', 'monospace'],                             // code
      },
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        border: 'var(--color-border)',
        muted: 'var(--color-muted)',
        error: 'var(--color-error)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        info: 'var(--color-info)',
        hover: 'var(--color-hover)',
      },
    },
  },
  plugins: [],
}

