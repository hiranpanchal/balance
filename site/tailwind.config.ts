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
        cream: "#EAE2D2",
        "cream-light": "#F5F0E6",
        teal: "#3E4F56",
        "teal-deep": "#28363C",
        gold: "#B28B5D",
        "gold-light": "#D2B894",
        stone: "#A09687",
        charcoal: "#2D2D2D",
        error: "#A34A3B",
      },
      fontFamily: {
        display: ["var(--font-display)", "Playfair Display", "Georgia", "serif"],
        script: ["var(--font-script)", "Allura", "cursive"],
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
      },
      fontSize: {
        eyebrow: ["11px", { lineHeight: "14px", letterSpacing: "0.22em" }],
        small: ["13px", { lineHeight: "20px" }],
        body: ["16px", { lineHeight: "26px" }],
        lead: ["20px", { lineHeight: "30px" }],
        h3: ["24px", { lineHeight: "32px" }],
        h2: ["36px", { lineHeight: "44px" }],
        h1: ["48px", { lineHeight: "56px" }],
        display: ["72px", { lineHeight: "80px" }],
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
        lg: "8px",
      },
      transitionTimingFunction: {
        "out-soft": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
