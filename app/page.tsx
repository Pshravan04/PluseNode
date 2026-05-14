"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CarouselView from "@/components/CarouselView";
import TrackInfo from "@/components/TrackInfo";
import { usePlayerStore } from "@/store/playerStore";
import { getRecommendations } from "@/lib/saavn";
import TrackCard from "@/components/TrackCard";
import { Track } from "@/store/types";
import { Music2, Sparkles, TrendingUp, History, Play, Heart, Bell } from "lucide-react";

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
      
      if (usePlayerStore.getState().queue.length === 0 && recs.length > 0) {
        setQueue(recs[0].tracks);
      }
      setLoading(false);
    }
    init();
  }, [profile, setQueue]);

  if (loading) {
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-background relative">
        <div className="flex flex-col items-center gap-6">
          <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-accent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pb-48 scrollbar-hide relative bg-background">
      
      {/* Minimalist Top Navigation */}
      <header className="px-6 md:px-12 pt-12 pb-6 flex items-center justify-between sticky top-0 z-[60] glass-header transition-all">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 shrink-0">
            <img src={profile?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=pulse"} className="w-full h-full object-cover" alt="Profile" />
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-muted font-medium uppercase tracking-widest">Good Evening</p>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">{profile?.display_name?.split(' ')[0] || "Explorer"}</h1>
          </div>
        </motion.div>
        
        <div className="flex gap-2">
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/5 text-muted hover:text-foreground interactive-element"
          >
            <Bell className="w-5 h-5" />
          </motion.button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 px-6 md:px-12">
        
        {/* Hero Section */}
        <section className="pt-10 mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-3">
              Discovery
            </h2>
            <p className="text-muted text-lg max-w-xl">Curated selections tailored to your sophisticated acoustic profile.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-10"
          >
            <div className="relative -mx-6 md:mx-0 px-6 md:px-0">
              <CarouselView tracks={sections[0]?.tracks || []} />
            </div>
            
            <div className="glass-panel p-6 md:p-8 mt-4 overflow-hidden">
               <TrackInfo />
            </div>
          </motion.div>
        </section>

        {/* Dynamic Horizontal Sections */}
        <div className="space-y-32">
          
          {/* Recently Played with Cinematic Cards */}
          {recentlyPlayed.length > 0 && (
            <section>
              <div className="flex items-center gap-6 mb-12">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <History className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-4xl font-black tracking-tighter font-premium">Resuming Session</h2>
                  <p className="text-[10px] text-white/20 uppercase tracking-[0.5em] font-black mt-1">Pick up where you left off</p>
                </div>
              </div>
              
              <div className="flex gap-10 overflow-x-auto pb-12 scrollbar-hide mask-fade-right">
                {recentlyPlayed.map((track, i) => (
                  <motion.div 
                    key={`recent-${track.id}-${i}`}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -15 }}
                    className="min-w-[220px] group cursor-pointer"
                    onClick={() => {
                      setQueue(recentlyPlayed, i);
                      usePlayerStore.getState().play(track, i);
                    }}
                  >
                    <div className="relative aspect-square rounded-[3.5rem] overflow-hidden mb-6 glass-panel p-2 transition-all group-hover:shadow-[0_40px_80px_rgba(124,58,237,0.3)] border-white/10">
                      <img src={track.albumArt} className="w-full h-full object-cover rounded-[3rem] group-hover:scale-110 transition-transform duration-1000" alt="" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-md">
                        <motion.div 
                          whileHover={{ scale: 1.1 }}
                          className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-2xl"
                        >
                          <Play className="w-8 h-8 text-black fill-current ml-1" />
                        </motion.div>
                      </div>
                    </div>
                    <div className="px-4">
                      <p className="text-xl font-black truncate text-white tracking-tighter group-hover:text-primary transition-colors">{track.title}</p>
                      <p className="text-[10px] text-white/30 truncate mt-2 uppercase font-black tracking-[0.4em]">{track.artist}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Vibe Curations with Staggered Lists */}
          {sections.map((section, idx) => (
            <section key={section.title} className="relative">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${idx % 2 === 0 ? 'bg-secondary/10 border-secondary/20' : 'bg-accent/10 border-accent/20'}`}>
                    {idx % 2 === 0 ? <TrendingUp className="w-7 h-7 text-secondary" /> : <Music2 className="w-7 h-7 text-accent" />}
                  </div>
                  <div>
                    <h2 className="text-4xl font-black tracking-tighter font-premium">{section.title}</h2>
                    <p className="text-[10px] text-white/20 uppercase tracking-[0.5em] font-black mt-1">Sonic Curation</p>
                  </div>
                </div>
                <button className="text-[10px] text-white/30 font-black uppercase tracking-[0.4em] px-8 py-4 rounded-full glass hover:bg-white/10 transition-all border-white/10">
                  Expand
                </button>
              </div>
              
              <div className="grid gap-6">
                {section.tracks.slice(0, 5).map((track, i) => (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                  >
                    <TrackCard 
                      track={track} 
                      onClick={() => {
                        setQueue(section.tracks, i);
                        usePlayerStore.getState().play(track, i);
                      }} 
                    />
                  </motion.div>
                ))}
              </div>
            </section>
          ))}

          {/* Premium High-Impact Section */}
          <section className="py-24">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="glass-panel rounded-[5rem] p-16 relative overflow-hidden group border-white/20 shadow-[0_80px_150px_rgba(0,0,0,0.9)]"
            >
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 blur-[150px] -mr-80 -mt-80 group-hover:bg-primary/30 transition-all duration-1000" />
              <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/15 blur-[150px] -ml-80 -mb-80 group-hover:bg-secondary/25 transition-all duration-1000" />
              
              <div className="relative z-10">
                <div className="w-20 h-20 glass-thick rounded-3xl flex items-center justify-center mb-12 border-white/20 shadow-2xl">
                  <Sparkles className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-8xl font-black mb-8 font-premium leading-[0.8] tracking-[-0.08em]">Master Your <br /><span className="text-gradient">Listening Reality.</span></h3>
                <p className="text-white/40 text-3xl mb-16 max-w-xl leading-tight font-medium tracking-tight">Unlock hyper-personalized AI mixes tailored to your unique biometric resonance.</p>
                <div className="flex gap-8">
                  <button className="btn-premium px-12 py-6 text-2xl h-auto">
                    Activate Pulse+
                  </button>
                  <button className="glass-thick px-12 py-6 rounded-2xl font-black text-2xl hover:bg-white/10 transition-all border-white/10">
                    Explore Details
                  </button>
                </div>
              </div>
            </motion.div>
          </section>
        </div>
      </div>
    </div>
  );
}

