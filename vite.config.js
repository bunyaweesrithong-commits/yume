import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about.html"),
        yume: resolve(__dirname, "yume.html"),
        oc: resolve(__dirname, "oc.html"),
        gallery: resolve(__dirname, "gallery.html"),
      },
    },
  },
});