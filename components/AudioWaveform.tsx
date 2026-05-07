"use client";

import { usePlayerStore } from "@/store/playerStore";

export default function AudioWaveform() {
  const isPlaying = usePlayerStore((s) => s.isPlaying);

  return (
    <div className="flex items-end gap-[2px] h-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`waveform-bar rounded-full ${isPlaying ? "animating" : ""}`}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}
