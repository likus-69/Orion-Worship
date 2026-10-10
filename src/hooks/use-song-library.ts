import * as React from "react";

import {
  buildSongFromInput,
  isUserSong,
  loadUserSongs,
  saveUserSongs,
  songLibrary,
  subscribeToUserSongs,
  type Song,
  type SongEditorInput,
} from "@/lib/song-library";

/**
 * React binding over the Song Library. Merges the read-only seed catalogue
 * with user-created songs loaded from localStorage, and exposes CRUD
 * operations that persist changes back to localStorage and broadcast them
 * to any other tabs/windows open on the same origin.
 *
 * The hook is SSR-safe: on the server it returns the seed catalogue and the
 * mutators are no-ops, so it can be called from a TanStack Start component
 * that renders on both server and client.
 */
export function useSongLibrary() {
  // Start with the seed catalogue so the first client render matches the SSR
  // HTML (no user songs in either), then hydrate user songs from localStorage
  // in an effect to avoid hydration mismatches.
  const [userSongs, setUserSongs] = React.useState<Song[]>([]);

  React.useEffect(() => {
    setUserSongs(loadUserSongs());
    const unsubscribe = subscribeToUserSongs(() => {
      setUserSongs(loadUserSongs());
    });
    return unsubscribe;
  }, []);

  const songs = React.useMemo<Song[]>(() => {
    if (userSongs.length === 0) return songLibrary;
    return [...songLibrary, ...userSongs];
  }, [userSongs]);

  const persist = React.useCallback((next: Song[]) => {
    saveUserSongs(next);
    setUserSongs(next);
  }, []);

  const addUserSong = React.useCallback((input: SongEditorInput): Song => {
    const song = buildSongFromInput(input);
    setUserSongs((prev) => {
      const next = [...prev, song];
      saveUserSongs(next);
      return next;
    });
    return song;
  }, []);

  const updateUserSong = React.useCallback((id: string, input: SongEditorInput) => {
    setUserSongs((prev) => {
      const next = prev.map((song) => (song.id === id ? buildSongFromInput(input, id) : song));
      saveUserSongs(next);
      return next;
    });
  }, []);

  const deleteUserSong = React.useCallback((id: string) => {
    setUserSongs((prev) => {
      const next = prev.filter((song) => song.id !== id);
      saveUserSongs(next);
      return next;
    });
  }, []);

  return {
    songs,
    userSongs,
    isUserSong,
    addUserSong,
    updateUserSong,
    deleteUserSong,
  };
}
