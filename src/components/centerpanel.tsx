import { useMemo, useState } from "react";
import { Grid2x2, List, ZoomIn, ZoomOut } from "lucide-react";
import {
  serviceItems as defaultServiceItems,
  type ServiceItem,
  type SlideKind,
} from "@/lib/service-data";
import { cn } from "@/lib/utils";
import { useMediaLibrary } from "@/hooks/use-media-library";
import { SlideView } from "./slideview";

type Props = {
  activeItemId: string;
  currentSlideId: string;
  onSelectSlide: (id: string) => void;
  activeMediaId: string;
  onSelectMedia: (id: string) => void;
  /** Overrides the static service plan when the operator adds songs at runtime. */
  serviceItems?: ServiceItem[];
};

type ViewMode = "grid" | "list";
type ZoomLevel = 1 | 2 | 3;

// Zoom levels map to the minimum card width in the auto-fill grid.
const ZOOM_LEVELS: Record<ZoomLevel, { minWidth: number; label: string }> = {
  1: { minWidth: 120, label: "Small" },
  2: { minWidth: 165, label: "Medium" },
  3: { minWidth: 230, label: "Large" },
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

/**
 * Maps a slide's kind to a tailwind class for the colored section bar at the
 * bottom of each grid card. The colors come from CSS variables defined in
 * styles.css and match the vibrant palette seen in pro production software.
 */
function sectionBarClass(kind: SlideKind): string {
  switch (kind) {
    case "title":
      return "bg-section-title";
    case "lyrics":
      return "bg-section-lyrics";
    case "scripture":
      return "bg-section-scripture";
    case "sermon":
      return "bg-section-sermon";
    case "blank":
    default:
      return "bg-section-blank";
  }
}

function sectionLabel(kind: SlideKind): string {
  switch (kind) {
    case "title":
      return "Title";
    case "lyrics":
      return "Lyrics";
    case "scripture":
      return "Scripture";
    case "sermon":
      return "Sermon";
    case "blank":
      return "Blank";
    default:
      return "Slide";
  }
}

export function CenterPanel({
  activeItemId,
  currentSlideId,
  onSelectSlide,
  activeMediaId,
  onSelectMedia,
  serviceItems,
}: Props) {
  const items = serviceItems ?? defaultServiceItems;
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [zoom, setZoom] = useState<ZoomLevel>(2);
  const { media } = useMediaLibrary();

  const item = useMemo(
    () => items.find((s) => s.id === activeItemId) ?? items[0]!,
    [items, activeItemId],
  );

  const thumbnailSlides = useMemo(
    () => item.slides.map((slide) => ({ ...slide, itemId: item.id, itemTitle: item.title })),
    [item],
  );

  const zoomConfig = ZOOM_LEVELS[zoom];

  return (
    <main className="flex min-w-0 flex-1 flex-col bg-background">
      {/* Header strip */}
      <div className="flex shrink-0 items-center gap-2 border-b border-hairline bg-panel px-3 py-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-foreground">{item.title}</p>
          <p className="truncate text-[10.5px] text-muted-foreground">{item.subtitle}</p>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <span className="rounded bg-panel-raised px-1.5 py-0.5 text-[10px] tabular-nums">
            {thumbnailSlides.length} slides
          </span>
          <div className="mx-1 h-4 w-px bg-hairline" />
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "rounded p-1 transition-colors",
              viewMode === "grid"
                ? "bg-beam/15 text-beam"
                : "hover:bg-panel-raised hover:text-foreground",
            )}
            title="Grid view"
          >
            <Grid2x2 className="size-3.5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "rounded p-1 transition-colors",
              viewMode === "list"
                ? "bg-beam/15 text-beam"
                : "hover:bg-panel-raised hover:text-foreground",
            )}
            title="List view"
          >
            <List className="size-3.5" />
          </button>
          <div className="mx-1 h-4 w-px bg-hairline" />
          <button
            onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - 1) as ZoomLevel)}
            disabled={zoom <= MIN_ZOOM}
            className="rounded p-1 transition-colors hover:bg-panel-raised hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent"
            title="Zoom out"
          >
            <ZoomOut className="size-3.5" />
          </button>
          <span className="w-12 text-center text-[10px] tabular-nums text-muted-foreground">
            {zoomConfig.label}
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + 1) as ZoomLevel)}
            disabled={zoom >= MAX_ZOOM}
            className="rounded p-1 transition-colors hover:bg-panel-raised hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent"
            title="Zoom in"
          >
            <ZoomIn className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Slide grid / list */}
      <div className="min-h-0 flex-1 overflow-y-auto p-2.5 scroll-slim">
        {viewMode === "grid" ? (
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(auto-fill, minmax(${zoomConfig.minWidth}px, 1fr))`,
            }}
          >
            {thumbnailSlides.map((slide, i) => {
              const isActive = slide.id === currentSlideId;
              return (
                <button
                  key={slide.id}
                  onClick={() => onSelectSlide(slide.id)}
                  className={cn(
                    "group overflow-hidden rounded-md text-left ring-1 transition-all",
                    isActive ? "ring-2 ring-beam" : "ring-hairline hover:ring-muted-foreground/60",
                  )}
                >
                  <div className="relative aspect-video w-full overflow-hidden">
                    <SlideView slide={slide} scale="thumb" />
                    <span className="absolute left-1 top-1 rounded bg-black/60 px-1 py-0.5 text-[9px] font-semibold tabular-nums text-white/90">
                      {i + 1}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "flex items-center justify-between px-1.5 py-0.5",
                      sectionBarClass(slide.kind),
                    )}
                  >
                    <span className="text-[8.5px] font-bold uppercase tracking-wide text-white/90">
                      {sectionLabel(slide.kind)}
                    </span>
                    <span className="text-[8.5px] tabular-nums text-white/70">{slide.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <ul className="space-y-1">
            {thumbnailSlides.map((slide, i) => {
              const isActive = slide.id === currentSlideId;
              return (
                <li key={slide.id}>
                  <button
                    onClick={() => onSelectSlide(slide.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left ring-1 transition-colors",
                      isActive
                        ? "bg-beam/12 ring-2 ring-beam"
                        : "bg-panel/40 ring-hairline hover:bg-panel-raised/60",
                    )}
                  >
                    <span
                      className={cn(
                        "w-6 shrink-0 text-right text-[11px] tabular-nums",
                        isActive ? "text-beam" : "text-muted-foreground",
                      )}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={cn("h-8 w-1.5 shrink-0 rounded-full", sectionBarClass(slide.kind))}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px] font-medium text-foreground">
                        {slide.label}
                      </span>
                      <span className="block truncate text-[10.5px] text-muted-foreground">
                        {slide.lines.length > 0 ? slide.lines[0] : "—"}
                      </span>
                    </span>
                    <span className="shrink-0 rounded bg-panel-raised px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-muted-foreground">
                      {sectionLabel(slide.kind)}
                    </span>
                    <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
                      {slide.lines.length} lines
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Media strip at bottom */}
      <div className="shrink-0 border-t border-hairline bg-panel px-3 py-2">
        <p className="eyebrow mb-1.5">Media & Backgrounds</p>
        <div className="flex gap-2 overflow-x-auto pb-1 scroll-slim">
          {media.map((m) => (
            <button
              key={m.id}
              onClick={() => onSelectMedia(m.id)}
              className={cn(
                "group w-24 shrink-0 overflow-hidden rounded text-left ring-1 transition-all",
                activeMediaId === m.id
                  ? "ring-2 ring-beam"
                  : "ring-hairline hover:ring-muted-foreground/60",
              )}
            >
              <div className={`aspect-video w-full bg-gradient-to-br ${m.tone}`} />
              <div className="bg-panel-raised px-1.5 py-0.5">
                <p className="truncate text-[10px]">{m.name}</p>
                <p className="text-[9px] text-muted-foreground">{m.type}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
