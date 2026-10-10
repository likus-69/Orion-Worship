import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Vite configuration for Orion-Worship.
//
// `@lovable.dev/vite-tanstack-config` is a thin wrapper that wires up the
// plugins TanStack Start needs in the correct order:
//   - @tanstack/react-start/plugin/vite  (route generation, SSR, RSC)
//   - @vitejs/plugin-react                (Fast Refresh, JSX transform)
//   - @tailwindcss/vite                   (Tailwind v4 build)
//   - vite-tsconfig-paths                 (@/* path alias from tsconfig.json)
//   - @tanstack/devtools-vite             (dev-only, auto-stripped on build)
//
// Passing no arguments uses the Lovable defaults, which match this project's
// shape: src/ layout, src/router.tsx as the router entry, src/start.ts as the
// Start entry, and src/server.ts as the custom server entry. Override any of
// those by passing an options object, e.g.:
//
//   defineConfig({ tanstackStart: { srcDirectory: "app" } })
//
// Disable the production deploy target (Nitro / Cloudflare) by passing
// `nitro: false` — useful when you just want a runnable local preview.
export default defineConfig({
  // Self-host / local-only build: don't pull in the Nitro/Cloudflare deploy
  // plugin. The dev server and `vite build` both work without it; flip this
  // back to `true` (or remove the line) when you're ready to deploy.
  nitro: false,
});
