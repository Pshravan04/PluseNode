"use client";

import { motion } from "framer-motion";
import { mockTracks } from "@/data/mockTracks";
import TrackCard from "@/components/TrackCard";
import { usePlayerStore } from "@/store/playerStore";

// Group tracks by genre to simulate playlists
const genres = Array.from(new Set(mockTracks.map((t) => t.genre)));
const playlists = genres.map((genre) => ({
  name: genre,
  tracks: mockTracks.filter((t) => t.genre === genre),
}));

export default function LibraryPage() {
  const { setQueue, play } = usePlayerStore();

  const handlePlayPlaylist = (tracks: typeof mockTracks) => {
    setQueue(tracks, 0);
    play(tracks[0], 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col h-full pb-44"
    >
      {/* Header */}
      <div className="pt-12 px-4 pb-4">
        <h1 className="text-white text-2xl font-bold">Your Library</h1>
        <p className="text-white/40 text-sm mt-1">{mockTracks.length} songs across {playlists.length} playlists</p>
      </div>

      <div className="scroll-content flex-1 px-4">
        {/* Playlists by genre */}
        {playlists.map((playlist, pi) => (
          <motion.div
            key={playlist.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: pi * 0.08 }}
            className="mb-6"
          >
            {/* Playlist header */}
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-white font-semibold text-base">{playlist.name}</h2>
                <p className="text-white/40 text-xs">{playlist.tracks.length} tracks</p>
              </div>
              <button
                onClick={() => handlePlayPlaylist(playlist.tracks)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/20 rounded-full text-purple-300 text-xs font-medium transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play
              </button>
            </div>

            {/* Tracks */}
            <div className="bg-white/5 rounded-2xl p-2 border border-white/5">
              {playlist.tracks.map((track, i) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  index={i}
                  allTracks={playlist.tracks}
                  compact
                />
              ))}
            </div>
          </motion.div>
        ))}

        {/* All tracks section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-white font-semibold text-base">All Songs</h2>
              <p className="text-white/40 text-xs">{mockTracks.length} tracks</p>
            </div>
            <button
              onClick={() => handlePlayPlaylist(mockTracks)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/20 rounded-full text-purple-300 text-xs font-medium transition-all duration-200"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                <path d="M8 5v14l11-7z" />
              </svg>
              Shuffle All
            </button>
          </div>
          <div className="bg-white/5 rounded-2xl p-2 border border-white/5">
            {mockTracks.map((track, i) => (
              <TrackCard key={track.id} track={track} index={i} allTracks={mockTracks} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
