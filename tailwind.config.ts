import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dream: {
          bg: "#0a0a12",
          surface: "#12121f",
          primary: "#8b5cf6",
          jungian: "#f59e0b",
          cognitive: "#3b82f6",
          clinical: "#10b981",
          text: "#e2e8f0",
          muted: "#64748b",
        },
      },
    },
  },
  plugins: [],
};
export default config;
