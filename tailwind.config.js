/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#eef1f6",
        ink: {
          DEFAULT: "#0f1115",
          soft: "#4b5160",
        },
        mint: {
          50: "#eefdf6",
          100: "#d7f9e9",
          200: "#aef0d3",
          300: "#78e0b8",
          400: "#3fc99b",
          500: "#1fae82",
          600: "#128c68",
          700: "#0f7057",
          800: "#0e5945",
          900: "#0c4a3a",
        },
        sidebar: {
          DEFAULT: "#14161c",
          soft: "#1c1f27",
          border: "#2a2d38",
        },
        sev: {
          critical: "#e0304a",
          high: "#e08a2b",
          medium: "#e0b32b",
        },
        badge: {
          pink: "#db2777",
          pinkBg: "#fce7f3",
          orange: "#c2410c",
          orangeBg: "#ffedd5",
          red: "#dc2626",
          redBg: "#fee2e2",
          green: "#16a34a",
          greenBg: "#dcfce7",
          yellow: "#a16207",
          yellowBg: "#fef9c3",
          blue: "#1d4ed8",
          blueBg: "#dbeafe",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,17,21,0.04), 0 8px 24px rgba(15,17,21,0.06)",
        cardHover: "0 4px 10px rgba(15,17,21,0.06), 0 16px 32px rgba(15,17,21,0.09)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
