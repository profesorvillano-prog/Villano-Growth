import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#09090b",
        panel: "#101014",
        card: "#131318",
        line: "#1f1f26",
        soft: "#26262e",
        ink: "#f4f4f5",
        mute: "#8f8f9d",
        dim: "#5d5d6b",
        accent: "#8b5cf6",
        accent2: "#a78bfa",
        ok: "#34d399",
        warn: "#fbbf24",
        bad: "#fb7185",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
