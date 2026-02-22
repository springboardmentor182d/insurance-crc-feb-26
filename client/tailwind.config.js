/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1B5E20",
        secondary: "#2E7D32",
        success: "#00C853",
        standard: "#4CAF50",
        lightgreen: "#E8F5E9",
        appbg: "#F8FAFC",
      },
      borderRadius: {
        card: "12px",
      },
      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [],
  fontFamily: {
  inter: ["Inter", "sans-serif"],
},
};