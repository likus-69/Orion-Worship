import * as React from "react";

import {
  buildSongFromInput,
  isUserSong,
  songLibrary,
  type Song,
  type SongEditorInput,
} from "@/lib/song-library";
import { loadJSON, saveJSON } from "@/lib/opfs-storage";

// ---------------------------------------------------------------------------
// Shared external store backed by OPFS
// ---------------------------------------------------------------------------
//
// useSongLibrary() is called from multiple components (LeftPanel and
// SongLibraryDialog). They all share a single module-level store so
// mutations are visible instantly across every hook instance.
//
// Persistence uses the Origin Private File System (OPFS) — see
// src/lib/opfs-storage.ts — so user songs survive as real files with a
// large quota, not just localStorage. The store loads asynchronously on
// first access and writes on every mutation.

type Listener = () => void;

const STORAGE_NAME = "user-songs";

let userSongsCache: Song[] | undefined;
let loadPromise: Promise<Song[]> | undefined;
const listeners = new Set<Listener>();

/** Synchronous snapshot for useSyncExternalStore. Returns [] until loaded. */
function getSnapshot(): Song[] {
  return userSongsCache ?? [];
}

/** Async load from OPFS — called once on first subscription. */
function ensureLoaded(): Promise<Song[]> {
  if (loadPromise) return loadPromise;
  loadPromise = loadJSON<Song[]>(STORAGE_NAME, []).then((songs) => {
    userSongsCache = songs;
    for (const listener of listeners) listener();
    return songs;
  });
  return loadPromise;
}

function setUserSongsCache(next: Song[]): void {
  userSongsCache = next;
  void saveJSON(STORAGE_NAME, next);
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  // Trigger async load on first subscription.
  void ensureLoaded();
  return () => listeners.delete(listener);
}

// Hook into cross-tab storage events so other windows stay in sync.
if (typeof window !== "undefined" && window.addEventListener) {
  window.addEventListener("storage", (event) => {
    if (event.key === "orion-worship:user-songs:v1") {
      void loadJSON<Song[]>(STORAGE_NAME, []).then((songs) => {
        userSongsCache = songs;
        for (const listener of listeners) listener();
      });
    }
  });
}

const SERVER_SNAPSHOT: Song[] = [];

/**
 * React binding over the Song Library. Merges the read-only seed catalogue
 * with user-created songs from a shared OPFS-backed store.
 *
 * SSR-safe: returns the seed catalogue on the server, hydrates from OPFS
 * on the client.
 */
export function useSongLibrary() {
  const userSongs = React.useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);
  const [loaded, setLoaded] = React.useState(userSongsCache !== undefined);

  React.useEffect(() => {
    if (loaded) return;
    let active = true;
    ensureLoaded().then(() => {
      if (active) setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, [loaded]);

  const songs = React.useMemo<Song[]>(() => {
    if (userSongs.length === 0) return songLibrary;
    return [...songLibrary, ...userSongs];
  }, [userSongs]);

  const addUserSong = React.useCallback((input: SongEditorInput): Song => {
    const song = buildSongFromInput(input);
    const prev = userSongsCache ?? [];
    setUserSongsCache(prev.some((s) => s.id === song.id) ? prev : [...prev, song]);
    return song;
  }, []);

  const updateUserSong = React.useCallback((id: string, input: SongEditorInput) => {
    const prev = userSongsCache ?? [];
    setUserSongsCache(prev.map((s) => (s.id === id ? buildSongFromInput(input, id) : s)));
  }, []);

  const deleteUserSong = React.useCallback((id: string) => {
    const prev = userSongsCache ?? [];
    setUserSongsCache(prev.filter((s) => s.id !== id));
  }, []);

  /** Replace the entire user-song list (used by import). */
  const replaceUserSongs = React.useCallback((next: Song[]) => {
    setUserSongsCache(next);
  }, []);

  return {
    songs,
    userSongs,
    isUserSong,
    addUserSong,
    updateUserSong,
    deleteUserSong,
    replaceUserSongs,
  };
}
