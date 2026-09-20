import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";

import { CenterPanel } from "@/components/church/CenterPanel";
import { LeftPanel } from "@/components/church/LeftPanel";
import { OutputPanel } from "@/components/church/OutputPanel";
import { PresentOverlay } from "@/components/church/PresentOverlay";
import { TabPanel } from "@/components/church/TabPanel";
import { Toolbar, type TabId } from "@/components/church/Toolbar";
import { flatSlides, mediaItems, serviceItems } from "@/lib/service-data";

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
  const [activeItemId, setActiveItemId] = useState(serviceItems[1]!.id);
  const [currentSlideId, setCurrentSlideId] = useState(serviceItems[1]!.slides[0]!.id);
  const [activeMediaId, setActiveMediaId] = useState(mediaItems[0]!.id);
  const [tab, setTab] = useState<TabId | null>(null);
  const [live, setLive] = useState(true);
  const [presenting, setPresenting] = useState(false);

  const index = useMemo(
    () => Math.max(0, flatSlides.findIndex((s) => s.id === currentSlideId)),
    [currentSlideId],
  );
  const current = flatSlides[index];
  const next = flatSlides[index + 1];

  const goTo = useCallback((i: number) => {
    const clamped = Math.min(Math.max(i, 0), flatSlides.length - 1);
    const slide = flatSlides[clamped]!;
    setCurrentSlideId(slide.id);
    setActiveItemId(slide.itemId);
  }, []);

  const selectItem = (id: string) => {
    setActiveItemId(id);
    const item = serviceItems.find((s) => s.id === id);
    if (item?.slides[0]) setCurrentSlideId(item.slides[0].id);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background stage-wash">
      <Toolbar
        active={tab}
        onSelect={(t) => setTab((prev) => (prev === t ? null : t))}
        onPresent={() => setPresenting(true)}
        live={live}
      />
      {tab && <TabPanel tab={tab} onClose={() => setTab(null)} />}

      <div className="flex min-h-0 flex-1">
        <LeftPanel activeItemId={activeItemId} onSelectItem={selectItem} />
        <CenterPanel
          activeItemId={activeItemId}
          currentSlideId={currentSlideId}
          onSelectSlide={(id) => {
            const i = flatSlides.findIndex((s) => s.id === id);
            if (i >= 0) goTo(i);
          }}
          current={current}
          activeMediaId={activeMediaId}
          onSelectMedia={setActiveMediaId}
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
