import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: "#0f1f17",
          900: "#1a3a2a",
          700: "#2d5a3d",
          500: "#4a7c59",
        },
        sage: {
          DEFAULT: "#7d9b76",
          light: "#b6ccb0",
        },
        parchment: "#f2ede4",
        cream: "#faf7f2",
        amber: {
          DEFAULT: "#c4944b",
          dark: "#9e6f2e",
        },
        ink: {
          DEFAULT: "#2d2418",
          light: "#5c4e3d",
        },
        rust: "#b55b3c",
        moss: "#6b7f52",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-crimson)", "Georgia", "serif"],
        hand: ["var(--font-caveat)", "cursive"],
      },
    },
  },
  plugins: [],
};

export default config;
