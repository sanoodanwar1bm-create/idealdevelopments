/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        title: "var(--font-montserrat)",
        subtitle: "var(--font-poppins)",
        body: "var(--font-roboto)",
        quote: "var(--font-playfair)",
        display: ["var(--font-sora)", "system-ui", "sans-serif"],
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        brand: ["var(--font-saira)", "system-ui", "sans-serif"],
      },
      colors: {
        primary: "#0a284e",
        accent: "#d4af37",
        teal: "#157a6e",
        mint: "#e6f4f1",
        lightgray: "#f2f2f2",
        grayblue: "#b4c5d1",
        ink: "#0a284e",
        ivory: "#f7f5f0",
        stone: {
          50: "#fbfaf7",
          100: "#f3f0e9",
          200: "#e7e2d7",
          300: "#d6cfc0",
          400: "#a9a192",
          500: "#7b7568",
        },
        gold: {
          300: "#ecd78f",
          400: "#e2c25e",
          500: "#d4af37",
          600: "#b8942a",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      letterSpacing: {
        tightest: "-0.045em",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(10,40,78,0.04), 0 8px 24px -8px rgba(10,40,78,0.10)",
        lift: "0 2px 4px rgba(10,40,78,0.04), 0 24px 48px -16px rgba(10,40,78,0.22)",
      },
    },
  },
  plugins: [],
};
