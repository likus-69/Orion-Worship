import {
  MonitorSpeaker,
  LayoutTemplate,
  CircleHelp,
  UserRound,
  Play,
  RotateCcw,
  Music2,
  Search,
} from "lucide-react";

export type TabId = "screens" | "layout" | "help" | "account";

export const tabs: { id: TabId; label: string; icon: typeof Play }[] = [
  { id: "screens", label: "Screens", icon: MonitorSpeaker },
  { id: "layout", label: "Layout", icon: LayoutTemplate },
  { id: "help", label: "Help", icon: CircleHelp },
  { id: "account", label: "Account", icon: UserRound },
];

type Props = {
  active: TabId | null;
  onSelect: (tab: TabId) => void;
  onPresent: () => void;
  /** Reset the service plan to the default seed plan. */
  onResetPlan?: () => void;
  /** Open the Song Library dialog. */
  onOpenLibrary?: () => void;
  live: boolean;
};

export function Toolbar({ active, onSelect, onPresent, onResetPlan, onOpenLibrary, live }: Props) {
  return (
    <header className="flex shrink-0 items-center gap-1 border-b border-hairline bg-panel px-2 py-1.5">
      {/* Brand */}
      <div className="flex items-center gap-2 px-2">
        <div className="grid size-6 place-items-center rounded bg-beam font-serif text-xs font-bold text-beam-foreground">
          V
        </div>
        <span className="hidden text-[13px] font-semibold tracking-tight sm:inline">Vespers</span>
      </div>

      <div className="mx-1 h-5 w-px bg-hairline" />

      {/* Icon nav tabs */}
      <nav className="flex items-center gap-0.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelect(tab.id)}
              title={tab.label}
              className={`inline-flex items-center gap-1.5 rounded px-2 py-1.5 text-[12px] transition-colors ${
                isActive
                  ? "bg-panel-raised text-foreground"
                  : "text-muted-foreground hover:bg-panel-raised/60 hover:text-foreground"
              }`}
            >
              <Icon className="size-4" />
              <span className="hidden xl:inline">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mx-1 h-5 w-px bg-hairline" />

      {/* Library + search quick-access */}
      {onOpenLibrary && (
        <button
          onClick={onOpenLibrary}
          title="Song Library"
          className="inline-flex items-center gap-1.5 rounded px-2 py-1.5 text-[12px] text-muted-foreground transition-colors hover:bg-panel-raised/60 hover:text-foreground"
        >
          <Music2 className="size-4" />
          <span className="hidden xl:inline">Library</span>
        </button>
      )}

      {/* Right cluster */}
      <div className="ml-auto flex items-center gap-1">
        {/* Live status pill */}
        <span
          className={`hidden items-center gap-1.5 rounded px-2 py-1 text-[10.5px] font-medium ring-1 sm:inline-flex ${
            live
              ? "bg-live/15 text-live ring-live/40"
              : "bg-panel-raised text-muted-foreground ring-hairline"
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${live ? "bg-live animate-pulse" : "bg-muted-foreground"}`}
          />
          {live ? "LIVE" : "STANDBY"}
        </span>

        {onResetPlan && (
          <button
            onClick={onResetPlan}
            title="Reset service plan"
            className="inline-flex items-center gap-1.5 rounded px-2 py-1.5 text-[12px] text-muted-foreground transition-colors hover:bg-panel-raised/60 hover:text-foreground"
          >
            <RotateCcw className="size-4" />
            <span className="hidden xl:inline">Reset</span>
          </button>
        )}

        <button
          onClick={onPresent}
          className="inline-flex items-center gap-1.5 rounded bg-beam px-3 py-1.5 text-[12px] font-bold text-beam-foreground transition-opacity hover:opacity-90"
        >
          <Play className="size-3.5 fill-current" />
          Present
        </button>
      </div>
    </header>
  );
}
