import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";
import { VitePWA } from "vite-plugin-pwa";
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
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["assets/**/*"],
      manifest: {
        name: "Puasa Ayyamul Bidh",
        short_name: "Ayyamul Bidh",
        description:
          "Aplikasi web untuk tracking puasa Ayyamul Bidh (13, 14, 15 Hijriyah) dengan fitur jadwal waktu shalat, kalender Hijriyah, dan statistik puasa.",
        theme_color: "#1e3a8a",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/puasa-ayyamul-bidh/",
        icons: [
          {
            src: "/puasa-ayyamul-bidh/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/puasa-ayyamul-bidh/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/puasa-ayyamul-bidh/maskable-icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.aladhan\.com\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "aladhan-api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
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
