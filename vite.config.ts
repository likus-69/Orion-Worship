import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

// Vite configuration for Orion-Worship.
//
// `@lovable.dev/vite-tanstack-config` is a thin wrapper that wires up the
// plugins TanStack Start needs in the correct order. We add vite-plugin-pwa
// on top so the app installs as a PWA and runs fully offline.
//
// The service worker precaches the entire app shell (HTML, JS, CSS, fonts,
// background images) so the app works with zero internet connectivity.
// User data (songs, service plans, media) is stored in the Origin Private
// File System (OPFS) — see src/lib/opfs-storage.ts.
export default defineConfig({
  // Self-host / local-only build: don't pull in the Nitro/Cloudflare deploy
  // plugin. The dev server and `vite build` both work without it.
  nitro: false,

  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: [
        "favicon.ico",
        "icons/icon-192.png",
        "icons/icon-512.png",
        "fonts/*.woff2",
        "backgrounds/*.svg",
      ],
      manifest: {
        name: "Orion Worship",
        short_name: "Orion",
        description:
          "Church presentation software for worship services, scripture, lyrics, and sermon slides. Runs fully offline.",
        theme_color: "#1a1c2e",
        background_color: "#0e0f1a",
        display: "standalone",
        orientation: "landscape",
        scope: "/",
        start_url: "/",
        categories: ["productivity", "utilities"],
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // Precache everything for full offline support.
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2,woff}"],
        // Bump the limit so the background images + fonts fit.
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        runtimeCaching: [
          {
            // Cache Google Fonts requests at runtime (for the initial load
            // before the locally-bundled fonts kick in).
            urlPattern: ({ url }) => url.origin === "https://fonts.googleapis.com",
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "google-fonts-stylesheets",
              expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
});
