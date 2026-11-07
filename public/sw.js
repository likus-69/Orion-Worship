// Orion Worship Service Worker
// ------------------------------
// A simple, dependency-free service worker that caches the app shell and
// all requests at runtime, enabling full offline operation.
//
// Strategy: stale-while-revalidate for everything. The first visit loads
// from the network and caches; subsequent visits (including offline) load
// from cache instantly, then update in the background.

const CACHE_NAME = "orion-worship-v1";
const PRECACHE_URLS = [
  "/",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/backgrounds/stage-wash.svg",
  "/backgrounds/golden-hour.svg",
  "/backgrounds/deep-indigo.svg",
  "/backgrounds/sanctuary.svg",
  "/backgrounds/slow-particles.svg",
  "/backgrounds/linen-paper.svg",
];

// Install: precache the core assets.
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // Use addAll with individual error handling so one missing asset
      // doesn't break the entire install.
      await Promise.all(
        PRECACHE_URLS.map(async (url) => {
          try {
            await cache.add(url);
          } catch {
            // Asset might not exist yet (e.g. during dev) — skip silently.
          }
        }),
      );
      await self.skipWaiting();
    })(),
  );
});

// Activate: clean up old caches.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
      await self.clients.claim();
    })(),
  );
});

// Fetch: stale-while-revalidate for same-origin GET requests.
self.addEventListener("fetch", (event) => {
  const request = event.request;
  // Only handle GET requests; skip cross-origin and extension requests.
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // Skip Vite HMR and dev-specific requests.
  if (url.pathname.startsWith("/@") || url.pathname.includes("hot-update")) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      // Stale-while-revalidate: serve from cache immediately if available,
      // then fetch a fresh copy in the background.
      const fetchPromise = fetch(request)
        .then((response) => {
          // Only cache successful, same-origin responses.
          if (response.ok && response.type === "basic") {
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })(),
  );
});

// Allow the page to trigger immediate activation.
self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") self.skipWaiting();
});
