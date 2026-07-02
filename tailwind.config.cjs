/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          ...defaultTheme.fontFamily.sans,
        ],
      },
      colors: {
        paper: "#f8f7f3",
        ink: "#171717",
        muted: "#5f6368",
        accent: "#2454ff",
        playful: "#f04f8b",
        moss: "#1e7a52",
      },
      boxShadow: {
        soft: "0 18px 50px rgba(23, 23, 23, 0.08)",
      },
    },
  },
  plugins: [],
};
