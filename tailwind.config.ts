import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        surface: "#1a1a1a",
        primary: {
          DEFAULT: "#3b82f6",
          hover: "#2563eb",
        },
        secondary: "#8b5cf6",
        accent: "#06b6d4",
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        text: {
          primary: "#ffffff",
          secondary: "#a3a3a3",
          muted: "#525252",
        },
      },
    },
  },
  plugins: [],
};

export default config;
