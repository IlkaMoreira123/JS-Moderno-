/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#eef3fa",
          100: "#d9e3f2",
          200: "#b4c7e4",
          300: "#86a3d1",
          400: "#5b7fbb",
          500: "#3d62a3",
          600: "#2d4d87",
          700: "#243e6d",
          800: "#1c3156",
          900: "#14233f",
          950: "#0d172b",
        },
        sky: {
          50: "#eff8ff",
          100: "#dbeefe",
          200: "#bfe2fe",
          300: "#93d0fd",
          400: "#60b4fa",
          500: "#3b95f6",
          600: "#2577eb",
        },
      },
      fontFamily: {
        sans: ['"Inter Tight"', "system-ui", "-apple-system", '"Segoe UI"', "Roboto", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(20, 35, 63, 0.06)",
      },
    },
  },
  plugins: [],
};
