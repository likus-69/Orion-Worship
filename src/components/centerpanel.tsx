import { useMemo } from "react";
import { Grid2x2, List, ZoomIn, ZoomOut } from "lucide-react";
import {
  mediaItems,
  serviceItems as defaultServiceItems,
  type FlatSlide,
  type ServiceItem,
  type SlideKind,
} from "@/lib/service-data";
import { SlideView } from "./slideview";

type Props = {
  activeItemId: string;
  currentSlideId: string;
  onSelectSlide: (id: string) => void;
  current: FlatSlide | undefined;
  activeMediaId: string;
  onSelectMedia: (id: string) => void;
  /** Overrides the static service plan when the operator adds songs at runtime. */
  serviceItems?: ServiceItem[];
};

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
  current,
  activeMediaId,
  onSelectMedia,
  serviceItems,
}: Props) {
  const items = serviceItems ?? defaultServiceItems;
  const item = useMemo(
    () => items.find((s) => s.id === activeItemId) ?? items[0]!,
    [items, activeItemId],
  );

  const thumbnailSlides = useMemo(
    () => item.slides.map((slide) => ({ ...slide, itemId: item.id, itemTitle: item.title })),
    [item],
  );

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
            className="rounded p-1 hover:bg-panel-raised hover:text-foreground"
            title="Grid view"
          >
            <Grid2x2 className="size-3.5" />
          </button>
          <button
            className="rounded p-1 hover:bg-panel-raised hover:text-foreground"
            title="List view"
          >
            <List className="size-3.5" />
          </button>
          <div className="mx-1 h-4 w-px bg-hairline" />
          <button
            className="rounded p-1 hover:bg-panel-raised hover:text-foreground"
            title="Zoom out"
          >
            <ZoomOut className="size-3.5" />
          </button>
          <button
            className="rounded p-1 hover:bg-panel-raised hover:text-foreground"
            title="Zoom in"
          >
            <ZoomIn className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Slide grid */}
      <div className="min-h-0 flex-1 overflow-y-auto p-2.5 scroll-slim">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2">
          {thumbnailSlides.map((slide, i) => {
            const isActive = slide.id === currentSlideId;
            return (
              <button
                key={slide.id}
                onClick={() => onSelectSlide(slide.id)}
                className={`group overflow-hidden rounded-md text-left ring-1 transition-all ${
                  isActive ? "ring-2 ring-beam" : "ring-hairline hover:ring-muted-foreground/60"
                }`}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden">
                  <SlideView slide={slide} scale="thumb" />
                  {/* Number badge */}
                  <span className="absolute left-1 top-1 rounded bg-black/60 px-1 py-0.5 text-[9px] font-semibold tabular-nums text-white/90">
                    {i + 1}
                  </span>
                </div>
                {/* Section bar */}
                <div
                  className={`flex items-center justify-between px-1.5 py-0.5 ${sectionBarClass(slide.kind)}`}
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
      </div>

      {/* Media strip at bottom */}
      <div className="shrink-0 border-t border-hairline bg-panel px-3 py-2">
        <p className="eyebrow mb-1.5">Media & Backgrounds</p>
        <div className="flex gap-2 overflow-x-auto pb-1 scroll-slim">
          {mediaItems.map((m) => (
            <button
              key={m.id}
              onClick={() => onSelectMedia(m.id)}
              className={`group w-24 shrink-0 overflow-hidden rounded text-left ring-1 transition-all ${
                activeMediaId === m.id
                  ? "ring-2 ring-beam"
                  : "ring-hairline hover:ring-muted-foreground/60"
              }`}
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
