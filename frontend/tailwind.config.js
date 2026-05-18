/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#0d1117",
        surface: "#161b22",
        elevated: "#21262d",
        border: "#30363d",
        foreground: "#e6edf3",
        muted: "#8b949e",
        accent: {
          DEFAULT: "#3fb950",
          dim: "#238636",
          hover: "#2ea043",
          subtle: "rgba(63, 185, 80, 0.15)",
        },
        danger: "#da3633",
        warning: "#d29922",
      },
      fontFamily: {
        sans: ['"Geist"', '"Inter"', "system-ui", "sans-serif"],
        mono: ['"Geist Mono"', "ui-monospace", "monospace"],
      },
      borderRadius: {
        DEFAULT: "8px",
        lg: "10px",
        xl: "12px",
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.96)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
        "scale-in": "scale-in 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.25s ease-out",
      },
    },
  },
  plugins: [],
};
