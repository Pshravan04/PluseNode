"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Music2, 
  Users, 
  Heart, 
  History, 
  ChevronRight,
  Play,
  MoreVertical,
  Sparkles,
  Library as LibraryIcon
} from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import { getUserPlaylists, createPlaylist } from "@/lib/playlists";
import { Playlist, Track } from "@/store/types";
import Link from "next/link";

export default function LibraryPage() {
  const { profile, likedSongs } = usePlayerStore();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  useEffect(() => {
    async function load() {
      if (profile) {
        const data = await getUserPlaylists(profile.id);
        setPlaylists(data);
      }
      setLoading(false);
    }
    load();
  }, [profile]);

  const handleCreate = async () => {
    if (!newPlaylistName.trim() || !profile) return;
    const playlist = await createPlaylist(newPlaylistName, profile.id);
    if (playlist) {
      setPlaylists([playlist, ...playlists]);
      setNewPlaylistName("");
      setShowCreateModal(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto px-6 pt-16 pb-32 scrollbar-hide relative">
      <div className="mesh-gradient opacity-30" />
      
      <header className="flex items-center justify-between mb-16 relative z-10">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-6xl font-black text-white font-outfit tracking-tighter mb-2"
          >
            Library
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[10px] text-white/30 uppercase tracking-[0.5em] font-black"
          >
            YOUR SONIC VAULT
          </motion.p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowCreateModal(true)}
          className="w-16 h-16 rounded-[1.8rem] bg-primary flex items-center justify-center shadow-[0_20px_40px_var(--color-primary-glow)] active:scale-90 transition-all border border-white/20 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Plus className="w-8 h-8 text-white relative z-10" />
        </motion.button>
      </header>

      <div className="space-y-16 relative z-10">
        {/* Liked Songs Hero Tile */}
        <Link href="/library/liked" className="block group">
          <motion.div 
            whileHover={{ y: -10, scale: 1.01 }}
            className="relative overflow-hidden p-10 bg-gradient-to-br from-primary via-primary-deep to-black rounded-[4rem] shadow-[0_40px_80px_rgba(0,0,0,0.4)] border border-white/10"
          >
            {/* Animated Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] -mr-32 -mt-32 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 blur-[80px] -ml-24 -mb-24 animate-pulse delay-700" />
            
            <div className="relative z-10 flex items-center gap-10">
              <div className="w-24 h-24 bg-white/10 rounded-[2.5rem] flex items-center justify-center backdrop-blur-3xl border border-white/10 shadow-2xl group-hover:scale-110 transition-all duration-700 group-hover:rotate-6">
                <Heart className="w-12 h-12 text-white fill-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
              </div>
              <div className="flex-1">
                <h2 className="font-black text-4xl tracking-tighter text-white font-outfit">Liked Songs</h2>
                <div className="flex items-center gap-4 mt-3">
                  <span className="px-4 py-1.5 rounded-full bg-black/40 text-[10px] font-black uppercase tracking-widest text-white/60 border border-white/5">
                    {likedSongs.length} RECORDS IN VAULT
                  </span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                <Play className="w-8 h-8 fill-black translate-x-1" />
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Playlists Section */}
        <div className="space-y-10">
          <div className="flex items-center gap-4">
            <div className="w-2 h-8 bg-primary rounded-full shadow-[0_0_20px_var(--color-primary-glow)]" />
            <h2 className="text-2xl font-black font-outfit uppercase tracking-tighter">Collections</h2>
          </div>

          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-28 glass-panel rounded-[3rem] animate-pulse" />
              ))}
            </div>
          ) : playlists.length > 0 ? (
            <div className="space-y-5">
              {playlists.map((playlist, i) => (
                <motion.div
                  key={playlist.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link 
                    href={`/playlist/${playlist.id}`}
                    className="flex items-center gap-6 p-5 glass-panel bg-white/[0.01] rounded-[3rem] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all active:scale-[0.98] group"
                  >
                    <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center overflow-hidden shrink-0 border border-white/5 transition-all group-hover:scale-105 group-hover:-rotate-3 shadow-2xl">
                      {playlist.cover_url ? (
                        <img src={playlist.cover_url} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <Music2 className="w-10 h-10 text-primary/40" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black truncate text-2xl font-outfit tracking-tighter leading-none mb-2 text-white/90 group-hover:text-white transition-colors">{playlist.name}</h3>
                      <div className="flex items-center gap-3">
                        <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] flex items-center gap-2 group-hover:text-white/40 transition-colors">
                          {playlist.is_collaborative ? (
                            <>
                              <Users className="w-3.5 h-3.5 text-accent" />
                              COLLAB SESSION
                            </>
                          ) : (
                            <>
                              <LibraryIcon className="w-3.5 h-3.5 text-primary" />
                              PRIVATE MIX
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:shadow-[0_0_30px_var(--color-primary-glow)] transition-all border border-transparent">
                      <ChevronRight className="w-7 h-7 text-white/10 group-hover:text-white" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 flex flex-col items-center justify-center text-center glass-panel rounded-[4rem] border border-dashed border-white/5"
            >
              <div className="w-28 h-28 rounded-[3rem] bg-white/5 flex items-center justify-center mb-10 group overflow-hidden relative border border-white/5">
                <div className="absolute inset-0 bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Plus className="w-14 h-14 text-white/10 group-hover:text-primary transition-all duration-700 group-hover:rotate-180" />
              </div>
              <p className="text-white/20 font-black text-2xl font-outfit tracking-tighter mb-10">Vault is empty</p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-white px-12 py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(255,255,255,0.15)] hover:scale-105 transition-all active:scale-95 text-black"
              >
                Create Mix
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 backdrop-blur-[100px] bg-black/60">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="w-full max-w-lg glass-panel bg-white/[0.01] rounded-[4rem] p-12 shadow-2xl border border-white/10 relative overflow-hidden"
            >
              <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/10 blur-[120px] animate-pulse" />
              
              <div className="w-24 h-24 rounded-[3rem] bg-primary/20 flex items-center justify-center mb-10 mx-auto border border-primary/20 shadow-inner group">
                <Music2 className="w-12 h-12 text-primary animate-float" />
              </div>
              <h2 className="text-4xl font-black mb-3 text-center font-outfit tracking-tighter">New Collection</h2>
              <p className="text-white/20 text-[10px] text-center mb-12 uppercase tracking-[0.4em] font-black">DEFINE YOUR SONIC SIGNATURE</p>
              
              <div className="relative group mb-12">
                <input
                  autoFocus
                  type="text"
                  placeholder="Atmosphere name..."
                  className="w-full glass bg-white/[0.01] border border-white/5 rounded-3xl py-8 px-6 outline-none focus:border-primary/40 focus:bg-white/[0.03] transition-all font-black text-center text-3xl tracking-tighter placeholder:text-white/5"
                  value={newPlaylistName}
                  onChange={e => setNewPlaylistName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleCreate()}
                />
              </div>
              
              <div className="flex gap-5">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] bg-white/5 hover:bg-white/10 transition-all text-white/30 hover:text-white"
                >
                  Discard
                </button>
                <button 
                  onClick={handleCreate}
                  disabled={!newPlaylistName.trim()}
                  className="flex-[1.5] py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] bg-primary shadow-[0_20px_40px_var(--color-primary-glow)] disabled:opacity-10 transition-all hover:scale-[1.03] active:scale-[0.97] text-white"
                >
                  Initialize
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
