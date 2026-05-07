"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePlayerStore } from "@/store/playerStore";
import { Track } from "@/store/types";

interface CarouselViewProps {
  tracks: Track[];
}

export default function CarouselView({ tracks }: CarouselViewProps) {
  const { activeIndex, setActiveIndex, play, isPlaying } = usePlayerStore();
  const [dragStart, setDragStart] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const goTo = (index: number) => {
    const clamped = Math.max(0, Math.min(tracks.length - 1, index));
    setActiveIndex(clamped);
    play(tracks[clamped], clamped);
  };

  const handleDragStart = (clientX: number) => {
    setDragStart(clientX);
    setIsDragging(true);
  };

  const handleDragEnd = (clientX: number) => {
    if (!isDragging) return;
    const delta = dragStart - clientX;
    if (Math.abs(delta) > 50) {
      if (delta > 0) goTo(activeIndex + 1);
      else goTo(activeIndex - 1);
    }
    setIsDragging(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(activeIndex + 1);
      if (e.key === "ArrowLeft") goTo(activeIndex - 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const getCardStyle = (index: number) => {
    const offset = index - activeIndex;
    const absOffset = Math.abs(offset);

    if (absOffset > 2) return null; // Don't render far cards

    const scale = offset === 0 ? 1 : absOffset === 1 ? 0.78 : 0.60;
    const zIndex = offset === 0 ? 10 : absOffset === 1 ? 5 : 1;
    const opacity = offset === 0 ? 1 : absOffset === 1 ? 0.55 : 0.25;
    const x = offset * 185;
    const rotateY = offset * -22;
    const translateZ = offset === 0 ? 0 : absOffset === 1 ? -80 : -160;

    return { scale, zIndex, opacity, x, rotateY, translateZ };
  };

  return (
    <div
      className="relative flex items-center justify-center w-full select-none"
      style={{ height: "320px", perspective: "900px" }}
      onMouseDown={(e) => handleDragStart(e.clientX)}
      onMouseUp={(e) => handleDragEnd(e.clientX)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
      onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
    >
      <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
        {tracks.map((track, index) => {
          const style = getCardStyle(index);
          if (!style) return null;
          const isActive = index === activeIndex;

          return (
            <motion.div
              key={track.id}
              className="absolute top-1/2 left-1/2 cursor-pointer"
              style={{
                width: 220,
                height: 220,
                marginLeft: -110,
                marginTop: -110,
                zIndex: style.zIndex,
                transformStyle: "preserve-3d",
              }}
              animate={{
                x: style.x,
                scale: style.scale,
                opacity: style.opacity,
                rotateY: style.rotateY,
                z: style.translateZ,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={() => !isDragging && goTo(index)}
            >
              <div
                className={`relative w-full h-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
                  isActive
                    ? "ring-2 ring-white/30 shadow-purple-500/40"
                    : ""
                }`}
                style={{
                  boxShadow: isActive
                    ? "0 20px 60px rgba(139, 92, 246, 0.5), 0 0 0 1px rgba(255,255,255,0.1)"
                    : "0 8px 24px rgba(0,0,0,0.5)",
                }}
              >
                <Image
                  src={track.albumArt}
                  alt={track.title}
                  fill
                  sizes="220px"
                  className="object-cover"
                  priority={isActive}
                  loading={isActive ? "eager" : "lazy"}
                  draggable={false}
                />
                {/* Vinyl reflection shimmer on active */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
                )}
              </div>
              {/* Playing indicator */}
              {isActive && isPlaying && (
                <AnimatePresence>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-1 items-end"
                  >
                    {[1, 2, 3].map((b) => (
                      <div key={b} className="waveform-bar animating rounded-full" style={{ animationDelay: `${b * 0.12}s` }} />
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-0 flex gap-2 justify-center">
        {tracks.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === activeIndex ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
