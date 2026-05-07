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
  MoreVertical
} from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import { getUserPlaylists, createPlaylist } from "@/lib/playlists";
import { Playlist, Track } from "@/store/types";
import Link from "next/link";
import Image from "next/image";

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
    <div className="h-full overflow-y-auto px-6 pt-8 pb-32 scrollbar-hide">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Library</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-600/20 active:scale-90 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Liked Songs Tile */}
        <Link href="/library/liked" className="block group">
          <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl shadow-lg shadow-violet-900/20 group-active:scale-[0.98] transition-transform">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <Heart className="w-7 h-7 text-white fill-white" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-lg">Liked Songs</h2>
              <p className="text-white/60 text-sm font-medium">{likedSongs.length} tracks</p>
            </div>
            <Play className="w-6 h-6 text-white/40 group-hover:text-white transition-colors" />
          </div>
        </Link>

        {/* Playlists List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Music2 className="w-5 h-5 text-violet-400" /> Playlists
            </h2>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : playlists.length > 0 ? (
            <div className="space-y-3">
              {playlists.map((playlist) => (
                <Link 
                  key={playlist.id} 
                  href={`/playlist/${playlist.id}`}
                  className="flex items-center gap-4 p-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors active:scale-[0.98]"
                >
                  <div className="w-14 h-14 bg-violet-500/20 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                    {playlist.cover_url ? (
                      <img src={playlist.cover_url} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <Music2 className="w-6 h-6 text-violet-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{playlist.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      {playlist.is_collaborative && <Users className="w-3 h-3 text-emerald-400" />}
                      Playlist • {playlist.owner_id === profile?.id ? "You" : "Collaborative"}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/20" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-muted-foreground bg-white/5 rounded-3xl border border-dashed border-white/10">
              <Plus className="w-10 h-10 mb-4 opacity-20" />
              <p className="text-sm font-medium">No playlists yet</p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="mt-4 text-xs text-violet-400 font-bold uppercase tracking-widest"
              >
                Create your first
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 backdrop-blur-md bg-black/60">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-[#1a1a2e] border border-white/10 rounded-[40px] p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-6 text-center">New Playlist</h2>
              <input
                autoFocus
                type="text"
                placeholder="Playlist name"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-violet-500 mb-6"
                value={newPlaylistName}
                onChange={e => setNewPlaylistName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleCreate()}
              />
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-4 rounded-2xl font-semibold bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreate}
                  disabled={!newPlaylistName.trim()}
                  className="flex-1 py-4 rounded-2xl font-semibold bg-violet-600 shadow-lg shadow-violet-600/20 disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
