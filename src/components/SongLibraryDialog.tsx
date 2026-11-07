import * as React from "react";
import { useDeferredValue, useMemo, useRef, useState } from "react";
import { Download, Music2, Pencil, Plus, Search, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Button } from "@/ui/button";
import { cn } from "@/lib/utils";
import {
  buildSongExport,
  collectSongKeys,
  isUserSong,
  mergeImportedSongs,
  parseSongExport,
  searchSongs,
  songCategories,
  songSlideCount,
  type Song,
  type SongCategory,
  type SongEditorInput,
} from "@/lib/song-library";
import { useSongLibrary } from "@/hooks/use-song-library";
import { SongEditorDialog } from "./SongEditorDialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSong: (song: Song) => void;
};

export function SongLibraryDialog({ open, onOpenChange, onAddSong }: Props) {
  const { songs, userSongs, addUserSong, updateUserSong, deleteUserSong, replaceUserSongs } =
    useSongLibrary();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SongCategory | null>(null);
  const [songKey, setSongKey] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Editor dialog state: null = closed, { mode: "create" } or { mode: "edit", song }.
  const [editor, setEditor] = useState<{ mode: "create" } | { mode: "edit"; song: Song } | null>(
    null,
  );

  // Hidden file input used to trigger the import dialog.
  const fileInputRef = useRef<HTMLInputElement>(null);

  const deferredQuery = useDeferredValue(query);

  // Compute the dynamic key list so user songs with new keys show up as filters.
  const allKeys = useMemo(() => collectSongKeys(songs), [songs]);

  const results = useMemo(
    () => searchSongs({ query: deferredQuery, category, songKey }, songs),
    [deferredQuery, category, songKey, songs],
  );

  const selected = useMemo<Song | undefined>(() => {
    if (!selectedId) return results[0];
    return results.find((song) => song.id === selectedId) ?? results[0];
  }, [results, selectedId]);

  const hasActiveFilters = Boolean(category || songKey || deferredQuery.trim());

  const clearFilters = () => {
    setCategory(null);
    setSongKey(null);
    setQuery("");
  };

  const handleAdd = (song: Song) => {
    onAddSong(song);
    onOpenChange(false);
  };

  const handleEditorSave = (input: SongEditorInput, id?: string) => {
    if (id) {
      updateUserSong(id, input);
      toast.success(`Updated "${input.title}"`);
    } else {
      const song = addUserSong(input);
      toast.success(`Created "${input.title}"`);
      // Select the newly created song so the operator sees it land.
      setSelectedId(song.id);
    }
    setEditor(null);
  };

  const handleDelete = (song: Song) => {
    if (!isUserSong(song)) return;
    const ok = window.confirm(
      `Delete "${song.title}"? This cannot be undone, and any service items already added from this song will remain but become detached from the library.`,
    );
    if (!ok) return;
    deleteUserSong(song.id);
    if (selectedId === song.id) setSelectedId(null);
    toast.success(`Deleted "${song.title}"`);
  };

  const handleExport = () => {
    if (userSongs.length === 0) {
      toast.error("No user songs to export. Create a song first.");
      return;
    }
    const bundle = buildSongExport(userSongs);
    const json = JSON.stringify(bundle, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const date = new Date().toISOString().slice(0, 10);
    a.download = `orion-worship-songs-${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Exported ${userSongs.length} song${userSongs.length === 1 ? "" : "s"}`, {
      description: "Saved to your downloads folder.",
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Reset the input so the same file can be re-imported.
    event.target.value = "";
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const { songs: imported, error } = parseSongExport(text);
      if (imported.length === 0) {
        toast.error("Import failed", { description: error ?? "No valid songs found." });
        return;
      }
      const { merged, added, overwritten } = mergeImportedSongs(userSongs, imported);
      replaceUserSongs(merged);
      toast.success(`Imported ${imported.length} song${imported.length === 1 ? "" : "s"}`, {
        description: [
          `${added} new`,
          overwritten > 0 ? ` · ${overwritten} overwritten` : "",
          error ? ` · ${error}` : "",
        ].join(""),
      });
    };
    reader.onerror = () => toast.error("Could not read the file.");
    reader.readAsText(file);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl gap-0 p-0">
          <DialogHeader className="border-b border-hairline px-5 py-4 text-left">
            <div className="flex items-center gap-2">
              <Music2 className="size-4 text-beam" />
              <DialogTitle className="text-base font-medium">Song Library</DialogTitle>
              <div className="ml-auto flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 gap-1.5 px-2.5 text-[12px] text-muted-foreground"
                  onClick={handleImportClick}
                  title="Import songs from a JSON file"
                >
                  <Upload className="size-3.5" />
                  <span className="hidden lg:inline">Import</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 gap-1.5 px-2.5 text-[12px] text-muted-foreground"
                  onClick={handleExport}
                  title="Export your songs to a JSON file"
                >
                  <Download className="size-3.5" />
                  <span className="hidden lg:inline">Export</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1.5 px-2.5 text-[12px]"
                  onClick={() => setEditor({ mode: "create" })}
                >
                  <Plus className="size-3.5" />
                  New song
                </Button>
              </div>
            </div>
            <DialogDescription className="text-[12px]">
              Search the catalogue, preview the lyrics, and add a song to the service plan. Songs
              you create are saved to your browser and persist across sessions.
            </DialogDescription>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleImportFile}
            />
          </DialogHeader>

          <div className="flex min-h-0 h-[60vh]">
            {/* Left column: search + results */}
            <div className="flex w-1/2 min-w-0 flex-col border-r border-hairline">
              <div className="space-y-2 border-b border-hairline p-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by title, author, or lyrics…"
                    className="w-full rounded-md bg-background/60 py-2 pl-8 pr-3 text-[13px] outline-none ring-1 ring-hairline placeholder:text-muted-foreground focus:ring-beam/50"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <FilterChip active={!category} onClick={() => setCategory(null)} label="All" />
                  {songCategories.map((cat) => (
                    <FilterChip
                      key={cat.value}
                      active={category === cat.value}
                      onClick={() => setCategory((prev) => (prev === cat.value ? null : cat.value))}
                      label={cat.label}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="eyebrow shrink-0 pr-1">Key</span>
                  <FilterChip active={!songKey} onClick={() => setSongKey(null)} label="Any" />
                  {allKeys.map((key) => (
                    <FilterChip
                      key={key}
                      active={songKey === key}
                      onClick={() => setSongKey((prev) => (prev === key ? null : key))}
                      label={key}
                    />
                  ))}
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3" /> Clear filters
                  </button>
                )}
              </div>

              <ul className="min-h-0 flex-1 overflow-y-auto scroll-slim">
                {results.map((song) => {
                  const isActive = selected?.id === song.id;
                  const editable = isUserSong(song);
                  return (
                    <li key={song.id}>
                      <button
                        onClick={() => setSelectedId(song.id)}
                        className={cn(
                          "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                          isActive
                            ? "bg-beam/12 ring-1 ring-inset ring-beam/40"
                            : "hover:bg-panel-raised/60",
                        )}
                      >
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-1.5">
                            <span className="block truncate text-[13px] font-medium">
                              {song.title}
                            </span>
                            {editable && (
                              <span className="shrink-0 rounded bg-beam/12 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-beam/90 ring-1 ring-beam/30">
                                Yours
                              </span>
                            )}
                          </span>
                          <span className="block truncate text-[11px] text-muted-foreground">
                            {song.author}
                          </span>
                        </span>
                        <span className="shrink-0 rounded bg-background/60 px-1.5 py-0.5 text-[10px] text-muted-foreground ring-1 ring-hairline">
                          {song.key}
                        </span>
                        <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
                          {songSlideCount(song)} slides
                        </span>
                      </button>
                    </li>
                  );
                })}
                {results.length === 0 && (
                  <li className="px-3 py-6 text-center text-[12px] text-muted-foreground">
                    No songs match your search.
                    <div className="mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditor({ mode: "create" })}
                      >
                        <Plus className="size-3.5" />
                        Create a new song
                      </Button>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            {/* Right column: song detail / slide preview */}
            <div className="flex w-1/2 min-w-0 flex-col bg-panel/40">
              {selected ? (
                <SongDetail
                  song={selected}
                  editable={isUserSong(selected)}
                  onAdd={() => handleAdd(selected)}
                  onEdit={() => setEditor({ mode: "edit", song: selected })}
                  onDelete={() => handleDelete(selected)}
                />
              ) : (
                <div className="grid flex-1 place-items-center text-[12px] text-muted-foreground">
                  Select a song to preview its lyrics.
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SongEditorDialog
        open={editor !== null}
        onOpenChange={(next) => !next && setEditor(null)}
        song={editor?.mode === "edit" ? editor.song : null}
        onSave={handleEditorSave}
      />
    </>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-2.5 py-0.5 text-[11px] transition-colors ring-1",
        active
          ? "bg-beam/15 text-beam ring-beam/40"
          : "bg-background/40 text-muted-foreground ring-hairline hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

function SongDetail({
  song,
  editable,
  onAdd,
  onEdit,
  onDelete,
}: {
  song: Song;
  editable: boolean;
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <>
      <div className="flex items-start gap-3 border-b border-hairline p-4">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold text-foreground">{song.title}</h3>
          <p className="truncate text-[12px] text-muted-foreground">{song.author}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className="rounded bg-background/60 px-1.5 py-0.5 text-[10px] text-muted-foreground ring-1 ring-hairline">
              Key {song.key}
            </span>
            <span className="rounded bg-background/60 px-1.5 py-0.5 text-[10px] text-muted-foreground ring-1 ring-hairline">
              {song.bpm ? `${song.bpm} BPM` : "BPM —"}
            </span>
            <span className="rounded bg-background/60 px-1.5 py-0.5 text-[10px] text-muted-foreground ring-1 ring-hairline">
              {song.category}
            </span>
            {song.ccli && (
              <span className="rounded bg-background/60 px-1.5 py-0.5 text-[10px] text-muted-foreground ring-1 ring-hairline">
                CCLI {song.ccli}
              </span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-1.5">
          <Button onClick={onAdd} size="sm">
            <Plus className="size-3.5" />
            Add to service
          </Button>
          {editable && (
            <>
              <Button onClick={onEdit} size="sm" variant="outline" className="h-7 text-[12px]">
                <Pencil className="size-3" />
                Edit
              </Button>
              <Button
                onClick={onDelete}
                size="sm"
                variant="ghost"
                className="h-7 text-[12px] text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-3" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4 scroll-slim">
        <p className="eyebrow mb-3">Slide preview · {song.sections.length} slides</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {song.sections.map((section, index) => (
            <div key={section.id} className="overflow-hidden rounded-lg ring-1 ring-hairline">
              <div className="aspect-video w-full bg-paper px-4 py-3 text-paper-ink">
                <p className="text-[9px] font-medium tracking-[0.2em] uppercase text-paper-ink/45">
                  {song.title} · {section.label}
                </p>
                <div className="mt-2 space-y-0.5">
                  {section.lines.map((line, i) => (
                    <p key={i} className="font-serif text-[12px] leading-tight text-balance">
                      {line}
                    </p>
                  ))}
                </div>
                {song.copyright && (
                  <p className="mt-2 text-[8px] text-paper-ink/45">{song.copyright}</p>
                )}
              </div>
              <div className="flex items-center justify-between bg-panel-raised/70 px-2 py-1">
                <span className="truncate text-[11px]">{section.label}</span>
                <span className="text-[10px] text-muted-foreground">{index + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
