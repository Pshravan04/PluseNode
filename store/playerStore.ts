import { create } from "zustand";
import { Track, UserProfile } from "@/store/types";

interface PlayerState {
  queue: Track[];
  activeIndex: number;
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  isShuffle: boolean;
  isRepeat: boolean;
  likedSongs: Track[];
  recentlyPlayed: Track[];
  profile: UserProfile | null;
  isNowPlayingOpen: boolean;

  // Actions
  setQueue: (tracks: Track[], startIndex?: number) => void;
  play: (track: Track, index: number) => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  setActiveIndex: (index: number) => void;
  setVolume: (v: number) => void;
  setCurrentTime: (t: number) => void;
  setDuration: (d: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleLike: (track: Track) => void;
  isLiked: (trackId: string) => boolean;
  setProfile: (profile: UserProfile | null) => void;
  toggleNowPlaying: () => void;
}

const loadLiked = (): Track[] => {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("pn_liked") || "[]"); } catch { return []; }
};

const loadRecent = (): Track[] => {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("pn_recent") || "[]"); } catch { return []; }
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  queue: [],
  activeIndex: 0,
  currentTrack: null,
  isPlaying: false,
  volume: 0.8,
  currentTime: 0,
  duration: 0,
  isShuffle: false,
  isRepeat: false,
  likedSongs: loadLiked(),
  recentlyPlayed: loadRecent(),
  profile: null,
  isNowPlayingOpen: false,

  setQueue: (tracks, startIndex = 0) => {
    set({ queue: tracks, activeIndex: startIndex, currentTrack: tracks[startIndex] || null });
  },

  play: (track, index) => {
    const recent = [track, ...get().recentlyPlayed.filter((t) => t.id !== track.id)].slice(0, 30);
    if (typeof window !== "undefined") localStorage.setItem("pn_recent", JSON.stringify(recent));
    set({ currentTrack: track, activeIndex: index, isPlaying: true, currentTime: 0, recentlyPlayed: recent });
  },

  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

  next: () => {
    const { queue, activeIndex, isShuffle, isRepeat, currentTrack } = get();
    if (isRepeat && currentTrack) {
      set({ currentTime: 0, isPlaying: true });
      return;
    }
    if (queue.length === 0) return;
    const nextIdx = isShuffle
      ? Math.floor(Math.random() * queue.length)
      : (activeIndex + 1) % queue.length;
    const track = queue[nextIdx];
    get().play(track, nextIdx);
  },

  prev: () => {
    const { queue, activeIndex, currentTime } = get();
    if (currentTime > 3) { set({ currentTime: 0 }); return; }
    if (queue.length === 0) return;
    const prevIdx = (activeIndex - 1 + queue.length) % queue.length;
    get().play(queue[prevIdx], prevIdx);
  },

  setActiveIndex: (index) => {
    const { queue } = get();
    if (queue[index]) set({ activeIndex: index, currentTrack: queue[index] });
  },

  setVolume: (v) => set({ volume: Math.max(0, Math.min(1, v)) }),
  setCurrentTime: (t) => set({ currentTime: t }),
  setDuration: (d) => set({ duration: d }),
  toggleShuffle: () => set((s) => ({ isShuffle: !s.isShuffle })),
  toggleRepeat: () => set((s) => ({ isRepeat: !s.isRepeat })),

  toggleLike: (track) => {
    const { likedSongs } = get();
    const isLiked = likedSongs.some(t => t.id === track.id);
    const updated = isLiked
      ? likedSongs.filter((t) => t.id !== track.id)
      : [track, ...likedSongs];
    if (typeof window !== "undefined") localStorage.setItem("pn_liked", JSON.stringify(updated));
    set({ likedSongs: updated });
  },

  isLiked: (trackId) => get().likedSongs.some(t => t.id === trackId),
  setProfile: (profile) => set({ profile }),
  toggleNowPlaying: () => set((s) => ({ isNowPlayingOpen: !s.isNowPlayingOpen })),
}));
