import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#E24B4A",
          "red-dark": "#791F1F",
          "red-darker": "#501313",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          soft: "#FCFCFB",
          card: "#F9F8F6",
        },
        criticality: {
          critical: "#791F1F",
          high: "#E24B4A",
          medium: "#EF9F27",
          low: "#639922",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(80, 19, 19, 0.04), 0 1px 3px 0 rgba(80, 19, 19, 0.06)",
        "card-hover": "0 8px 24px -4px rgba(121, 31, 31, 0.12), 0 2px 8px -2px rgba(121, 31, 31, 0.08)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "pulse-soft": "pulse-soft 2.5s ease-in-out infinite",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgba(121,31,31,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(121,31,31,0.05) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
export default config;
