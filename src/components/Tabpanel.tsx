import { X } from "lucide-react";
import type { TabId } from "./toolbar";

const content: Record<TabId, { title: string; rows: [string, string][] }> = {
  screens: {
    title: "Screen configuration",
    rows: [
      ["Main screen", "1920 × 1080 · Projector, extended"],
      ["Foyer display", "1280 × 720 · Mirrored"],
      ["Stage monitor", "Lyrics + next slide + clock"],
      ["Stream feed", "Lower-third lyrics only"],
    ],
  },
  layout: {
    title: "Slide layout",
    rows: [
      ["Text alignment", "Centered, vertically middle"],
      ["Lyrics typeface", "Fraunces · Medium · 64 pt"],
      ["Safe margins", "6% on all edges"],
      ["Transition", "Crossfade · 400 ms"],
    ],
  },
  help: {
    title: "Help & shortcuts",
    rows: [
      ["Next / previous slide", "→  ·  ←"],
      ["Go live / black out", "B"],
      ["Start presenting", "F5"],
      ["Exit presentation", "Esc"],
    ],
  },
  account: {
    title: "Account",
    rows: [
      ["Signed in as", "R. Calloway · Media Lead"],
      ["Church", "Grace Chapel"],
      ["Team", "4 members · 2 online"],
      ["Plan", "Congregation · renews monthly"],
    ],
  },
};

export function TabPanel({ tab, onClose }: { tab: TabId; onClose: () => void }) {
  const data = content[tab];
  return (
    <div className="shrink-0 border-b border-hairline bg-panel-raised/60 px-4 py-3">
      <div className="mb-2 flex items-center">
        <p className="eyebrow">{data.title}</p>
        <button
          onClick={onClose}
          className="ml-auto rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Close panel"
        >
          <X className="size-3.5" />
        </button>
      </div>
      <dl className="grid gap-x-8 gap-y-1.5 text-[12.5px] sm:grid-cols-2 lg:grid-cols-4">
        {data.rows.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-3 border-b border-hairline/60 pb-1.5">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="truncate text-right">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
