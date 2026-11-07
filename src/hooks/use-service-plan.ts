import * as React from "react";

import { serviceItems, type ServiceItem } from "@/lib/service-data";
import { loadJSON, saveJSON } from "@/lib/opfs-storage";

// Persist the service plan to OPFS so songs added during a service survive a
// page refresh. The hook mirrors `useSongLibrary`'s shape: it starts from
// the seed plan so SSR and first-paint render match, then hydrates from
// OPFS after mount.
//
// Cross-tab sync is handled via the `storage` event (localStorage fallback)
// — two operator windows open on the same origin will see the same plan.

const STORAGE_NAME = "service-plan";

type Listener = () => void;

let planCache: ServiceItem[] | undefined;
let loadPromise: Promise<ServiceItem[]> | undefined;
const listeners = new Set<Listener>();

function getSnapshot(): ServiceItem[] {
  return planCache ?? serviceItems;
}

function ensureLoaded(): Promise<ServiceItem[]> {
  if (loadPromise) return loadPromise;
  loadPromise = loadJSON<ServiceItem[]>(STORAGE_NAME, serviceItems).then((plan) => {
    planCache = plan;
    for (const listener of listeners) listener();
    return plan;
  });
  return loadPromise;
}

function setPlanCache(next: ServiceItem[]): void {
  planCache = next;
  void saveJSON(STORAGE_NAME, next);
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  void ensureLoaded();
  return () => listeners.delete(listener);
}

if (typeof window !== "undefined" && window.addEventListener) {
  window.addEventListener("storage", (event) => {
    if (event.key === "orion-worship:service-plan:v1") {
      void loadJSON<ServiceItem[]>(STORAGE_NAME, serviceItems).then((plan) => {
        planCache = plan;
        for (const listener of listeners) listener();
      });
    }
  });
}

/**
 * Persist the service plan to OPFS so songs added during a service survive a
 * page refresh. The hook starts from the seed plan so SSR and first-paint
 * render match, then hydrates from OPFS after mount.
 */
export function useServicePlan() {
  const items = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => serviceItems, // SSR snapshot
  );
  const [hydrated, setHydrated] = React.useState(planCache !== undefined);

  React.useEffect(() => {
    if (hydrated) return;
    let active = true;
    ensureLoaded().then(() => {
      if (active) setHydrated(true);
    });
    return () => {
      active = false;
    };
  }, [hydrated]);

  const setItems = React.useCallback(
    (updater: ServiceItem[] | ((prev: ServiceItem[]) => ServiceItem[])) => {
      const prev = planCache ?? serviceItems;
      const next = typeof updater === "function" ? updater(prev) : updater;
      setPlanCache(next);
    },
    [],
  );

  const resetPlan = React.useCallback(() => {
    setPlanCache(serviceItems);
  }, []);

  return { items, setItems, resetPlan, hydrated };
}
