"use client";

import { useState, useEffect } from "react";
import { Search as SearchIcon, X, Music2, Globe, Flame, Mic2, Heart, ChevronRight, Sparkles } from "lucide-react";
import { searchSongs, getTrendingSongs } from "@/lib/saavn";
import { usePlayerStore } from "@/store/playerStore";
import TrackCard from "@/components/TrackCard";
import { Track } from "@/store/types";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundParticles from "@/components/BackgroundParticles";

const CATEGORIES = [
  { id: "hindi", name: "Hindi Hits", icon: Flame, color: "from-orange-500/80 to-red-600/80", glow: "shadow-orange-500/30" },
  { id: "english", name: "International", icon: Globe, color: "from-blue-500/80 to-indigo-600/80", glow: "shadow-blue-500/30" },
  { id: "punjabi", name: "Punjabi", icon: Flame, color: "from-yellow-500/80 to-orange-600/80", glow: "shadow-yellow-500/30" },
  { id: "bollywood", name: "Bollywood", icon: Music2, color: "from-pink-500/80 to-rose-600/80", glow: "shadow-pink-500/30" },
  { id: "lofi", name: "Chill Lofi", icon: Music2, color: "from-purple-500/80 to-violet-600/80", glow: "shadow-purple-500/30" },
  { id: "party", name: "Party Hits", icon: Flame, color: "from-green-500/80 to-emerald-600/80", glow: "shadow-green-500/30" },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { setQueue, play } = usePlayerStore();

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.trim()) {
        setIsSearching(true);
        const songs = await searchSongs(query);
        setResults(songs);
        setIsSearching(false);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleCategoryClick = async (catId: string) => {
    setActiveCategory(catId);
    setIsSearching(true);
    const songs = await getTrendingSongs(catId);
    setResults(songs);
    setIsSearching(false);
  };

  return (
    <div className="h-full overflow-y-auto px-6 pt-24 pb-40 scrollbar-hide relative bg-[#020108]">
      <BackgroundParticles />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-none" />
      
      <header className="mb-14 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-7xl font-black text-white font-outfit tracking-tighter mb-4 text-gradient-premium leading-none">
            Discovery
          </h1>
          <p className="text-[12px] text-white/30 uppercase tracking-[0.6em] font-black">
            EXPLORE THE PULSE UNIVERSE
          </p>
        </motion.div>
      </header>

      {/* Search Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 1 }}
        className="relative mb-20 group z-10"
      >
        <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none">
          <SearchIcon className="w-8 h-8 text-white/10 group-focus-within:text-primary transition-all duration-700 group-focus-within:scale-125" />
        </div>
        <input
          type="text"
          placeholder="Artists, songs, or podcasts..."
          className="w-full glass-thick bg-white/[0.01] border-white/5 rounded-[3.5rem] py-10 pl-24 pr-20 outline-none focus:bg-white/[0.03] focus:border-primary/40 focus:shadow-[0_0_100px_rgba(139,92,246,0.15)] transition-all placeholder:text-white/5 text-3xl font-black font-outfit tracking-tight"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (activeCategory) setActiveCategory(null);
          }}
        />
        <AnimatePresence>
          {query && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={() => setQuery("")}
              className="absolute inset-y-0 right-10 flex items-center"
            >
              <div className="w-12 h-12 rounded-[1.5rem] bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all active:scale-90 border border-white/5 group-hover:rotate-90">
                <X className="w-6 h-6 text-white/40 group-hover:text-white" />
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence mode="wait">
        {!query && !activeCategory ? (
          <motion.div 
            key="categories"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-16 relative z-10"
          >
            <div className="flex items-center gap-6">
              <div className="w-3 h-10 bg-primary rounded-full shadow-[0_0_30px_var(--color-primary-glow)]" />
              <h2 className="text-3xl font-black font-outfit uppercase tracking-tighter">Atmospheres</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-10">
              {CATEGORIES.map((cat, i) => (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08, duration: 0.8 }}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`relative h-60 rounded-[4rem] overflow-hidden group p-10 text-left transition-all active:scale-95 bg-gradient-to-br ${cat.color} shadow-[0_40px_80px_rgba(0,0,0,0.5)] ${cat.glow} border border-white/10 hover:-translate-y-4 hover:rotate-1`}
                >
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <span className="font-black text-4xl leading-none text-white tracking-tighter drop-shadow-2xl">{cat.name}</span>
                    <div className="w-16 h-16 rounded-[1.8rem] bg-white/20 flex items-center justify-center backdrop-blur-3xl border border-white/30 group-hover:bg-white/40 transition-all shadow-2xl">
                      <ChevronRight className="w-8 h-8 text-white group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  <cat.icon className="absolute -bottom-10 -right-10 w-48 h-48 text-white/10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-1000 blur-[1px] group-hover:blur-0" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0, scale: 0.98, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-12 relative z-10"
          >
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-8">
                <motion.button 
                  whileHover={{ x: -5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { setQuery(""); setActiveCategory(null); }}
                  className="w-16 h-16 rounded-[1.8rem] glass flex items-center justify-center hover:bg-white/10 transition-all border border-white/10 shadow-2xl"
                >
                  <ChevronRight className="w-8 h-8 text-white rotate-180" />
                </motion.button>
                <div>
                  <h2 className="text-4xl font-black font-outfit tracking-tighter text-gradient-premium leading-none">
                    {activeCategory ? CATEGORIES.find(c => c.id === activeCategory)?.name : "Detected Results"}
                  </h2>
                  <p className="text-[11px] text-white/30 font-black uppercase tracking-[0.4em] mt-3">FOUND IN PULSE NETWORK</p>
                </div>
              </div>
              {isSearching && (
                <div className="flex items-center gap-5 px-8 py-4 rounded-full glass border border-white/10 shadow-2xl">
                  <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">Syncing...</span>
                </div>
              )}
            </div>

            {results.length > 0 ? (
              <div className="space-y-6">
                {results.map((track, i) => (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.6 }}
                  >
                    <TrackCard
                      track={track}
                      onClick={() => {
                        setQueue(results, i);
                        play(track, i);
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            ) : !isSearching && query && (
              <div className="flex flex-col items-center justify-center py-40 glass-thick rounded-[5rem] border border-dashed border-white/10 shadow-[0_60px_120px_rgba(0,0,0,0.5)]">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="w-32 h-32 rounded-[3.5rem] bg-white/5 flex items-center justify-center mb-12 relative group overflow-hidden border border-white/10 shadow-inner"
                >
                  <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <Music2 className="w-16 h-16 text-white/10 group-hover:text-primary/40 transition-all duration-1000" />
                </motion.div>
                <h3 className="text-white/20 font-black text-3xl font-outfit tracking-tighter">Frequency Mismatch</h3>
                <p className="text-[12px] text-white/10 uppercase tracking-[0.4em] font-black mt-4">NO TRACKS DETECTED IN THIS SECTOR</p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuery("")}
                  className="mt-14 bg-white text-black px-14 py-6 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.5em] shadow-[0_30px_60px_rgba(255,255,255,0.1)] transition-all"
                >
                  Reset Scanner
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
