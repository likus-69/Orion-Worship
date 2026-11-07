// Origin Private File System (OPFS) storage module.
//
// OPFS provides a persistent, private file system in the browser with a much
// larger quota than localStorage (~1GB vs ~5MB) and survives cache clears.
// Data is stored as real JSON files that can be backed up or moved between
// PCs by copying the browser profile.
//
// The module falls back to localStorage when OPFS is unavailable (older
// browsers, private browsing mode), so the app always works.
//
// All operations are async. Callers should use the `load`/`save` helpers and
// handle the Promise.

const OPFS_DIR = "orion-worship";

/** Check whether OPFS is available in the current environment. */
function hasOPFS(): boolean {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.storage !== "undefined" &&
    typeof navigator.storage.getDirectory === "function"
  );
}

/** Check whether localStorage is available (fallback path). */
function hasLocalStorage(): boolean {
  try {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  } catch {
    return false;
  }
}

/**
 * Load a JSON value from storage. Returns `fallback` if the file doesn't
 * exist or can't be parsed.
 */
export async function loadJSON<T>(name: string, fallback: T): Promise<T> {
  if (hasOPFS()) {
    try {
      return await loadFromOPFS(name, fallback);
    } catch {
      // OPFS error — fall through to localStorage.
    }
  }
  if (hasLocalStorage()) {
    return loadFromLocalStorage(name, fallback);
  }
  return fallback;
}

/**
 * Save a JSON value to storage. Writes to OPFS when available, falling back
 * to localStorage. Silently no-ops if neither is available (SSR).
 */
export async function saveJSON<T>(name: string, value: T): Promise<void> {
  if (hasOPFS()) {
    try {
      await saveToOPFS(name, value);
      return;
    } catch {
      // OPFS error — fall through to localStorage.
    }
  }
  if (hasLocalStorage()) {
    saveToLocalStorage(name, value);
  }
}

/** Delete a stored value from both OPFS and localStorage. */
export async function deleteJSON(name: string): Promise<void> {
  if (hasOPFS()) {
    try {
      await deleteFromOPFS(name);
    } catch {
      // ignore
    }
  }
  if (hasLocalStorage()) {
    try {
      window.localStorage.removeItem(storageKey(name));
    } catch {
      // ignore
    }
  }
}

// ---------------------------------------------------------------------------
// OPFS implementation
// ---------------------------------------------------------------------------

async function loadFromOPFS<T>(name: string, fallback: T): Promise<T> {
  const root = await navigator.storage.getDirectory();
  const dir = await root.getDirectoryHandle(OPFS_DIR, { create: true });
  try {
    const fileHandle = await dir.getFileHandle(fileName(name));
    const file = await fileHandle.getFile();
    const text = await file.text();
    return JSON.parse(text) as T;
  } catch {
    // File doesn't exist yet — return fallback.
    return fallback;
  }
}

async function saveToOPFS<T>(name: string, value: T): Promise<void> {
  const root = await navigator.storage.getDirectory();
  const dir = await root.getDirectoryHandle(OPFS_DIR, { create: true });
  const fileHandle = await dir.getFileHandle(fileName(name), { create: true });
  const writable = await (
    fileHandle as FileSystemFileHandle & {
      createWritable: () => Promise<FileSystemWritableFileStream>;
    }
  ).createWritable();
  await writable.write(JSON.stringify(value));
  await writable.close();
}

async function deleteFromOPFS(name: string): Promise<void> {
  const root = await navigator.storage.getDirectory();
  const dir = await root.getDirectoryHandle(OPFS_DIR, { create: true });
  await dir.removeEntry(fileName(name));
}

// ---------------------------------------------------------------------------
// localStorage fallback implementation
// ---------------------------------------------------------------------------

function loadFromLocalStorage<T>(name: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(storageKey(name));
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveToLocalStorage<T>(name: string, value: T): void {
  try {
    window.localStorage.setItem(storageKey(name), JSON.stringify(value));
  } catch {
    // Quota exceeded — swallow.
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fileName(name: string): string {
  return `${name}.json`;
}

function storageKey(name: string): string {
  return `orion-worship:${name}:v1`;
}
