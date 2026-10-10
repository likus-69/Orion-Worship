import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { CenterPanel } from "@/components/centerpanel";
import { LeftPanel } from "@/components/leftpanel";
import { OutputPanel } from "@/components/outputpanel";
import { PresentOverlay } from "@/components/presentoverlay";
import { Toolbar, type TabId } from "@/components/toolbar";
import { mediaItems, serviceItems } from "@/lib/service-data";
import { songToServiceItem, type Song } from "@/lib/song-library";
import { useServicePlan } from "@/hooks/use-service-plan";

const title = "Vespers — Church Presentation Software";
const description =
  "Run your worship service from one screen: song lists and playlists, slides and media, and a live monitor output for lyrics, scripture and sermon notes.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  // Persist the service plan to localStorage so songs added during a service
  // survive a page refresh. See hooks/use-service-plan.ts for details.
  const { items, setItems, resetPlan } = useServicePlan();
  const [activeItemId, setActiveItemId] = useState(serviceItems[1]!.id);
  const [currentSlideId, setCurrentSlideId] = useState(serviceItems[1]!.slides[0]!.id);
  const [activeMediaId, setActiveMediaId] = useState(mediaItems[0]!.id);
  const [tab, setTab] = useState<TabId | null>(null);
  const [live, setLive] = useState(true);
  const [presenting, setPresenting] = useState(false);

  // Derive the flat slide list from state so the operator's added songs are
  // immediately navigable in the center + output panels.
  const flatSlides = useMemo(
    () =>
      items.flatMap((item) =>
        item.slides.map((slide) => ({
          ...slide,
          itemId: item.id,
          itemTitle: item.title,
        })),
      ),
    [items],
  );

  const slideIndexById = useMemo(
    () => new Map(flatSlides.map((slide, index) => [slide.id, index])),
    [flatSlides],
  );
  const serviceItemById = useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);

  const index = useMemo(() => {
    const slideIndex = slideIndexById.get(currentSlideId);
    return slideIndex === undefined ? 0 : Math.max(0, slideIndex);
  }, [currentSlideId, slideIndexById]);

  const current = flatSlides[index];
  const next = flatSlides[index + 1];

  const goTo = useCallback(
    (i: number) => {
      if (flatSlides.length === 0) return;
      const clamped = Math.min(Math.max(i, 0), flatSlides.length - 1);
      const slide = flatSlides[clamped]!;
      setCurrentSlideId(slide.id);
      setActiveItemId(slide.itemId);
    },
    [flatSlides],
  );

  const selectItem = useCallback(
    (id: string) => {
      setActiveItemId(id);
      const item = serviceItemById.get(id);
      if (item?.slides[0]) setCurrentSlideId(item.slides[0].id);
    },
    [serviceItemById],
  );

  const handleAddSong = useCallback(
    (song: Song) => {
      const item = songToServiceItem(song);
      setItems((prev) =>
        prev.some((existing) => existing.id === item.id) ? prev : [...prev, item],
      );
      // Jump straight to the newly added song so the operator sees it land.
      setActiveItemId(item.id);
      if (item.slides[0]) setCurrentSlideId(item.slides[0].id);
      toast.success(`Added "${song.title}" to the service plan`, {
        description: `${item.slides.length} slides inserted · ${song.author} · Key of ${song.key}`,
      });
    },
    [setItems],
  );

  const handleResetPlan = useCallback(() => {
    const ok = window.confirm(
      "Reset the service plan to the default? Songs you've added will be removed from the plan (but stay in your library).",
    );
    if (!ok) return;
    resetPlan();
    const first = serviceItems[1]!;
    setActiveItemId(first.id);
    setCurrentSlideId(first.slides[0]!.id);
    toast.success("Service plan reset to default");
  }, [resetPlan]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background stage-wash">
      <Toolbar
        active={tab}
        onSelect={(t) => setTab((prev) => (prev === t ? null : t))}
        onPresent={() => setPresenting(true)}
        onResetPlan={handleResetPlan}
        live={live}
      />
      {tab && <div>tab content</div>}

      <div className="flex min-h-0 flex-1">
        <LeftPanel
          activeItemId={activeItemId}
          onSelectItem={selectItem}
          serviceItems={items}
          onAddSong={handleAddSong}
        />
        <CenterPanel
          activeItemId={activeItemId}
          currentSlideId={currentSlideId}
          onSelectSlide={(id) => {
            const slideIndex = slideIndexById.get(id);
            if (slideIndex !== undefined) goTo(slideIndex);
          }}
          current={current}
          activeMediaId={activeMediaId}
          onSelectMedia={setActiveMediaId}
          serviceItems={items}
        />
        <OutputPanel
          current={current}
          next={next}
          live={live}
          onToggleLive={() => setLive((v) => !v)}
          onNext={() => goTo(index + 1)}
          position={`Slide ${index + 1} of ${flatSlides.length}`}
        />
      </div>

      {presenting && (
        <PresentOverlay
          slide={current}
          index={index}
          total={flatSlides.length}
          onNext={() => goTo(index + 1)}
          onPrev={() => goTo(index - 1)}
          onExit={() => setPresenting(false)}
        />
      )}
    </div>
  );
}
