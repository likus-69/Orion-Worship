import { useState } from "react";
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
  Plus,
  Check,
} from "lucide-react";
import type { FlatSlide, SlideKind } from "@/lib/service-data";
import { mediaItems } from "@/lib/service-data";
import { cn } from "@/lib/utils";
import { SlideView } from "./slideview";
import { useMediaLibrary } from "@/hooks/use-media-library";

type Props = {
  current: FlatSlide | undefined;
  next: FlatSlide | undefined;
  live: boolean;
  onToggleLive: () => void;
  onNext: () => void;
  onPrev: () => void;
  position: string;
  activeMediaId: string;
  onSelectMedia: (id: string) => void;
};

type InspectorTabId = "text" | "align" | "color" | "transform";

export function OutputPanel({
  current,
  next,
  live,
  onToggleLive,
  onNext,
  onPrev,
  position,
  activeMediaId,
  onSelectMedia,
}: Props) {
  const [activeTab, setActiveTab] = useState<InspectorTabId>("text");

  return (
    <aside className="flex w-80 shrink-0 flex-col overflow-hidden border-l border-hairline bg-panel">
      {/* Preview section */}
      <div className="shrink-0 p-2.5">
        <div className="mb-1.5 flex items-center justify-between">
          <p className="eyebrow flex items-center gap-1.5">
            <Monitor className="size-3" /> Output
          </p>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-bold ring-1",
              live
                ? "bg-live/15 text-live ring-live/40"
                : "bg-panel-raised text-muted-foreground ring-hairline",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                live ? "bg-live animate-pulse" : "bg-muted-foreground",
              )}
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
            className={cn(
              "ml-auto inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-[11px] ring-1 transition-colors",
              live
                ? "bg-live/15 text-live ring-live/40 hover:bg-live/25"
                : "bg-panel-raised text-muted-foreground ring-hairline hover:text-foreground",
            )}
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
          {(
            [
              { id: "text", icon: Type, label: "Text" },
              { id: "align", icon: AlignCenter, label: "Align" },
              { id: "color", icon: Palette, label: "Color" },
              { id: "transform", icon: Sliders, label: "Transform" },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                title={tab.label}
                className={cn(
                  "inline-flex items-center gap-1 rounded px-2 py-1 text-[10.5px] transition-colors",
                  isActive
                    ? "bg-beam/15 text-beam"
                    : "text-muted-foreground hover:bg-panel-raised hover:text-foreground",
                )}
              >
                <Icon className="size-3.5" />
              </button>
            );
          })}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-2.5 scroll-slim">
          {current && current.kind !== "blank" ? (
            <InspectorContent tab={activeTab} slide={current} />
          ) : (
            <p className="py-4 text-center text-[11px] text-muted-foreground">
              Select a slide to inspect.
            </p>
          )}
        </div>
      </div>

      {/* Media bin */}
      <MediaBin activeMediaId={activeMediaId} onSelectMedia={onSelectMedia} />
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Inspector content per tab
// ---------------------------------------------------------------------------

function InspectorContent({ tab, slide }: { tab: InspectorTabId; slide: FlatSlide }) {
  switch (tab) {
    case "text":
      return <TextInspector slide={slide} />;
    case "align":
      return <AlignInspector slide={slide} />;
    case "color":
      return <ColorInspector slide={slide} />;
    case "transform":
      return <TransformInspector slide={slide} />;
  }
}

function TextInspector({ slide }: { slide: FlatSlide }) {
  return (
    <div className="space-y-2">
      <InspectorField label="Label" value={slide.label} />
      <InspectorField label="Kind" value={slide.kind} />
      <InspectorField label="Lines" value={String(slide.lines.length)} />
      {slide.attribution && <InspectorField label="Attribution" value={slide.attribution} />}
      {slide.lines.length > 0 && (
        <div className="pt-1">
          <p className="eyebrow mb-1">Content</p>
          <div className="space-y-0.5 rounded bg-background/40 p-2 ring-1 ring-hairline">
            {slide.lines.map((line, i) => (
              <p key={i} className="truncate font-serif text-[11px] text-foreground/80">
                {line}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AlignInspector({ slide }: { slide: FlatSlide }) {
  // Alignment is derived from the slide kind: lyrics/scripture use paper
  // (centered, balanced); sermon/sermon use dark stage (centered, tight).
  const isPaper = slide.kind === "lyrics" || slide.kind === "scripture";
  return (
    <div className="space-y-2">
      <InspectorField label="Horizontal" value="Center" />
      <InspectorField label="Vertical" value="Middle" />
      <InspectorField label="Text wrap" value="Balanced" />
      <InspectorField label="Reading dir" value="LTR" />
      <InspectorField label="Text align" value="Centered" />
      <InspectorField label="Line break" value={slide.lines.length > 1 ? "Per line" : "Single"} />
      <InspectorField label="Safe margins" value="6% edges" />
      <InspectorField label="Theme" value={isPaper ? "Paper" : "Stage dark"} />
    </div>
  );
}

function ColorInspector({ slide }: { slide: FlatSlide }) {
  const isPaper = slide.kind === "lyrics" || slide.kind === "scripture";
  return (
    <div className="space-y-2">
      <InspectorField label="Background" value={isPaper ? "Linen paper" : "Stage dark"} />
      <InspectorField label="Text color" value={isPaper ? "Ink" : "White"} />
      <InspectorField
        label="Accent"
        value={
          slide.kind === "lyrics"
            ? "Cyan"
            : slide.kind === "scripture"
              ? "Purple"
              : slide.kind === "sermon"
                ? "Amber"
                : "Blue"
        }
      />
      <InspectorField label="Label color" value={isPaper ? "Ink 45%" : "Beam 80%"} />
      <InspectorField label="Attribution" value={isPaper ? "Ink 45%" : "Muted"} />
      <InspectorField label="Overlay" value={isPaper ? "None" : "Stage wash 70%"} />
      <InspectorField label="Section bar" value={sectionBarHex(slide.kind)} />
      <div className="pt-1">
        <p className="eyebrow mb-1.5">Section bar swatch</p>
        <div className={cn("h-6 w-full rounded", sectionBarClass(slide.kind))} />
      </div>
    </div>
  );
}

function TransformInspector({ slide }: { slide: FlatSlide }) {
  const isPaper = slide.kind === "lyrics" || slide.kind === "scripture";
  return (
    <div className="space-y-2">
      <InspectorField
        label="Font family"
        value={isPaper ? "Fraunces (serif)" : "Fraunces (serif)"}
      />
      <InspectorField label="Font weight" value="Medium" />
      <InspectorField
        label="Size category"
        value={slide.kind === "title" ? "Display" : slide.kind === "sermon" ? "Heading" : "Body"}
      />
      <InspectorField label="Line height" value={slide.kind === "sermon" ? "1.18" : "1.14"} />
      <InspectorField label="Letter spacing" value={slide.kind === "sermon" ? "Tight" : "Normal"} />
      <InspectorField label="Text balance" value="Balanced" />
      <InspectorField label="Scale" value="Preview 13px" />
      <InspectorField label="Rotation" value="0°" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Media bin
// ---------------------------------------------------------------------------

function MediaBin({
  activeMediaId,
  onSelectMedia,
}: {
  activeMediaId: string;
  onSelectMedia: (id: string) => void;
}) {
  const { media } = useMediaLibrary();
  const [showImport, setShowImport] = useState(false);
  const [importName, setImportName] = useState("");
  const [importTone, setImportTone] = useState("");
  const { addMedia } = useMediaLibrary();

  const handleImport = () => {
    const name = importName.trim();
    if (!name) return;
    addMedia({
      name,
      type: "Still",
      tone: importTone.trim() || "from-[#2a2a2a] to-[#1a1a1a]",
    });
    setImportName("");
    setImportTone("");
    setShowImport(false);
  };

  return (
    <div className="shrink-0 border-t border-hairline bg-background/30 px-2.5 py-2">
      <div className="mb-1.5 flex items-center justify-between">
        <p className="eyebrow flex items-center gap-1.5">
          <Film className="size-3" /> Media Bin
        </p>
        <button
          onClick={() => setShowImport((s) => !s)}
          title="Add media item"
          className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-beam/90 ring-1 ring-beam/30 transition-colors hover:bg-beam/12 hover:text-beam"
        >
          <Plus className="size-3" />
          Add
        </button>
      </div>

      {showImport && (
        <div className="mb-2 space-y-1.5 rounded bg-panel/60 p-2 ring-1 ring-hairline">
          <input
            value={importName}
            onChange={(e) => setImportName(e.target.value)}
            placeholder="Media name (e.g. Sunset)"
            className="w-full rounded bg-background/60 px-2 py-1 text-[11px] outline-none ring-1 ring-hairline placeholder:text-muted-foreground focus:ring-beam/50"
            autoFocus
          />
          <input
            value={importTone}
            onChange={(e) => setImportTone(e.target.value)}
            placeholder="Tailwind gradient (e.g. from-[#ff8800] to-[#880000])"
            className="w-full rounded bg-background/60 px-2 py-1 text-[10px] outline-none ring-1 ring-hairline placeholder:text-muted-foreground focus:ring-beam/50"
          />
          <button
            onClick={handleImport}
            disabled={!importName.trim()}
            className="inline-flex w-full items-center justify-center gap-1 rounded bg-beam px-2 py-1 text-[11px] font-semibold text-beam-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <Check className="size-3" />
            Add to bin
          </button>
        </div>
      )}

      <div className="grid grid-cols-4 gap-1.5">
        {media.map((m) => {
          const isActive = m.id === activeMediaId;
          return (
            <button
              key={m.id}
              onClick={() => onSelectMedia(m.id)}
              title={m.name}
              className={cn(
                "group overflow-hidden rounded ring-1 transition-all",
                isActive ? "ring-2 ring-beam" : "ring-hairline hover:ring-muted-foreground/60",
              )}
            >
              <div className={`aspect-square w-full bg-gradient-to-br ${m.tone}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

function sectionBarHex(kind: SlideKind): string {
  switch (kind) {
    case "title":
      return "#3B82F6";
    case "lyrics":
      return "#06B6D4";
    case "scripture":
      return "#A855F7";
    case "sermon":
      return "#F59E0B";
    case "blank":
    default:
      return "#6B7280";
  }
}

function InspectorField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-hairline/50 pb-1">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="truncate text-[11px] text-foreground/90">{value}</span>
    </div>
  );
}
