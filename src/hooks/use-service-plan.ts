import * as React from "react";

import { serviceItems, type ServiceItem } from "@/lib/service-data";

const SERVICE_PLAN_STORAGE_KEY = "orion-worship:service-plan:v1";

/**
 * Persist the service plan to localStorage so songs added during a service
 * survive a page refresh. The hook mirrors `useSongLibrary`'s shape: it
 * starts from the seed plan so SSR and first-paint render match, then
 * hydrates from localStorage after mount.
 *
 * Cross-tab sync is handled via the `storage` event — two operator windows
 * open on the same origin will see the same plan.
 *
 * The hook also exposes `resetPlan` to discard saved changes and return to
 * the seed service plan.
 */
export function useServicePlan() {
  const [items, setItems] = React.useState<ServiceItem[]>(serviceItems);
  const [hydrated, setHydrated] = React.useState(false);

  // Hydrate from localStorage on mount.
  React.useEffect(() => {
    setItems(loadServicePlan());
    setHydrated(true);

    const onStorage = (event: StorageEvent) => {
      if (event.key === SERVICE_PLAN_STORAGE_KEY) {
        setItems(loadServicePlan());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Persist on every change (after hydration so we don't overwrite the saved
  // plan with the seed before we've loaded it).
  React.useEffect(() => {
    if (!hydrated) return;
    saveServicePlan(items);
  }, [items, hydrated]);

  const resetPlan = React.useCallback(() => {
    setItems(serviceItems);
  }, []);

  return { items, setItems, resetPlan, hydrated };
}

function loadServicePlan(): ServiceItem[] {
  if (typeof window === "undefined" || !window.localStorage) return serviceItems;
  try {
    const raw = window.localStorage.getItem(SERVICE_PLAN_STORAGE_KEY);
    if (!raw) return serviceItems;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return serviceItems;
    const items = parsed.filter(isStoredServiceItem).map(normalizeStoredItem);
    return items.length > 0 ? items : serviceItems;
  } catch {
    return serviceItems;
  }
}

function saveServicePlan(items: ServiceItem[]): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(SERVICE_PLAN_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Quota exceeded — swallow so the app keeps working.
  }
}

function isStoredServiceItem(value: unknown): value is ServiceItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item["id"] === "string" &&
    typeof item["title"] === "string" &&
    typeof item["subtitle"] === "string" &&
    typeof item["kind"] === "string" &&
    Array.isArray(item["slides"])
  );
}

/** Coerce a parsed service item back into a clean shape (defensive against bad JSON). */
function normalizeStoredItem(item: ServiceItem): ServiceItem {
  const normalized: ServiceItem = {
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    kind: item.kind,
    slides: Array.isArray(item.slides)
      ? item.slides
          .filter((slide) => slide && typeof slide.id === "string")
          .map((slide) => ({
            id: String(slide.id),
            kind: slide.kind,
            label: slide.label,
            lines: Array.isArray(slide.lines) ? slide.lines.map(String) : [],
            ...(typeof slide.attribution === "string" ? { attribution: slide.attribution } : {}),
          }))
      : [],
  };
  return normalized;
}
