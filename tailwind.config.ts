import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0d14",
        surface: {
          50: "#141923",
          100: "#1a2130",
          200: "#222b3d",
          300: "#2d374d",
          400: "#3d4b66",
        },
        brand: {
          primary: "#6366f1",
          secondary: "#ec4899",
          accent: "#f59e0b",
          success: "#10b981",
          warning: "#f59e0b",
          danger: "#ef4444",
        },
        leetcode: {
          easy: "#00b8a3",
          medium: "#ffc01e",
          hard: "#ff375f",
        },
        codeforces: {
          newbie: "#808080",
          pupil: "#008000",
          specialist: "#03a89e",
          expert: "#0000ff",
          candidateMaster: "#aa00aa",
          master: "#ff8c00",
          grandmaster: "#ff0000",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 10px rgba(99, 102, 241, 0.2)" },
          "100%": { boxShadow: "0 0 25px rgba(99, 102, 241, 0.6)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        }
      }
    },
  },
  plugins: [],
};
export default config;
