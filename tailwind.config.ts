import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        foreground: "oklch(var(--foreground) / <alpha-value>)",
        black: "oklch(var(--foreground) / <alpha-value>)",
        fyf: {
          black: "oklch(var(--foreground) / <alpha-value>)",
          orange: "#FF841D",
          hover: "#e57212",
          50: "#fff8f1",
          100: "#feefdc",
          200: "#fedcb8",
          300: "#fcc389",
          400: "#faa254",
          500: "#FF841D",
          600: "#e57212",
          700: "#c74f0c",
          800: "#9e3f11",
          900: "#7f3512",
          950: "#451806",
        },
        alina: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#171717",
          700: "#0a0a0a",
          800: "#000000",
          900: "#000000",
          950: "#000000",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "GeistSans", "GeistSans Fallback", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        display: ["var(--font-geist-sans)", "GeistSans", "GeistSans Fallback", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
