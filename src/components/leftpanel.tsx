import { useDeferredValue, useMemo, useState } from "react";
import {
  ListMusic,
  Library,
  ChevronRight,
  BookOpen,
  Hash,
  Music2,
  Clock,
  Search,
} from "lucide-react";
import {
  playlists,
  serviceItems as defaultServiceItems,
  type ServiceItem,
} from "@/lib/service-data";
import { useSongLibrary } from "@/hooks/use-song-library";
import { SongLibraryDialog } from "./SongLibraryDialog";
import type { Song } from "@/lib/song-library";

type Props = {
  activeItemId: string;
  onSelectItem: (id: string) => void;
  /** Overrides the static service plan when the operator adds songs at runtime. */
  serviceItems?: ServiceItem[];
  onAddSong?: (song: Song) => void;
  /** Controlled open state for the Song Library dialog (lifted to the route). */
  libraryOpen?: boolean;
  onLibraryOpenChange?: (open: boolean) => void;
};

export function LeftPanel({
  activeItemId,
  onSelectItem,
  serviceItems,
  onAddSong,
  libraryOpen = false,
  onLibraryOpenChange,
}: Props) {
  const [query, setQuery] = useState("");
  const [internalLibraryOpen, setInternalLibraryOpen] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();

  // Use controlled open state when provided, otherwise fall back to internal.
  const isLibraryOpen = onLibraryOpenChange ? libraryOpen : internalLibraryOpen;
  const setLibraryOpen = onLibraryOpenChange ?? setInternalLibraryOpen;

  const visibleItems = serviceItems ?? defaultServiceItems;
  const { songs } = useSongLibrary();

  const results = useMemo(() => {
    if (!normalizedQuery) return songs;
    return songs.filter((song) =>
      `${song.title} ${song.author}`.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery, songs]);

  return (
    <aside className="flex w-60 shrink-0 flex-col overflow-hidden border-r border-hairline bg-panel">
      {/* Service Plan section */}
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-center justify-between px-3 py-2">
          <p className="eyebrow flex items-center gap-1.5">
            <ListMusic className="size-3" /> Service Plan
          </p>
          <span className="rounded bg-panel-raised px-1.5 py-0.5 text-[10px] tabular-nums text-muted-foreground">
            {visibleItems.length}
          </span>
        </div>
        <ul className="min-h-0 flex-1 overflow-y-auto px-1.5 pb-2 scroll-slim">
          {visibleItems.map((item, i) => {
            const isActive = item.id === activeItemId;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSelectItem(item.id)}
                  className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[12px] transition-colors ${
                    isActive
                      ? "bg-beam/15 text-foreground ring-1 ring-inset ring-beam/40"
                      : "text-foreground/80 hover:bg-panel-raised/70"
                  }`}
                >
                  <span
                    className={`w-5 shrink-0 text-right text-[10px] tabular-nums ${
                      isActive ? "text-beam" : "text-muted-foreground"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{item.title}</span>
                    <span className="block truncate text-[10px] text-muted-foreground">
                      {item.subtitle}
                    </span>
                  </span>
                  <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
                    {item.slides.length}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Divider */}
      <div className="h-px bg-hairline" />

      {/* Song Bank section */}
      <div className="flex min-h-0 flex-[0_0_auto] max-h-[40%] flex-col">
        <div className="flex items-center justify-between px-3 py-2">
          <p className="eyebrow flex items-center gap-1.5">
            <Library className="size-3" /> Song Bank
          </p>
          {onAddSong && (
            <button
              onClick={() => setLibraryOpen(true)}
              title="Browse song library"
              className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-beam/90 ring-1 ring-beam/30 transition-colors hover:bg-beam/12 hover:text-beam"
            >
              <BookOpen className="size-3" />
              Browse
            </button>
          )}
        </div>

        <div className="px-2.5 pb-1.5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search songs…"
              className="w-full rounded bg-background/60 py-1 pl-7 pr-2 text-[11px] text-foreground outline-none ring-1 ring-hairline placeholder:text-muted-foreground focus:ring-beam/50"
            />
          </div>
        </div>

        <ul className="min-h-0 flex-1 overflow-y-auto px-1.5 pb-2 scroll-slim">
          {results.map((song) => (
            <li key={song.id}>
              <button className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-[11px] hover:bg-panel-raised/70">
                <Music2 className="size-3 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate">{song.title}</span>
                <span className="shrink-0 rounded bg-background/60 px-1 py-0.5 text-[9px] tabular-nums text-muted-foreground">
                  {song.key}
                </span>
              </button>
            </li>
          ))}
          {results.length === 0 && (
            <li className="px-2 py-2 text-[11px] text-muted-foreground">No matches.</li>
          )}
        </ul>
      </div>

      {/* Divider */}
      <div className="h-px bg-hairline" />

      {/* Playlists footer */}
      <div className="shrink-0 px-3 py-2">
        <p className="eyebrow mb-1.5 flex items-center gap-1.5">
          <Hash className="size-3" /> Playlists
        </p>
        <ul className="space-y-0.5">
          {playlists.map((pl) => (
            <li key={pl.id}>
              <button className="flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-[11px] text-muted-foreground hover:bg-panel-raised/60 hover:text-foreground">
                <ChevronRight className="size-2.5 shrink-0" />
                <span className="flex-1 truncate">{pl.name}</span>
                <span className="text-[10px] tabular-nums">{pl.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Status bar */}
      <div className="flex shrink-0 items-center gap-1.5 border-t border-hairline bg-background/40 px-3 py-1 text-[10px] text-muted-foreground">
        <Clock className="size-2.5" />
        <span>Sunday · 10:00 AM</span>
      </div>

      {onAddSong && (
        <SongLibraryDialog
          open={isLibraryOpen}
          onOpenChange={setLibraryOpen}
          onAddSong={onAddSong}
        />
      )}
    </aside>
  );
}
