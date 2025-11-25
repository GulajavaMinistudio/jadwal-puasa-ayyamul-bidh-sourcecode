import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  // Base path untuk GitHub Pages
  // Ganti 'puasa-ayyamul-bidh' dengan nama repository Anda
  base: "/puasa-ayyamul-bidh/",

  plugins: [
    legacy({
      targets: ["defaults", "not IE 11"],
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
    }),
  ],

  build: {
    // Output directory
    outDir: "dist",

    // Empty output directory before build
    emptyOutDir: true,

    // Generate sourcemaps for debugging (optional, set false for smaller build)
    sourcemap: false,

    // Minify with terser for better compression
    minify: "terser",

    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },

    // Rollup options untuk multi-page
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

    // Chunk size warning limit (500kb)
    chunkSizeWarningLimit: 500,
  },

  // Development server configuration
  server: {
    port: 5173,
    open: true,
    cors: true,
  },

  // Preview server (after build)
  preview: {
    port: 4173,
    open: true,
  },
});
