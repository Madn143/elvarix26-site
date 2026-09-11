/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0906",       // primary near-black background
        coal: "#14100C",      // secondary panel background
        coffee: "#241811",    // dark coffee brown surface
        coffeeLight: "#3A2818",
        copper: {
          DEFAULT: "#BF6A2E",
          light: "#D98A4F",
          dark: "#8F4E1E",
        },
        gold: "#D4A94A",
        parchment: "#F3EAE0",
        muted: "#9C8A78",
      },
      fontFamily: {
        display: ["'Cinzel'", "serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "circuit-grid":
          "linear-gradient(rgba(191,106,46,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(191,106,46,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        circuit: "48px 48px",
      },
      keyframes: {
        traceLine: {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        emberPulse: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        trace: "traceLine 2.4s ease-out forwards",
        ember: "emberPulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
