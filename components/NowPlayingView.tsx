"use client";

import { usePlayerStore } from "@/store/playerStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  MoreHorizontal, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Shuffle, 
  Heart,
  ListMusic,
  Share2
} from "lucide-react";
import Image from "next/image";

export default function NowPlayingView() {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    next, 
    prev, 
    isNowPlayingOpen, 
    toggleNowPlaying,
    currentTime,
    duration,
    isLiked,
    toggleLike,
    isShuffle,
    toggleShuffle,
    isRepeat,
    toggleRepeat
  } = usePlayerStore();

  if (!currentTrack) return null;

  const progress = (currentTime / duration) * 100 || 0;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    (window as any).__pulsenode_seek?.(time);
  };

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <AnimatePresence>
      {isNowPlayingOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[200] bg-[#0d0b1e] flex flex-col"
        >
          {/* Background Blur */}
          <div className="absolute inset-0 z-0 opacity-40 blur-3xl scale-150">
            <Image src={currentTrack.albumArt} alt="" fill className="object-cover" />
          </div>

          <div className="relative z-10 flex flex-col h-full px-8 pt-12 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
              <button onClick={toggleNowPlaying} className="p-2 -ml-2">
                <ChevronDown className="w-8 h-8" />
              </button>
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Now Playing</p>
                <p className="text-xs font-semibold">{currentTrack.album || "PulseNode"}</p>
              </div>
              <button className="p-2 -mr-2">
                <MoreHorizontal className="w-6 h-6" />
              </button>
            </div>

            {/* Album Art */}
            <div className="flex-1 flex items-center justify-center">
              <motion.div 
                animate={{ scale: isPlaying ? 1 : 0.9, rotate: isPlaying ? 0 : -2 }}
                className="relative aspect-square w-full max-w-[340px] rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/20"
              >
                <Image src={currentTrack.albumArt} alt={currentTrack.title} fill className="object-cover" />
              </motion.div>
            </div>

            {/* Track Info */}
            <div className="mt-10 space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-2xl font-bold truncate leading-tight">{currentTrack.title}</h2>
                  <p className="text-lg text-white/60 truncate">{currentTrack.artist}</p>
                </div>
                <button 
                  onClick={() => toggleLike(currentTrack.id)}
                  className="p-2"
                >
                  <Heart className={`w-7 h-7 ${isLiked(currentTrack.id) ? "fill-pink-500 text-pink-500" : "text-white/40"}`} />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-8 space-y-2">
              <div className="relative group h-6 flex items-center">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer z-20"
                />
                <div className="w-full h-1 bg-white/10 rounded-full relative overflow-hidden">
                  <motion.div 
                    className="absolute inset-y-0 left-0 bg-violet-500" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <motion.div 
                  className="absolute w-3 h-3 bg-white rounded-full shadow-lg pointer-events-none z-10"
                  style={{ left: `calc(${progress}% - 6px)` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-white/40 font-bold tracking-wider">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-8 flex items-center justify-between">
              <button 
                onClick={toggleShuffle}
                className={`p-2 ${isShuffle ? "text-violet-400" : "text-white/40"}`}
              >
                <Shuffle className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-8">
                <button onClick={prev} className="p-2">
                  <SkipBack className="w-8 h-8 fill-current" />
                </button>
                <button 
                  onClick={togglePlay}
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-black shadow-xl shadow-white/10 active:scale-90 transition-transform"
                >
                  {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                </button>
                <button onClick={next} className="p-2">
                  <SkipForward className="w-8 h-8 fill-current" />
                </button>
              </div>

              <button 
                onClick={toggleRepeat}
                className={`p-2 ${isRepeat ? "text-violet-400" : "text-white/40"}`}
              >
                <Repeat className="w-5 h-5" />
              </button>
            </div>

            {/* Footer Actions */}
            <div className="mt-10 flex items-center justify-between text-white/40">
              <button className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold hover:text-white transition-colors">
                <Share2 className="w-4 h-4" /> Share
              </button>
              <button className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold hover:text-white transition-colors">
                <ListMusic className="w-4 h-4" /> Up Next
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
