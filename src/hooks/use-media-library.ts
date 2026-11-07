import * as React from "react";

import { mediaItems, type MediaItem } from "@/lib/service-data";
import { loadJSON, saveJSON } from "@/lib/opfs-storage";

// Shared external store for user-added media items, backed by OPFS.
// Mirrors the pattern used by useSongLibrary. The seed `mediaItems` are
// always present; user-added items are appended and persisted to OPFS.

const STORAGE_NAME = "user-media";
const USER_ID_PREFIX = "umd-";

type Listener = () => void;

let userMediaCache: MediaItem[] | undefined;
let loadPromise: Promise<MediaItem[]> | undefined;
const listeners = new Set<Listener>();

function getSnapshot(): MediaItem[] {
  return userMediaCache ?? [];
}

function ensureLoaded(): Promise<MediaItem[]> {
  if (loadPromise) return loadPromise;
  loadPromise = loadJSON<MediaItem[]>(STORAGE_NAME, []).then((items) => {
    userMediaCache = items;
    for (const listener of listeners) listener();
    return items;
  });
  return loadPromise;
}

function setUserMediaCache(next: MediaItem[]): void {
  userMediaCache = next;
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
    if (event.key === "orion-worship:user-media:v1") {
      void loadJSON<MediaItem[]>(STORAGE_NAME, []).then((items) => {
        userMediaCache = items;
        for (const listener of listeners) listener();
      });
    }
  });
}

const SERVER_SNAPSHOT: MediaItem[] = [];

export type NewMediaInput = {
  name: string;
  type: string;
  tone: string;
};

export function useMediaLibrary() {
  const userMedia = React.useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);

  const media = React.useMemo<MediaItem[]>(() => [...mediaItems, ...userMedia], [userMedia]);

  const addMedia = React.useCallback((input: NewMediaInput): MediaItem => {
    const item: MediaItem = {
      id: `${USER_ID_PREFIX}${Date.now().toString(36)}`,
      name: input.name,
      type: input.type,
      tone: input.tone,
    };
    const prev = userMediaCache ?? [];
    setUserMediaCache([...prev, item]);
    return item;
  }, []);

  const deleteMedia = React.useCallback((id: string) => {
    if (!id.startsWith(USER_ID_PREFIX)) return; // can't delete seed items
    const prev = userMediaCache ?? [];
    setUserMediaCache(prev.filter((m) => m.id !== id));
  }, []);

  return { media, userMedia, addMedia, deleteMedia };
}
