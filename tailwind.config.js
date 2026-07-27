/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./index.ts", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Atlas Island warm stone foundation
        island: {
          950: "#1a1410",
          900: "#231a14",
          800: "#2d2118",
          700: "#3d2d20",
          600: "#574136",
          500: "#7a5d4d",
          400: "#a38a76",
          300: "#c7b39e",
          200: "#e0d4c2",
          100: "#f2ebe0",
          50: "#fbf7f0",
        },
        // 12 Ray frequencies — default sacred palette
        ray: {
          red: "#ef4444",
          orange: "#f97316",
          yellow: "#facc15",
          green: "#22c55e",
          turquoise: "#2dd4bf",
          blue: "#3b82f6",
          indigo: "#6366f1",
          violet: "#8b5cf6",
          magenta: "#d946ef",
          carbon: "#0f0a0a",
          elemental: "#a5f3fc",
          infinite: "#7dd3fc",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
