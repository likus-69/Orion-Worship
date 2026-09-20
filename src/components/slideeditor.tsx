import { AlignLeft, Type } from "lucide-react";

import type { FlatSlide } from "@/lib/service-data";
import type { Slide } from "@/lib/service-data";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  slide: FlatSlide;
  onUpdate: (id: string, patch: Partial<Slide>) => void;
};

export function SlideEditor({ slide, onUpdate }: Props) {
  const isBlank = slide.kind === "blank";

  return (
    <div className="grid gap-3 px-4 py-3 sm:grid-cols-[140px_1fr_220px]">
      <div className="space-y-1.5">
        <label className="eyebrow" htmlFor="slide-label">
          Slide label
        </label>
        <Input
          id="slide-label"
          value={slide.label}
          disabled={isBlank}
          onChange={(e) => onUpdate(slide.id, { label: e.target.value })}
          className="h-8 bg-panel-raised/60 text-xs ring-hairline"
        />
        <label className="eyebrow block pt-1.5" htmlFor="slide-attr">
          Attribution
        </label>
        <Input
          id="slide-attr"
          value={slide.attribution ?? ""}
          disabled={isBlank}
          placeholder="e.g. Psalm 23:1–2"
          onChange={(e) =>
            onUpdate(slide.id, { attribution: e.target.value || undefined })
          }
          className="h-8 bg-panel-raised/60 text-xs ring-hairline"
        />
      </div>

      <div className="space-y-1.5">
        <label
          className="eyebrow flex items-center gap-1.5"
          htmlFor="slide-lines"
        >
          <AlignLeft className="size-3" /> Text — one line per row
        </label>
        <Textarea
          id="slide-lines"
          value={slide.lines.join("\n")}
          disabled={isBlank}
          onChange={(e) =>
            onUpdate(slide.id, {
              lines: e.target.value.split("\n").filter((l) => l.trim() !== ""),
            })
          }
          rows={5}
          placeholder={isBlank ? "Blank slides have no text" : "Type the slide text…"}
          className="min-h-28 resize-y bg-panel-raised/60 font-serif text-sm leading-relaxed ring-hairline"
        />
      </div>

      <div className="space-y-1.5">
        <p className="eyebrow flex items-center gap-1.5">
          <Type className="size-3" /> Theme
        </p>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { id: "stage", name: "Stage dark", cls: "from-[#1b2340] to-[#080b14]" },
              { id: "paper", name: "Linen paper", cls: "from-[#efe7d7] to-[#cfc3ab]" },
            ] as const
          ).map((t) => {
            const active = (slide.theme ?? (slide.kind === "lyrics" || slide.kind === "scripture" ? "paper" : "stage")) === t.id;
            return (
              <button
                key={t.id}
                type="button"
                disabled={isBlank}
                onClick={() => onUpdate(slide.id, { theme: t.id })}
                className={`overflow-hidden rounded-lg text-left ring-1 transition-all disabled:opacity-40 ${
                  active
                    ? "ring-2 ring-beam"
                    : "ring-hairline hover:ring-muted-foreground/60"
                }`}
              >
                <div className={`aspect-[2/1] w-full bg-gradient-to-br ${t.cls}`} />
                <p className="bg-panel-raised/70 px-2 py-1 text-[10px]">{t.name}</p>
              </button>
            );
          })}
        </div>
        <p className="pt-1 text-[10px] leading-snug text-muted-foreground">
          Changes apply live to the canvas, monitor output and presentation.
        </p>
      </div>
    </div>
  );
}
