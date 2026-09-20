import { MonitorSpeaker, LayoutTemplate, CircleHelp, UserRound, Play } from "lucide-react";

export type TabId = "screens" | "layout" | "help" | "account";

export const tabs: { id: TabId; label: string; icon: typeof Play }[] = [
  { id: "screens", label: "Screen Configuration", icon: MonitorSpeaker },
  { id: "layout", label: "Slide Layout", icon: LayoutTemplate },
  { id: "help", label: "Help", icon: CircleHelp },
  { id: "account", label: "Account", icon: UserRound },
];

type Props = {
  active: TabId | null;
  onSelect: (tab: TabId) => void;
  onPresent: () => void;
  live: boolean;
};

export function Toolbar({ active, onSelect, onPresent, live }: Props) {
  return (
    <header className="flex shrink-0 items-center gap-4 border-b border-hairline panel-surface px-4 py-2.5">
      <div className="flex items-center gap-2.5">
        <div className="grid size-8 place-items-center rounded-md bg-beam/85 font-serif text-base font-semibold text-beam-foreground">
          V
        </div>
        <div className="leading-tight">
          <p className="text-sm font-medium">Vespers</p>
          <p className="text-[11px] text-muted-foreground">Sunday Gathering · 10:00 AM</p>
        </div>
      </div>

      <nav className="ml-4 flex items-center gap-1 overflow-x-auto scroll-slim">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelect(tab.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-[13px] transition-colors ${
                isActive
                  ? "bg-panel-raised text-foreground ring-1 ring-hairline"
                  : "text-muted-foreground hover:bg-panel-raised/60 hover:text-foreground"
              }`}
            >
              <Icon className="size-3.5" />
              <span className="hidden lg:inline">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <span
          className={`hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] ring-1 sm:inline-flex ${
            live
              ? "bg-live/15 text-live ring-live/40"
              : "bg-panel-raised text-muted-foreground ring-hairline"
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${live ? "bg-live animate-pulse" : "bg-muted-foreground"}`}
          />
          {live ? "On air" : "Standby"}
        </span>
        <button
          onClick={onPresent}
          className="inline-flex items-center gap-2 rounded-md bg-beam px-4 py-2 text-sm font-semibold text-beam-foreground transition-opacity hover:opacity-90"
        >
          <Play className="size-3.5 fill-current" />
          Present
        </button>
      </div>
    </header>
  );
}
