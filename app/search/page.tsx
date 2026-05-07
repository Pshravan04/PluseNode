"use client";

import { useState, useEffect } from "react";
import { Search as SearchIcon, X, Music2, Globe, Flame, Mic2, Heart } from "lucide-react";
import { searchSongs, getTrendingSongs } from "@/lib/saavn";
import { usePlayerStore } from "@/store/playerStore";
import TrackCard from "@/components/TrackCard";
import { Track } from "@/store/types";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  { id: "hindi", name: "Hindi Hits", icon: Flame, color: "from-orange-500 to-red-500" },
  { id: "english", name: "International", icon: Globe, color: "from-blue-500 to-indigo-500" },
  { id: "punjabi", name: "Punjabi", icon: Flame, color: "from-yellow-500 to-orange-500" },
  { id: "bollywood", name: "Bollywood", icon: Music2, color: "from-pink-500 to-rose-500" },
  { id: "lofi", name: "Chill Lofi", icon: Music2, color: "from-purple-500 to-violet-500" },
  { id: "party", name: "Party Hits", icon: Flame, color: "from-green-500 to-emerald-500" },
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
    <div className="h-full overflow-y-auto px-6 pt-8 pb-24 scrollbar-hide">
      <h1 className="text-3xl font-bold mb-6">Search</h1>

      {/* Search Bar */}
      <div className="relative mb-8 group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <SearchIcon className="w-5 h-5 text-muted-foreground group-focus-within:text-violet-400 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Artists, songs, or podcasts"
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all placeholder:text-muted-foreground/50"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (activeCategory) setActiveCategory(null);
          }}
        />
        {query && (
          <button 
            onClick={() => setQuery("")}
            className="absolute inset-y-0 right-4 flex items-center"
          >
            <X className="w-5 h-5 text-muted-foreground hover:text-white" />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!query && !activeCategory ? (
          <motion.div 
            key="categories"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Sparkle className="w-4 h-4 text-violet-400" /> Browse All
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`relative h-28 rounded-2xl overflow-hidden group p-4 text-left transition-transform active:scale-95 bg-gradient-to-br ${cat.color} shadow-lg shadow-black/20`}
                >
                  <span className="font-bold text-lg relative z-10">{cat.name}</span>
                  <cat.icon className="absolute -bottom-2 -right-2 w-20 h-20 text-white/20 group-hover:scale-110 transition-transform" />
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {activeCategory ? `Trending in ${CATEGORIES.find(c => c.id === activeCategory)?.name}` : "Search Results"}
              </h2>
              {isSearching && <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />}
            </div>

            {results.length > 0 ? (
              <div className="space-y-1">
                {results.map((track, i) => (
                  <TrackCard
                    key={track.id}
                    track={track}
                    onClick={() => {
                      setQueue(results, i);
                      play(track, i);
                    }}
                  />
                ))}
              </div>
            ) : !isSearching && query && (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Music2 className="w-12 h-12 mb-4 opacity-20" />
                <p>No results found for "{query}"</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Sparkle(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
  );
}
