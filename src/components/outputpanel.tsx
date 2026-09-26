import { Monitor, Eye, EyeOff, SkipForward } from "lucide-react";
import type { FlatSlide } from "@/lib/service-data";
import { SlideView } from "./slideview";

type Props = {
  current: FlatSlide | undefined;
  next: FlatSlide | undefined;
  live: boolean;
  onToggleLive: () => void;
  onNext: () => void;
  position: string;
};

export function OutputPanel({ current, next, live, onToggleLive, onNext, position }: Props) {
  return (
    <aside className="flex w-80 shrink-0 flex-col gap-3 overflow-y-auto border-l border-hairline panel-surface p-3 scroll-slim">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="eyebrow flex items-center gap-1.5">
            <Monitor className="size-3" /> Monitor output
          </p>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] ring-1 ${
              live ? "bg-live/15 text-live ring-live/40" : "bg-panel-raised text-muted-foreground ring-hairline"
            }`}
          >
            <span className={`size-1.5 rounded-full ${live ? "bg-live animate-pulse" : "bg-muted-foreground"}`} />
            {live ? "LIVE" : "OFF"}
          </span>
        </div>
        <div className="aspect-video w-full overflow-hidden rounded-lg ring-1 ring-hairline">
          {live ? <SlideView slide={current} scale="preview" /> : <div className="h-full w-full bg-[#06080d]" />}
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Main screen · 1920×1080 · {position}
        </p>
      </div>

      <div>
        <p className="eyebrow mb-2">Up next</p>
        <div className="aspect-video w-full overflow-hidden rounded-lg opacity-70 ring-1 ring-hairline">
          <SlideView slide={next} scale="preview" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onToggleLive}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-panel-raised px-3 py-2 text-[12.5px] ring-1 ring-hairline transition-colors hover:bg-accent"
        >
          {live ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
          {live ? "Black out" : "Go live"}
        </button>
        <button
          onClick={onNext}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-panel-raised px-3 py-2 text-[12.5px] ring-1 ring-hairline transition-colors hover:bg-accent"
        >
          <SkipForward className="size-3.5" />
          Advance
        </button>
      </div>

      <div className="rounded-lg bg-panel-raised/50 p-3 ring-1 ring-hairline">
        <p className="eyebrow mb-2">Stage notes</p>
        <p className="text-[12.5px] leading-relaxed text-muted-foreground">
          Hold on the final chorus until the band resolves. Lower lyrics opacity during
          the prayer.
        </p>
      </div>

      <div className="rounded-lg bg-panel-raised/50 p-3 ring-1 ring-hairline">
        <p className="eyebrow mb-2">Outputs</p>
        <ul className="space-y-1.5 text-[12px]">
          {[
            ["Main screen", "Connected"],
            ["Foyer display", "Connected"],
            ["Stage monitor", "Mirroring"],
            ["Stream feed", "Idle"],
          ].map(([name, state]) => (
            <li key={name} className="flex items-center justify-between">
              <span>{name}</span>
              <span className="text-muted-foreground">{state}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
