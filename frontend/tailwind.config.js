/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        background: "#f0fdf4", // Soft green background
        foreground: "#14532d", // Dark green text
        primary: {
          DEFAULT: "#22c55e", // Vibrant green
          light: "#4ade80",
          dark: "#15803d",
        },
        secondary: {
          DEFAULT: "#bbf7d0", // Soft pastel green
        },
        accent: {
          DEFAULT: "#86efac", // Light green accent
        },
      },
      boxShadow: {
        "3xl": "0 30px 60px -15px rgba(34, 197, 94, 0.3)", // Green shadow
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      transitionProperty: {
        width: "width",
        spacing: "margin, padding",
      },
    },
  },
  plugins: [],
};
