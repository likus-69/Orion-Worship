import {
  Monitor,
  Eye,
  EyeOff,
  SkipForward,
  SkipBack,
  Type,
  AlignCenter,
  Palette,
  Sliders,
  Film,
} from "lucide-react";
import type { FlatSlide } from "@/lib/service-data";
import { SlideView } from "./slideview";

type Props = {
  current: FlatSlide | undefined;
  next: FlatSlide | undefined;
  live: boolean;
  onToggleLive: () => void;
  onNext: () => void;
  onPrev: () => void;
  position: string;
};

type InspectorTab = "text" | "align" | "color" | "transform";

export function OutputPanel({
  current,
  next,
  live,
  onToggleLive,
  onNext,
  onPrev,
  position,
}: Props) {
  return (
    <aside className="flex w-80 shrink-0 flex-col overflow-hidden border-l border-hairline bg-panel">
      {/* Preview section */}
      <div className="shrink-0 p-2.5">
        <div className="mb-1.5 flex items-center justify-between">
          <p className="eyebrow flex items-center gap-1.5">
            <Monitor className="size-3" /> Output
          </p>
          <span
            className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-bold ring-1 ${
              live
                ? "bg-live/15 text-live ring-live/40"
                : "bg-panel-raised text-muted-foreground ring-hairline"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${live ? "bg-live animate-pulse" : "bg-muted-foreground"}`}
            />
            {live ? "LIVE" : "OFF"}
          </span>
        </div>
        <div className="aspect-video w-full overflow-hidden rounded ring-1 ring-hairline">
          {live ? (
            <SlideView slide={current} scale="preview" />
          ) : (
            <div className="h-full w-full bg-[#06080d]" />
          )}
        </div>
        <p className="mt-1 text-[10px] text-muted-foreground">{position}</p>
      </div>

      {/* Transport controls */}
      <div className="shrink-0 border-y border-hairline bg-background/30 px-2.5 py-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onPrev}
            title="Previous slide"
            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-panel-raised hover:text-foreground"
          >
            <SkipBack className="size-3.5" />
          </button>
          <button
            onClick={onNext}
            title="Next slide"
            className="rounded bg-beam/15 p-1.5 text-beam ring-1 ring-beam/30 transition-colors hover:bg-beam/25"
          >
            <SkipForward className="size-3.5" />
          </button>
          <button
            onClick={onToggleLive}
            className={`ml-auto inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-[11px] ring-1 transition-colors ${
              live
                ? "bg-live/15 text-live ring-live/40 hover:bg-live/25"
                : "bg-panel-raised text-muted-foreground ring-hairline hover:text-foreground"
            }`}
          >
            {live ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
            {live ? "Black out" : "Go live"}
          </button>
        </div>
      </div>

      {/* Up next preview */}
      <div className="shrink-0 px-2.5 py-2">
        <p className="eyebrow mb-1.5">Up Next</p>
        <div className="aspect-video w-full overflow-hidden rounded opacity-70 ring-1 ring-hairline">
          <SlideView slide={next} scale="preview" />
        </div>
      </div>

      {/* Inspector */}
      <div className="flex min-h-0 flex-1 flex-col border-t border-hairline">
        <div className="flex shrink-0 items-center gap-0.5 border-b border-hairline px-2 py-1.5">
          <InspectorTabButton icon={Type} label="Text" active />
          <InspectorTabButton icon={AlignCenter} label="Align" />
          <InspectorTabButton icon={Palette} label="Color" />
          <InspectorTabButton icon={Sliders} label="Transform" />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-2.5 scroll-slim">
          {current && current.kind !== "blank" ? (
            <div className="space-y-2">
              <InspectorField label="Label" value={current.label} />
              {current.attribution && (
                <InspectorField label="Attribution" value={current.attribution} />
              )}
              <InspectorField label="Lines" value={String(current.lines.length)} />
              <InspectorField label="Kind" value={current.kind} />
            </div>
          ) : (
            <p className="py-4 text-center text-[11px] text-muted-foreground">
              Select a slide to inspect.
            </p>
          )}
        </div>
      </div>

      {/* Media bin */}
      <div className="shrink-0 border-t border-hairline bg-background/30 px-2.5 py-2">
        <p className="eyebrow mb-1.5 flex items-center gap-1.5">
          <Film className="size-3" /> Media Bin
        </p>
        <div className="grid place-items-center rounded border border-dashed border-hairline py-4 text-center">
          <Film className="size-5 text-muted-foreground/50" />
          <p className="mt-1 text-[10px] text-muted-foreground">Import media</p>
        </div>
      </div>
    </aside>
  );
}

function InspectorTabButton({
  icon: Icon,
  label,
  active = false,
}: {
  icon: typeof Type;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      title={label}
      className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[10.5px] transition-colors ${
        active
          ? "bg-beam/15 text-beam"
          : "text-muted-foreground hover:bg-panel-raised hover:text-foreground"
      }`}
    >
      <Icon className="size-3.5" />
    </button>
  );
}

function InspectorField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-hairline/50 pb-1">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="truncate text-[11px] text-foreground/90">{value}</span>
    </div>
  );
}
