import * as React from "react";

import {
  buildSongFromInput,
  isUserSong,
  loadUserSongs,
  saveUserSongs,
  songLibrary,
  type Song,
  type SongEditorInput,
} from "@/lib/song-library";

// ---------------------------------------------------------------------------
// Shared external store
// ---------------------------------------------------------------------------
//
// useSongLibrary() is called from multiple components (LeftPanel and
// SongLibraryDialog). If each hook instance kept its own React state, adding
// a song in the dialog wouldn't update the LeftPanel's Song Bank list until a
// page refresh — the `storage` event only fires in *other* windows, not the
// one that made the change.
//
// To fix this, the user-song list lives in a module-level store that all hook
// instances share. Mutations update the store + localStorage + notify every
// subscriber in the same window, and the `storage` event keeps other tabs in
// sync too.

type Listener = () => void;

let userSongsCache: Song[] | undefined;
const listeners = new Set<Listener>();

function getUserSongs(): Song[] {
  if (userSongsCache === undefined) {
    userSongsCache = loadUserSongs();
  }
  return userSongsCache;
}

function setUserSongsCache(next: Song[]): void {
  userSongsCache = next;
  saveUserSongs(next);
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Hook into cross-tab storage events so other windows stay in sync.
if (typeof window !== "undefined" && window.addEventListener) {
  window.addEventListener("storage", (event) => {
    if (event.key === "orion-worship:user-songs:v1") {
      userSongsCache = loadUserSongs();
      for (const listener of listeners) listener();
    }
  });
}

// useSyncExternalStore requires a stable server snapshot. On the server we
// return the seed catalogue's empty user-song list (no localStorage).
const SERVER_SNAPSHOT: Song[] = [];

/**
 * React binding over the Song Library. Merges the read-only seed catalogue
 * with user-created songs from a shared external store, so every hook
 * instance stays in sync.
 *
 * SSR-safe: returns the seed catalogue on the server, hydrates user songs
 * from localStorage on the client.
 */
export function useSongLibrary() {
  const userSongs = React.useSyncExternalStore(subscribe, getUserSongs, () => SERVER_SNAPSHOT);

  const songs = React.useMemo<Song[]>(() => {
    if (userSongs.length === 0) return songLibrary;
    return [...songLibrary, ...userSongs];
  }, [userSongs]);

  const addUserSong = React.useCallback((input: SongEditorInput): Song => {
    const song = buildSongFromInput(input);
    const prev = getUserSongs();
    setUserSongsCache(prev.some((s) => s.id === song.id) ? prev : [...prev, song]);
    return song;
  }, []);

  const updateUserSong = React.useCallback((id: string, input: SongEditorInput) => {
    const prev = getUserSongs();
    setUserSongsCache(prev.map((s) => (s.id === id ? buildSongFromInput(input, id) : s)));
  }, []);

  const deleteUserSong = React.useCallback((id: string) => {
    const prev = getUserSongs();
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
