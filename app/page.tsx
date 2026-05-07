"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CarouselView from "@/components/CarouselView";
import TrackInfo from "@/components/TrackInfo";
import { usePlayerStore } from "@/store/playerStore";
import { getRecommendations } from "@/lib/saavn";
import TrackCard from "@/components/TrackCard";
import { Track } from "@/store/types";
import { Music2, Sparkles, TrendingUp, History } from "lucide-react";

export default function Home() {
  const { currentTrack, setQueue, profile, recentlyPlayed } = usePlayerStore();
  const [sections, setSections] = useState<{ title: string; tracks: Track[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const prefs = {
        genres: profile?.favorite_genres || ["Bollywood", "Pop"],
        languages: profile?.language_preferences || ["Hindi", "English"],
        artists: profile?.favorite_artists || [],
      };
      
      const recs = await getRecommendations(prefs);
      setSections(recs);
      
      // Set initial queue from first section if queue is empty
      if (usePlayerStore.getState().queue.length === 0 && recs.length > 0) {
        setQueue(recs[0].tracks);
      }
      setLoading(false);
    }
    init();
  }, [profile, setQueue]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#0d0b1e]">
        <div className="flex flex-col items-center gap-4">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center"
          >
            <Music2 className="w-8 h-8 text-white" />
          </motion.div>
          <p className="text-violet-400 font-medium animate-pulse">Tuning your Pulse...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pb-24 scrollbar-hide">
      {/* Hero: 3D Carousel */}
      <section className="relative h-[65vh] flex flex-col pt-8 overflow-hidden">
        <div className="px-6 flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">For You</h1>
            <p className="text-xs text-muted-foreground">Based on your mood</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
            <Sparkles className="w-5 h-5 text-violet-400" />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <CarouselView />
          <TrackInfo />
        </div>
      </section>

      {/* Dynamic Sections */}
      <div className="px-6 space-y-10 mt-8">
        
        {recentlyPlayed.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-violet-400" />
              <h2 className="text-xl font-semibold">Jump Back In</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {recentlyPlayed.map((track, i) => (
                <div 
                  key={`recent-${track.id}-${i}`}
                  className="min-w-[140px] group cursor-pointer"
                  onClick={() => {
                    setQueue(recentlyPlayed, i);
                    usePlayerStore.getState().play(track, i);
                  }}
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-2 shadow-lg group-hover:scale-105 transition-transform">
                    <img src={track.albumArt} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  </div>
                  <p className="text-sm font-medium truncate">{track.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {sections.map((section, idx) => (
          <section key={section.title}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {idx === 0 ? <TrendingUp className="w-5 h-5 text-violet-400" /> : <Music2 className="w-5 h-5 text-violet-400" />}
                <h2 className="text-xl font-semibold">{section.title}</h2>
              </div>
              <button className="text-xs text-violet-400 font-medium">View All</button>
            </div>
            <div className="space-y-1">
              {section.tracks.slice(0, 5).map((track, i) => (
                <TrackCard 
                  key={track.id} 
                  track={track} 
                  onClick={() => {
                    setQueue(section.tracks, i);
                    usePlayerStore.getState().play(track, i);
                  }} 
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
