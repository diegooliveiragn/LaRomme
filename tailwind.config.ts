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
        brand: {
          red: '#8B1E1E',
          black: '#111111',
          gray: '#7A7A7A',
          offwhite: '#F2F1ED',
          pureWhite: '#FFFFFF',
        },
      },
      fontFamily: {
        serif: ['var(--font-libre-baskerville)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.25em',
        editorial: '0.15em',
      },
    },
  },
  plugins: [],
};
export default config;
