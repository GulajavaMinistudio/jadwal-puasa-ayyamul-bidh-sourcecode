import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    legacy({
      targets: ["ie >= 11"],
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        kalender: resolve(__dirname, "kalender.html"),
        tracker: resolve(__dirname, "tracker.html"),
        jadwal: resolve(__dirname, "jadwal-shalat.html"),
        panduan: resolve(__dirname, "panduan.html"),
        pengaturan: resolve(__dirname, "pengaturan.html"),
      },
    },
  },
});
