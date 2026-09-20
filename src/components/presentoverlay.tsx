import { useEffect } from "react";
import type { FlatSlide } from "@/lib/service-data";
import { SlideView } from "./SlideView";

type Props = {
  slide: FlatSlide | undefined;
  index: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
};

export function PresentOverlay({ slide, index, total, onNext, onPrev, onExit }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        onNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrev();
      } else if (e.key === "Escape") {
        onExit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onNext, onPrev, onExit]);

  return (
    <div className="fixed inset-0 z-50 bg-black" onClick={onNext}>
      <SlideView slide={slide} scale="full" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between px-6 py-4 text-xs text-white/40">
        <span>
          {index + 1} / {total}
        </span>
        <span>← → to navigate · Esc to exit</span>
      </div>
    </div>
  );
}
