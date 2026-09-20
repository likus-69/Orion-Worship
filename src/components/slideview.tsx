import type { FlatSlide } from "@/lib/service-data";

type Props = {
  slide: FlatSlide | undefined;
  /** 1 = full presentation size, smaller for thumbnails/previews */
  scale?: "thumb" | "preview" | "canvas" | "full";
  background?: string;
};

const sizes = {
  thumb: {
    body: "text-[7px] leading-tight",
    label: "text-[5px] tracking-[0.2em]",
    attr: "text-[5px]",
    pad: "px-1.5",
    gap: "mt-1",
  },
  preview: {
    body: "text-[13px] leading-snug",
    label: "text-[8px] tracking-[0.25em]",
    attr: "text-[8px]",
    pad: "px-4",
    gap: "mt-2",
  },
  canvas: {
    body: "text-2xl sm:text-3xl lg:text-[2.6rem] leading-[1.18]",
    label: "text-[11px] tracking-[0.28em]",
    attr: "text-xs",
    pad: "px-10",
    gap: "mt-5",
  },
  full: {
    body: "text-4xl sm:text-6xl lg:text-7xl leading-[1.14]",
    label: "text-sm tracking-[0.3em]",
    attr: "text-base",
    pad: "px-16",
    gap: "mt-10",
  },
} as const;

export function SlideView({ slide, scale = "canvas", background }: Props) {
  const s = sizes[scale];

  if (!slide || slide.kind === "blank") {
    return <div className="h-full w-full bg-[#06080d]" />;
  }

  const onPaper = slide.kind === "lyrics" || slide.kind === "scripture";

  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center text-center ${s.pad} ${
        onPaper ? "bg-paper text-paper-ink" : "bg-[#0a0e18] text-foreground"
      } ${background ?? ""}`}
    >
      {!onPaper && (
        <div className="stage-wash pointer-events-none absolute inset-0 opacity-70" />
      )}
      <div className="relative">
        <p
          className={`eyebrow ${s.label} ${
            onPaper ? "text-paper-ink/45" : "text-beam/80"
          }`}
        >
          {slide.itemTitle} · {slide.label}
        </p>
        <div className={s.gap}>
          {slide.lines.map((line, i) => (
            <p
              key={i}
              className={`font-serif font-medium text-balance ${s.body} ${
                slide.kind === "sermon" ? "tracking-tight" : ""
              }`}
            >
              {line}
            </p>
          ))}
        </div>
        {slide.attribution && (
          <p
            className={`${s.gap} ${s.attr} ${
              onPaper ? "text-paper-ink/45" : "text-muted-foreground"
            }`}
          >
            {slide.attribution}
          </p>
        )}
      </div>
    </div>
  );
}
