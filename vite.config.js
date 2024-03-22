import { defineConfig } from "vite";
import { resolve } from "path";
import postcssNesting from "postcss-nesting";

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        require("tailwindcss"),
        require("autoprefixer"),
        postcssNesting,
      ],
    },
  },
});
