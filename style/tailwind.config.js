/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        bgPrimary: "var(--color-bgPrimary)", 
        bgSecondary:"var(--color-bgSecondary)",
        bgInverted: "var(--color-bgInverted)",
        text: "var(--color-text)", 
        textMuted: "var(--color-textMuted)",
        textInverted: "var(--color-textInverted)",
      }
    },
  },
  plugins: [],
};
