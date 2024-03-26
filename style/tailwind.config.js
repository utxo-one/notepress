/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        //accent:{
        //  1: "",
        //  2: "",
        //},
        bkg: "var(--color-bkg)", 
        content: "var(--color-content)", 
      }
    },
  },
  plugins: [],
};
