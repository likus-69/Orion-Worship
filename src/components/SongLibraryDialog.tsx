import { useDeferredValue, useMemo, useState } from "react";
import { Music2, Plus, Search, X } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Button } from "@/ui/button";
import { cn } from "@/lib/utils";
import {
  searchSongs,
  songCategories,
  songKeys,
  songSlideCount,
  type Song,
  type SongCategory,
} from "@/lib/song-library";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSong: (song: Song) => void;
};

export function SongLibraryDialog({ open, onOpenChange, onAddSong }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SongCategory | null>(null);
  const [songKey, setSongKey] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const deferredQuery = useDeferredValue(query);

  const results = useMemo(
    () => searchSongs({ query: deferredQuery, category, songKey }),
    [deferredQuery, category, songKey],
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl gap-0 p-0">
        <DialogHeader className="border-b border-hairline px-5 py-4 text-left">
          <DialogTitle className="flex items-center gap-2 text-base font-medium">
            <Music2 className="size-4 text-beam" />
            Song Library
          </DialogTitle>
          <DialogDescription className="text-[12px]">
            Search the catalogue, preview the lyrics, and add a song to the service plan.
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 h-[60vh]">
          {/* Left column: search + results */}
          <div className="flex w-1/2 min-w-0 flex-col border-r border-hairline">
            <div className="space-y-2 border-b border-hairline p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  autoFocus
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
                {songKeys.map((key) => (
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
                        <span className="block truncate text-[13px] font-medium">{song.title}</span>
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
                </li>
              )}
            </ul>
          </div>

          {/* Right column: song detail / slide preview */}
          <div className="flex w-1/2 min-w-0 flex-col bg-panel/40">
            {selected ? (
              <SongDetail song={selected} onAdd={() => handleAdd(selected)} />
            ) : (
              <div className="grid flex-1 place-items-center text-[12px] text-muted-foreground">
                Select a song to preview its lyrics.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
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

function SongDetail({ song, onAdd }: { song: Song; onAdd: () => void }) {
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
        <Button onClick={onAdd} size="sm" className="shrink-0">
          <Plus className="size-3.5" />
          Add to service
        </Button>
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
