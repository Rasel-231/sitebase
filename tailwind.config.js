/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      colors: {
        midnight: "#0a0a16",
        "midnight-2": "#0f1122",
        "ink-dark": "#05050f",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        floatBlob: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(60px, -80px) scale(1.15)" },
          "66%": { transform: "translate(-50px, 40px) scale(0.9)" },
        },
        spinSlow: {
          to: { transform: "rotate(360deg)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        floatBlob: "floatBlob 20s ease-in-out infinite",
        spinSlow: "spinSlow 2.5s linear infinite",
        marquee: "marquee 22s linear infinite",
      },
    },
  },
  plugins: [],
};