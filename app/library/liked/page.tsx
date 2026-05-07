"use client";

import { usePlayerStore } from "@/store/playerStore";
import { motion } from "framer-motion";
import { ChevronLeft, Play, Heart, Music2, Shuffle } from "lucide-react";
import { useRouter } from "next/navigation";
import TrackCard from "@/components/TrackCard";

export default function LikedSongsPage() {
  const router = useRouter();
  const { likedSongs, setQueue, play } = usePlayerStore();

  const handlePlayAll = () => {
    if (likedSongs.length > 0) {
      setQueue(likedSongs, 0);
      play(likedSongs[0], 0);
    }
  };

  const handleShuffle = () => {
    if (likedSongs.length > 0) {
      const shuffled = [...likedSongs].sort(() => Math.random() - 0.5);
      setQueue(shuffled, 0);
      play(shuffled[0], 0);
    }
  };

  return (
    <div className="h-full overflow-y-auto pb-44 scrollbar-hide">
      {/* Header */}
      <div className="relative h-80 flex items-end px-6 pb-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-600/30 to-[#0d0b1e] z-0" />
        <div className="absolute top-8 left-6 z-20">
          <button onClick={() => router.back()} className="p-2 bg-black/20 backdrop-blur-md rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="relative z-10 flex items-center gap-6 w-full">
          <div className="w-32 h-32 bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl shadow-2xl flex items-center justify-center ring-1 ring-white/10 shrink-0">
            <Heart className="w-16 h-16 text-white fill-white" />
          </div>
          <div className="flex-1 min-w-0 text-white">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/60 mb-1">Playlist</p>
            <h1 className="text-4xl font-bold mb-2">Liked Songs</h1>
            <p className="text-sm font-medium text-white/40">{likedSongs.length} songs</p>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-8 mt-6">
        {/* Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={handlePlayAll}
            disabled={likedSongs.length === 0}
            className="flex-1 h-14 bg-white text-black rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-white/10 active:scale-95 transition-transform disabled:opacity-50"
          >
            <Play className="w-5 h-5 fill-current" /> Play
          </button>
          <button 
            onClick={handleShuffle}
            disabled={likedSongs.length === 0}
            className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50"
          >
            <Shuffle className="w-6 h-6" />
          </button>
        </div>

        {/* Tracks List */}
        <div className="space-y-4">
          {likedSongs.length > 0 ? (
            <div className="bg-white/5 border border-white/5 rounded-[32px] p-2">
              {likedSongs.map((track, i) => (
                <TrackCard 
                  key={track.id} 
                  track={track} 
                  index={i} 
                  allTracks={likedSongs}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-muted-foreground">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 opacity-20" />
              </div>
              <p className="text-sm font-medium">Your liked songs will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
