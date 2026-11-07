import * as React from "react";

import { mediaItems, type MediaItem } from "@/lib/service-data";

// Shared external store for user-added media items, mirroring the pattern
// used by useSongLibrary. The seed `mediaItems` are always present; user-added
// items are appended and persisted to localStorage.

const STORAGE_KEY = "orion-worship:media-items:v1";
const USER_ID_PREFIX = "umd-";

type Listener = () => void;

let userMediaCache: MediaItem[] | undefined;
const listeners = new Set<Listener>();

function loadUserMedia(): MediaItem[] {
  if (typeof window === "undefined" || !window.localStorage) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isStoredMedia).map(normalizeStoredMedia);
  } catch {
    return [];
  }
}

function saveUserMedia(items: MediaItem[]): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Quota exceeded — swallow.
  }
}

function isStoredMedia(value: unknown): value is MediaItem {
  if (!value || typeof value !== "object") return false;
  const m = value as Record<string, unknown>;
  return (
    typeof m["id"] === "string" &&
    typeof m["name"] === "string" &&
    typeof m["type"] === "string" &&
    typeof m["tone"] === "string"
  );
}

function normalizeStoredMedia(m: MediaItem): MediaItem {
  return { id: m.id, name: m.name, type: m.type, tone: m.tone };
}

function getUserMedia(): MediaItem[] {
  if (userMediaCache === undefined) {
    userMediaCache = loadUserMedia();
  }
  return userMediaCache;
}

function setUserMediaCache(next: MediaItem[]): void {
  userMediaCache = next;
  saveUserMedia(next);
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

if (typeof window !== "undefined" && window.addEventListener) {
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) {
      userMediaCache = loadUserMedia();
      for (const listener of listeners) listener();
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
  const userMedia = React.useSyncExternalStore(subscribe, getUserMedia, () => SERVER_SNAPSHOT);

  const media = React.useMemo<MediaItem[]>(() => [...mediaItems, ...userMedia], [userMedia]);

  const addMedia = React.useCallback((input: NewMediaInput): MediaItem => {
    const item: MediaItem = {
      id: `${USER_ID_PREFIX}${Date.now().toString(36)}`,
      name: input.name,
      type: input.type,
      tone: input.tone,
    };
    setUserMediaCache([...getUserMedia(), item]);
    return item;
  }, []);

  const deleteMedia = React.useCallback((id: string) => {
    if (!id.startsWith(USER_ID_PREFIX)) return; // can't delete seed items
    setUserMediaCache(getUserMedia().filter((m) => m.id !== id));
  }, []);

  return { media, userMedia, addMedia, deleteMedia };
}
