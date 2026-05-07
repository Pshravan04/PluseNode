"use client";

import Image from "next/image";
import { usePlayerStore } from "@/store/playerStore";
import { Track } from "@/store/types";

interface TrackCardProps {
  track: Track;
  index?: number;
  allTracks?: Track[];
  compact?: boolean;
  onClick?: () => void;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function TrackCard({ track, index, allTracks, compact = false, onClick }: TrackCardProps) {
  const { currentTrack, isPlaying, play, setQueue, togglePlay } = usePlayerStore();
  const isActive = currentTrack?.id === track.id;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (allTracks && index !== undefined) {
      if (isActive) {
        togglePlay();
      } else {
        setQueue(allTracks, index);
        play(track, index);
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 select-none group ${
        isActive
          ? "bg-white/10 ring-1 ring-purple-400/40"
          : "hover:bg-white/5 active:bg-white/10"
      }`}
    >
      <div className="relative shrink-0">
        <div className={`${compact ? "w-10 h-10" : "w-14 h-14"} rounded-lg overflow-hidden relative ring-1 ring-white/10`}>
          <Image src={track.albumArt} alt={track.title} fill className="object-cover" />
        </div>
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
            {isPlaying ? (
              <div className="flex gap-[2px] items-end">
                {[1, 2, 3].map((b) => (
                  <div key={b} className="waveform-bar animating rounded-full" style={{ animationDelay: `${b * 0.12}s` }} />
                ))}
              </div>
            ) : (
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`font-semibold truncate ${isActive ? "text-purple-300" : "text-white"} ${compact ? "text-sm" : "text-base"}`}>
          {track.title}
        </p>
        <p className="text-white/50 text-xs truncate">{track.artist}</p>
        {!compact && <p className="text-white/30 text-xs mt-0.5">{track.genre}</p>}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-white/30 text-xs">{formatDuration(track.duration)}</span>
      </div>
    </div>
  );
}
