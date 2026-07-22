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
        paper: "#fbfbfa",
        ink: "#171717",
        muted: "#5f6368",
      },
    },
  },
  plugins: [],
};
