/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"], // Enables dark mode by class
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}", // Scans all relevant files for Tailwind classes
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Use Inter font for sans-serif
      },
      colors: {
        background: "#f0fdf4", // Soft green background
        foreground: "#14532d", // Dark green text
        primary: {
          DEFAULT: "#22c55e", // Vibrant green
          light: "#4ade80", // Light green for hover/focus
          dark: "#15803d", // Darker green for accents
        },
        secondary: {
          DEFAULT: "#bbf7d0", // Soft pastel green
        },
        accent: {
          DEFAULT: "#86efac", // Light green accent
        },
      },
      boxShadow: {
        "3xl": "0 30px 60px -15px rgba(34, 197, 94, 0.3)", // Green shadow effect
      },
      borderRadius: {
        xl: "1rem", // Standard rounded corners
        "2xl": "1.5rem", // Larger rounded corners for elements
      },
      transitionProperty: {
        width: "width", // Smooth width transition
        spacing: "margin, padding", // Smooth transition for margin/padding
      },
    },
  },
  plugins: [],
};
