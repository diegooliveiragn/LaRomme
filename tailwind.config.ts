import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#111111",
          offwhite: "#F2F1ED",
          red: "#8B1E1E",
          gray: "#7A7A7A",
        },
      },
      fontFamily: {
        // Mapeamento exato da Tríade Tipográfica LaRomme
        sans: ['var(--font-sans)', 'sans-serif'],
        serif: ['var(--font-serif)', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      letterSpacing: {
        editorial: '0.2em',
      }
    },
  },
  plugins: [],
};
export default config;