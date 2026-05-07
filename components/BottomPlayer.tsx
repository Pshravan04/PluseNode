"use client";

import Image from "next/image";
import { usePlayerStore } from "@/store/playerStore";
import AudioWaveform from "@/components/AudioWaveform";
import { motion } from "framer-motion";
import { useState } from "react";
import { Heart } from "lucide-react";

// SVG Icon helpers
const IconRewind = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
  </svg>
);
const IconPlay = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M8 5v14l11-7z" />
  </svg>
);
const IconPause = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);
const IconFastForward = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
  </svg>
);
const IconShuffle = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M10.59 9.17 5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
  </svg>
);
const IconVolume = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
  </svg>
);
const IconCast = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M21 3H3c-1.1 0-2 .9-2 2v3h2V5h18v14h-7v2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM1 18v3h3c0-1.66-1.34-3-3-3zm0-4v2c2.76 0 5 2.24 5 5H8c0-3.87-3.13-7-7-7zm0-4v2c4.97 0 9 4.03 9 9h2c0-6.08-4.93-11-11-11z" />
  </svg>
);
const IconDots = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

export default function BottomPlayer() {
  const { currentTrack, isPlaying, togglePlay, next, prev, isShuffle, toggleShuffle, volume, setVolume, isLiked, toggleLike, toggleNowPlaying } =
    usePlayerStore();
  const [showVolume, setShowVolume] = useState(false);

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-4 left-3 right-3 z-50 flex flex-col gap-2">
      {/* Volume slider — appears above pill on tap */}
      {showVolume && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="flex items-center gap-2 px-4 py-2 glass-pill mx-auto w-fit"
        >
          <IconVolume />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-28 accent-purple-400 cursor-pointer"
          />
        </motion.div>
      )}

      {/* Main pill player */}
      <motion.div
        className="glass-pill flex items-center gap-2 px-4 py-3 select-none"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.3 }}
      >
        {/* LEFT: Playback controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button 
            onClick={() => toggleLike(currentTrack)}
            className="p-1 transition-transform active:scale-125"
            aria-label="Like"
          >
            <Heart 
              className={`w-4 h-4 ${isLiked(currentTrack.id) ? "fill-pink-500 text-pink-500" : "text-white/40"}`} 
            />
          </button>
          <button
            onClick={prev}
            className="text-white/70 hover:text-white active:scale-90 transition-all p-1"
            aria-label="Previous"
          >
            <IconRewind />
          </button>
          <button
            onClick={togglePlay}
            className="text-white hover:scale-110 active:scale-95 transition-all p-1 bg-white/10 rounded-full w-9 h-9 flex items-center justify-center"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <IconPause /> : <IconPlay />}
          </button>
          <button
            onClick={next}
            className="text-white/70 hover:text-white active:scale-90 transition-all p-1"
            aria-label="Next"
          >
            <IconFastForward />
          </button>
        </div>

        {/* CENTER: Track info */}
        <div 
          onClick={toggleNowPlaying}
          className="flex items-center gap-2 flex-1 min-w-0 mx-1 cursor-pointer"
        >
          <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 ring-1 ring-white/20">
            <Image src={currentTrack.albumArt} alt={currentTrack.title} fill className="object-cover" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-white text-xs font-semibold truncate leading-tight">
              {currentTrack.title}
            </span>
            <span className="text-white/50 text-[10px] truncate leading-tight">
              {currentTrack.artist}
            </span>
          </div>
          <AudioWaveform />
          <button className="text-white/40 hover:text-white/70 transition-colors ml-1" aria-label="Options">
            <IconDots />
          </button>
        </div>

        {/* RIGHT: Secondary controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button className="text-white/40 hover:text-white/70 transition-colors p-1" aria-label="Cast">
            <IconCast />
          </button>
          <button
            onClick={toggleShuffle}
            className={`transition-colors p-1 ${isShuffle ? "text-purple-400" : "text-white/40 hover:text-white/70"}`}
            aria-label="Shuffle"
          >
            <IconShuffle />
          </button>
          <button
            onClick={() => setShowVolume((v) => !v)}
            className={`transition-colors p-1 ${showVolume ? "text-purple-400" : "text-white/40 hover:text-white/70"}`}
            aria-label="Volume"
          >
            <IconVolume />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
