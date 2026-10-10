// Minimal error reporting shim.
//
// The original project shipped an import of `reportLovableError` from this
// module in `src/routes/__root.tsx`, but the file itself was never committed.
// This stub restores a working build by providing a no-op implementation so
// errors caught by the React error boundary are still surfaced to the
// console (and the browser's built-in error reporting) without breaking
// server-side rendering.

export type LovableErrorContext = Record<string, unknown> & {
  boundary?: string;
};

/**
 * Report a rendering error. Defaults to logging to the console; can be swapped
 * for a remote error-reporting transport later without touching call sites.
 */
export function reportLovableError(error: unknown, context: LovableErrorContext = {}): void {
  // Avoid throwing if `console` is unavailable (SSR edge runtimes).
  if (typeof console === "undefined" || typeof console.error !== "function") return;
  const label = context.boundary ? `[${context.boundary}]` : "[orion-worship]";
  console.error(label, error);
}
