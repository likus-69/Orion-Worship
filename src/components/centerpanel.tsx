import { Clock, Film, Plus } from "lucide-react";
import { mediaItems, serviceItems, type FlatSlide } from "@/lib/service-data";
import { SlideView } from "./slideview";

type Props = {
  activeItemId: string;
  currentSlideId: string;
  onSelectSlide: (id: string) => void;
  current: FlatSlide | undefined;
  activeMediaId: string;
  onSelectMedia: (id: string) => void;
};

export function CenterPanel({
  activeItemId,
  currentSlideId,
  onSelectSlide,
  current,
  activeMediaId,
  onSelectMedia,
}: Props) {
  const item = serviceItems.find((s) => s.id === activeItemId) ?? serviceItems[0]!;

  return (
    <main className="flex min-w-0 flex-1 flex-col">
      <div className="flex items-center gap-3 border-b border-hairline px-4 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{item.title}</p>
          <p className="truncate text-[11px] text-muted-foreground">{item.subtitle}</p>
        </div>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-panel-raised px-3 py-1 text-[11px] text-muted-foreground ring-1 ring-hairline">
          <Clock className="size-3" /> Schedule · {serviceItems.length} items
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4 scroll-slim">
        <div className="mx-auto aspect-video w-full max-w-3xl overflow-hidden rounded-xl ring-1 ring-white/10 [box-shadow:var(--shadow-stage)]">
          <SlideView slide={current} scale="canvas" />
        </div>

        <div>
          <p className="eyebrow mb-2">Slides in this item</p>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-2.5">
            {item.slides.map((slide, i) => {
              const isActive = slide.id === currentSlideId;
              return (
                <button
                  key={slide.id}
                  onClick={() => onSelectSlide(slide.id)}
                  className={`group overflow-hidden rounded-lg text-left ring-1 transition-all ${
                    isActive
                      ? "ring-2 ring-beam"
                      : "ring-hairline hover:ring-muted-foreground/60"
                  }`}
                >
                  <div className="aspect-video w-full">
                    <SlideView
                      slide={{ ...slide, itemId: item.id, itemTitle: item.title }}
                      scale="thumb"
                    />
                  </div>
                  <div className="flex items-center justify-between bg-panel-raised/70 px-2 py-1">
                    <span className="truncate text-[11px]">{slide.label}</span>
                    <span className="text-[10px] text-muted-foreground">{i + 1}</span>
                  </div>
                </button>
              );
            })}
            <button className="grid aspect-video place-items-center rounded-lg border border-dashed border-hairline text-muted-foreground transition-colors hover:border-beam/50 hover:text-beam">
              <Plus className="size-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-hairline bg-panel/60 px-4 py-3">
        <p className="eyebrow mb-2 flex items-center gap-1.5">
          <Film className="size-3" /> Media & backgrounds
        </p>
        <div className="flex gap-2.5 overflow-x-auto pb-1 scroll-slim">
          {mediaItems.map((m) => (
            <button
              key={m.id}
              onClick={() => onSelectMedia(m.id)}
              className={`group w-28 shrink-0 overflow-hidden rounded-lg text-left ring-1 transition-all ${
                activeMediaId === m.id
                  ? "ring-2 ring-beam"
                  : "ring-hairline hover:ring-muted-foreground/60"
              }`}
            >
              <div className={`aspect-video w-full bg-gradient-to-br ${m.tone}`} />
              <div className="bg-panel-raised/70 px-2 py-1">
                <p className="truncate text-[11px]">{m.name}</p>
                <p className="text-[10px] text-muted-foreground">{m.type}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
