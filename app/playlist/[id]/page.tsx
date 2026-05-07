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
    <div className="h-full flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
    </div>
  );

  if (!playlist) return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
      <Music2 className="w-16 h-16 text-white/10 mb-4" />
      <h1 className="text-xl font-bold">Playlist not found</h1>
      <button onClick={() => router.back()} className="mt-4 text-violet-400 font-bold uppercase tracking-widest text-xs">Go Back</button>
    </div>
  );

  const isOwner = profile?.id === playlist.owner_id;

  return (
    <div className="h-full overflow-y-auto pb-44 scrollbar-hide">
      {/* Header */}
      <div className="relative h-80 flex items-end px-6 pb-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-600/30 to-[#0d0b1e] z-0" />
        <div className="absolute top-8 left-6 right-6 flex justify-between z-20">
          <button onClick={() => router.back()} className="p-2 bg-black/20 backdrop-blur-md rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button className="p-2 bg-black/20 backdrop-blur-md rounded-full">
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>

        <div className="relative z-10 flex items-center gap-6 w-full">
          <div className="w-32 h-32 bg-violet-500/20 rounded-3xl shadow-2xl overflow-hidden shrink-0 flex items-center justify-center ring-1 ring-white/10">
            {playlist.cover_url ? (
              <img src={playlist.cover_url} className="w-full h-full object-cover" alt="" />
            ) : (
              <Music2 className="w-12 h-12 text-violet-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/60 mb-1">Playlist</p>
            <h1 className="text-3xl font-bold truncate mb-2">{playlist.name}</h1>
            <div className="flex items-center gap-2 text-sm font-medium text-white/40">
              {playlist.is_collaborative && <Users className="w-4 h-4 text-emerald-400" />}
              <span>{tracks.length} tracks</span>
              <span>•</span>
              <span className="text-white/60">by {playlist.owner_id === profile?.id ? "You" : "Other"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-8">
        {/* Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={handlePlayAll}
            className="flex-1 h-14 bg-violet-600 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg shadow-violet-600/20 active:scale-95 transition-transform"
          >
            <Play className="w-5 h-5 fill-current" /> Play All
          </button>
          <button 
            onClick={() => setShowInviteModal(true)}
            className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-violet-400 active:scale-95 transition-transform"
          >
            <UserPlus className="w-6 h-6" />
          </button>
        </div>

        {/* Tracks List */}
        <div className="space-y-4">
          {tracks.length > 0 ? (
            <div className="bg-white/5 border border-white/5 rounded-[32px] p-2">
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
            <div className="py-20 flex flex-col items-center justify-center text-muted-foreground">
              <Music2 className="w-12 h-12 mb-4 opacity-10" />
              <p className="text-sm font-medium">No songs added yet</p>
              <Link href="/search" className="mt-4 text-xs text-violet-400 font-bold uppercase tracking-widest">
                Browse Music
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 backdrop-blur-md bg-black/60">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-[#1a1a2e] border border-white/10 rounded-[40px] p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-2 text-center">Collab with friends</h2>
              <p className="text-sm text-center text-muted-foreground mb-6">Enter a PulseNode username to invite them to this playlist.</p>
              
              <div className="relative">
                <input
                  autoFocus
                  type="text"
                  placeholder="Username"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-violet-500 mb-6"
                  value={inviteUsername}
                  onChange={e => setInviteUsername(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleInvite()}
                />
                {inviteStatus && (
                  <motion.p 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-xs font-bold mb-4 text-center ${inviteStatus.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}
                  >
                    {inviteStatus.msg}
                  </motion.p>
                )}
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 py-4 rounded-2xl font-semibold bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleInvite}
                  disabled={!inviteUsername.trim()}
                  className="flex-1 py-4 rounded-2xl font-semibold bg-violet-600 shadow-lg shadow-violet-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {inviteStatus?.type === 'success' ? <Check className="w-5 h-5" /> : "Invite"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

import Link from "next/link";
