"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Play, 
  Plus, 
  Users, 
  MoreVertical,
  Music2,
  UserPlus,
  Trash2,
  Check
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { usePlayerStore } from "@/store/playerStore";
import { Playlist, Track } from "@/store/types";
import { addCollaborator, removeTrackFromPlaylist } from "@/lib/playlists";
import TrackCard from "@/components/TrackCard";

export default function PlaylistPage() {
  const { id } = useParams();
  const router = useRouter();
  const { profile, setQueue, play } = usePlayerStore();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteUsername, setInviteUsername] = useState("");
  const [inviteStatus, setInviteStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: pData } = await supabase
        .from("playlists")
        .select("*")
        .eq("id", id)
        .single();
      
      if (pData) {
        setPlaylist(pData);
        const { data: tData } = await supabase
          .from("playlist_tracks")
          .select("track_data")
          .eq("playlist_id", id)
          .order("created_at", { ascending: true });
        
        if (tData) {
          setTracks(tData.map(d => d.track_data));
        }
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      setQueue(tracks, 0);
      play(tracks[0], 0);
    }
  };

  const handleInvite = async () => {
    if (!inviteUsername.trim() || !id) return;
    const res = await addCollaborator(id as string, inviteUsername);
    setInviteStatus({ type: res.success ? 'success' : 'error', msg: res.message });
    if (res.success) {
      setTimeout(() => {
        setShowInviteModal(false);
        setInviteStatus(null);
        setInviteUsername("");
      }, 1500);
    }
  };

  if (loading) return (
    <div className="h-full flex items-center justify-center relative overflow-hidden">
      <div className="mesh-gradient opacity-20" />
      <div className="w-16 h-16 border-[6px] border-primary/20 border-t-primary rounded-[1.5rem] animate-spin shadow-[0_0_40px_var(--color-primary-glow)]" />
    </div>
  );

  if (!playlist) return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      <div className="mesh-gradient opacity-20" />
      <div className="w-24 h-24 rounded-[2.5rem] glass-panel flex items-center justify-center mb-8 border border-white/5 shadow-2xl">
        <Music2 className="w-12 h-12 text-white/10" />
      </div>
      <h1 className="text-4xl font-black font-outfit tracking-tighter text-white mb-8">Atmosphere Missing</h1>
      <button 
        onClick={() => router.back()} 
        className="px-10 py-5 bg-white/5 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] text-white/40 hover:text-white transition-colors"
      >
        Egress Session
      </button>
    </div>
  );

  const isOwner = profile?.id === playlist.owner_id;

  return (
    <div className="h-full overflow-y-auto pb-44 scrollbar-hide relative bg-black">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="mesh-gradient opacity-40 scale-125" />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[120px]" />
      </div>

      {/* Cinematic Header */}
      <div className="relative pt-24 pb-16 px-8 z-10 flex flex-col items-center">
        <div className="absolute top-0 inset-x-0 h-[30rem] bg-gradient-to-b from-primary/20 via-transparent to-transparent pointer-events-none" />
        
        {/* Navigation Layer */}
        <div className="absolute top-12 left-8 right-8 flex justify-between z-20">
          <button 
            onClick={() => router.back()} 
            className="w-14 h-14 glass-panel flex items-center justify-center rounded-2xl hover:bg-white/10 transition-all active:scale-90 border border-white/10 shadow-2xl"
          >
            <ChevronLeft className="w-7 h-7 text-white" strokeWidth={3} />
          </button>
          <button className="w-14 h-14 glass-panel flex items-center justify-center rounded-2xl hover:bg-white/10 transition-all active:scale-90 border border-white/10 shadow-2xl">
            <MoreVertical className="w-7 h-7 text-white/40" />
          </button>
        </div>

        {/* Playlist Identity Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col items-center w-full max-w-2xl"
        >
          <div className="relative group mb-12">
            <div className="absolute inset-0 bg-primary/40 blur-[80px] opacity-0 group-hover:opacity-100 transition-all duration-1000 scale-150" />
            <div className="w-56 h-56 glass-panel p-2.5 rounded-[4rem] relative border border-white/20 shadow-[0_50px_100px_rgba(0,0,0,0.6)] overflow-hidden group-hover:scale-105 transition-all duration-700">
              <div className="w-full h-full rounded-[3.5rem] overflow-hidden relative bg-white/5 flex items-center justify-center">
                {playlist.cover_url ? (
                  <img src={playlist.cover_url} className="w-full h-full object-cover transform scale-110 group-hover:scale-100 transition-transform duration-1000" alt="" />
                ) : (
                  <Music2 className="w-20 h-20 text-primary/30" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-[11px] uppercase tracking-[0.5em] font-black text-primary drop-shadow-[0_0_10px_var(--color-primary-glow)]"
            >
              COLLECTION SESSION
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-6xl font-black font-outfit tracking-tighter text-white leading-tight drop-shadow-2xl"
            >
              {playlist.name}
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-4 text-white/40"
            >
              <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                {playlist.is_collaborative && <Users className="w-3.5 h-3.5 text-accent" />}
                <span>{tracks.length} Sonic Files</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
              <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                <span>By {playlist.owner_id === profile?.id ? "Identity Core" : "External Proxy"}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="px-8 space-y-12 relative z-10">
        {/* Kinetic Actions */}
        <div className="flex items-center gap-6 max-w-2xl mx-auto">
          <motion.button 
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePlayAll}
            className="flex-[2] h-20 bg-primary rounded-[2rem] flex items-center justify-center gap-4 font-black text-[13px] uppercase tracking-[0.3em] shadow-[0_30px_60px_var(--color-primary-glow)] active:scale-95 transition-all text-white border border-white/20 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Play className="w-6 h-6 fill-current relative z-10" />
            <span className="relative z-10">Initialize Audio</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowInviteModal(true)}
            className="w-20 h-20 glass-panel bg-white/[0.01] border border-white/10 rounded-[2rem] flex items-center justify-center text-primary active:scale-95 transition-all shadow-2xl group"
          >
            <UserPlus className="w-8 h-8 group-hover:scale-110 transition-transform" />
          </motion.button>
        </div>

        {/* Neural Track List */}
        <div className="max-w-3xl mx-auto">
          {tracks.length > 0 ? (
            <div className="glass-panel bg-white/[0.01] border border-white/5 rounded-[4rem] p-4 shadow-[0_40px_80px_rgba(0,0,0,0.3)]">
              {tracks.map((track, i) => (
                <TrackCard 
                  key={track.id} 
                  track={track} 
                  index={i} 
                  allTracks={tracks}
                />
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 flex flex-col items-center justify-center text-center glass-panel rounded-[4rem] border border-dashed border-white/5"
            >
              <div className="w-28 h-28 rounded-[3.5rem] bg-white/5 flex items-center justify-center mb-8 group overflow-hidden relative">
                <div className="absolute inset-0 bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Music2 className="w-14 h-14 text-white/5 group-hover:text-primary/40 transition-colors" />
              </div>
              <p className="text-white/20 font-black text-2xl font-outfit tracking-tighter mb-10">Playlist is silent</p>
              <Link 
                href="/search" 
                className="bg-white px-12 py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:scale-105 transition-all active:scale-95 text-black"
              >
                Injest Media
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      {/* Access Grant Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 backdrop-blur-[100px] bg-black/60">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="w-full max-w-lg glass-panel bg-white/[0.01] rounded-[4rem] p-12 shadow-2xl border border-white/10 relative overflow-hidden"
            >
              <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/10 blur-[120px] animate-pulse" />
              
              <div className="w-24 h-24 rounded-[3rem] bg-primary/20 flex items-center justify-center mb-10 mx-auto border border-primary/20 shadow-inner group">
                <UserPlus className="w-12 h-12 text-primary animate-float" />
              </div>
              
              <h2 className="text-4xl font-black mb-3 text-center font-outfit tracking-tighter text-white">Grant Access</h2>
              <p className="text-white/20 text-[10px] text-center mb-12 uppercase tracking-[0.4em] font-black">INVITE CORE COLLABORATORS</p>
              
              <div className="relative group mb-12">
                <input
                  autoFocus
                  type="text"
                  placeholder="Identity tag..."
                  className="w-full glass bg-white/[0.01] border border-white/5 rounded-3xl py-8 px-6 outline-none focus:border-primary/40 focus:bg-white/[0.03] transition-all font-black text-center text-3xl tracking-tighter placeholder:text-white/5 text-white"
                  value={inviteUsername}
                  onChange={e => setInviteUsername(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleInvite()}
                />
                <AnimatePresence>
                  {inviteStatus && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`absolute -bottom-10 left-0 right-0 text-center text-[10px] font-black uppercase tracking-widest ${inviteStatus.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}
                    >
                      {inviteStatus.msg}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex gap-5">
                <button 
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] bg-white/5 hover:bg-white/10 transition-all text-white/30 hover:text-white"
                >
                  Discard
                </button>
                <button 
                  onClick={handleInvite}
                  disabled={!inviteUsername.trim()}
                  className="flex-[1.5] py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] bg-primary shadow-[0_20px_40px_var(--color-primary-glow)] disabled:opacity-10 transition-all hover:scale-[1.03] active:scale-[0.97] text-white flex items-center justify-center gap-3"
                >
                  {inviteStatus?.type === 'success' ? (
                    <>
                      <Check className="w-5 h-5" strokeWidth={4} />
                      GRANTED
                    </>
                  ) : (
                    "Authorize"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

