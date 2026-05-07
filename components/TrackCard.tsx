"use client";

import Image from "next/image";
import { usePlayerStore } from "@/store/playerStore";
import { Track, Playlist } from "@/store/types";
import { Plus, Play, Pause, MoreVertical, Music2, Check, X } from "lucide-react";
import { useState } from "react";
import { getUserPlaylists, addTrackToPlaylist } from "@/lib/playlists";
import { motion, AnimatePresence } from "framer-motion";

interface TrackCardProps {
  track: Track;
  index?: number;
  allTracks?: Track[];
  compact?: boolean;
  onClick?: () => void;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function TrackCard({ track, index, allTracks, compact = false, onClick }: TrackCardProps) {
  const { currentTrack, isPlaying, play, setQueue, togglePlay, profile } = usePlayerStore();
  const isActive = currentTrack?.id === track.id;

  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (allTracks && index !== undefined) {
      if (isActive) {
        togglePlay();
      } else {
        setQueue(allTracks, index);
        play(track, index);
      }
    }
  };

  const openPlaylistModal = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!profile) return;
    setShowPlaylistModal(true);
    const data = await getUserPlaylists(profile.id);
    setPlaylists(data);
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    setAddingTo(playlistId);
    const ok = await addTrackToPlaylist(playlistId, track);
    setAddingTo(null);
    if (ok) {
      setSuccessId(playlistId);
      setTimeout(() => {
        setSuccessId(null);
        setShowPlaylistModal(false);
      }, 1000);
    }
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 select-none group ${
          isActive
            ? "bg-white/10 ring-1 ring-purple-400/40"
            : "hover:bg-white/5 active:bg-white/10"
        }`}
      >
        <div className="relative shrink-0">
          <div className={`${compact ? "w-10 h-10" : "w-14 h-14"} rounded-lg overflow-hidden relative ring-1 ring-white/10`}>
            <Image src={track.albumArt} alt={track.title} fill className="object-cover" />
          </div>
          {isActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
              {isPlaying ? (
                <div className="flex gap-[2px] items-end">
                  {[1, 2, 3].map((b) => (
                    <div key={b} className="waveform-bar animating rounded-full" style={{ animationDelay: `${b * 0.12}s` }} />
                  ))}
                </div>
              ) : (
                <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className={`font-semibold truncate ${isActive ? "text-purple-300" : "text-white"} ${compact ? "text-sm" : "text-base"}`}>
            {track.title}
          </p>
          <p className="text-white/50 text-xs truncate">{track.artist}</p>
          {!compact && <p className="text-white/30 text-xs mt-0.5">{track.genre}</p>}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {profile && (
            <button 
              onClick={openPlaylistModal}
              className="p-2 text-white/20 hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
          <span className="text-white/30 text-xs">{formatDuration(track.duration)}</span>
        </div>
      </div>

      {/* Add to Playlist Modal */}
      <AnimatePresence>
        {showPlaylistModal && (
          <div 
            className="fixed inset-0 z-[400] flex items-end justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowPlaylistModal(false)}
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm bg-[#1a1a2e] border border-white/10 rounded-t-[40px] p-6 pb-12 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Add to Playlist</h2>
                <button onClick={() => setShowPlaylistModal(false)} className="p-2 bg-white/5 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
                {playlists.length > 0 ? playlists.map(p => (
                  <button 
                    key={p.id}
                    onClick={() => handleAddToPlaylist(p.id)}
                    disabled={addingTo !== null}
                    className="w-full flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0">
                      <Music2 className="w-5 h-5 text-violet-400" />
                    </div>
                    <span className="font-semibold flex-1 text-left truncate">{p.name}</span>
                    {successId === p.id ? (
                      <Check className="w-5 h-5 text-emerald-400" />
                    ) : addingTo === p.id ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Plus className="w-5 h-5 text-white/20" />
                    )}
                  </button>
                )) : (
                  <div className="py-8 text-center text-muted-foreground">
                    <p className="text-sm mb-4">No playlists found</p>
                    <button 
                      onClick={() => {
                        setShowPlaylistModal(false);
                        window.location.href = "/library";
                      }}
                      className="text-xs font-bold text-violet-400 uppercase tracking-widest"
                    >
                      Create One
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
