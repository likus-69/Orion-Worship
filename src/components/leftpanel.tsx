import { useState } from "react";
import { Search, ListMusic, Library, ChevronRight } from "lucide-react";
import { playlists, serviceItems, songBank } from "@/lib/service-data";

type Props = {
  activeItemId: string;
  onSelectItem: (id: string) => void;
};

export function LeftPanel({ activeItemId, onSelectItem }: Props) {
  const [query, setQuery] = useState("");
  const results = songBank.filter((s) =>
    (s.title + s.author).toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <aside className="flex w-72 shrink-0 flex-col gap-3 overflow-y-auto border-r border-hairline panel-surface p-3 scroll-slim">
      <section>
        <p className="eyebrow mb-2 px-1">Song list · this service</p>
        <ul className="space-y-1">
          {serviceItems.map((item, i) => {
            const isActive = item.id === activeItemId;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSelectItem(item.id)}
                  className={`flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left transition-colors ${
                    isActive
                      ? "bg-beam/12 ring-1 ring-beam/40"
                      : "hover:bg-panel-raised/70"
                  }`}
                >
                  <span
                    className={`w-4 shrink-0 text-[11px] tabular-nums ${isActive ? "text-beam" : "text-muted-foreground"}`}
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block truncate text-[13px] ${isActive ? "font-medium text-foreground" : "text-foreground/85"}`}
                    >
                      {item.title}
                    </span>
                    <span className="block truncate text-[11px] text-muted-foreground">
                      {item.subtitle}
                    </span>
                  </span>
                  <span className="shrink-0 text-[10px] text-muted-foreground">
                    {item.slides.length}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-lg bg-panel-raised/50 p-2.5 ring-1 ring-hairline">
        <p className="eyebrow mb-2 flex items-center gap-1.5">
          <Library className="size-3" /> Song bank
        </p>
        <div className="relative mb-2">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs & hymns"
            className="w-full rounded-md bg-background/60 py-1.5 pl-8 pr-2 text-[12px] text-foreground outline-none ring-1 ring-hairline placeholder:text-muted-foreground focus:ring-beam/50"
          />
        </div>
        <ul className="max-h-56 space-y-0.5 overflow-y-auto scroll-slim">
          {results.map((song) => (
            <li key={song.id}>
              <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-panel-raised">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px]">{song.title}</span>
                  <span className="block truncate text-[10.5px] text-muted-foreground">
                    {song.author}
                  </span>
                </span>
                <span className="shrink-0 rounded bg-background/60 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                  {song.key}
                </span>
              </button>
            </li>
          ))}
          {results.length === 0 && (
            <li className="px-2 py-3 text-[12px] text-muted-foreground">No matches.</li>
          )}
        </ul>
      </section>

      <section>
        <p className="eyebrow mb-2 flex items-center gap-1.5 px-1">
          <ListMusic className="size-3" /> Playlists
        </p>
        <ul className="space-y-0.5">
          {playlists.map((pl) => (
            <li key={pl.id}>
              <button className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left hover:bg-panel-raised/70">
                <ChevronRight className="size-3 shrink-0 text-muted-foreground" />
                <span className="flex-1 truncate text-[12.5px]">{pl.name}</span>
                <span className="text-[10.5px] text-muted-foreground">{pl.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
