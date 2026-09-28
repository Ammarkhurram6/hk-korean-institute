/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0a1f44", // Light mode ke liye (brand)
        kred: "#CD2E3A", // Brand red
        charcoal: "#0B0A08", // 🔥 NAYA: Warm obsidian black (blue nahi!)
        lightgray: "#f4f6f9",
        ember: "#E8593A", // 🔥 Naya warm accent
        gold: "#D4A853", // 🔥 Premium gold accent
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        display: ["Montserrat", "sans-serif"],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        gradient: "gradient 8s linear infinite",
        ripple: "ripple 0.6s linear",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        gradient: {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "0.5" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
