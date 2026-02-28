import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          25: "#e8fff4",
          50: "#d2fbe7",
          100: "#bdfadc",
          200: "#90fdc8",
          300: "#83e3b4",
          400: "#55EAA1",
          500: "#24ea8a",
          600: "#2ed484",
        },
      },
      animation: {
        toastIn: "toastIn .8s both",
        toastOut: "toastOut .8s both",
      },
      keyframes: {
        toastIn: {
          "0%": {
            transform: "var(--elm-translate) scale(0.7)",
            opacity: "0.7",
          },
          "80%": { transform: "translate(0px) scale(0.7)", opacity: "0.7" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        toastOut: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "20%": { transform: "translate(0px) scale(0.7)", opacity: "0.7" },
          "100%": {
            transform: "var(--elm-translate) scale(0.7)",
            opacity: "0.7",
          },
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
} satisfies Config;
