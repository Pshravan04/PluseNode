"use client";

import { usePlayerStore } from "@/store/playerStore";
import { motion } from "framer-motion";
import { 
  Settings, 
  Heart, 
  History, 
  Music2, 
  User as UserIcon,
  LogOut,
  ChevronRight,
  Globe,
  Mic2
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProfilePage() {
  const { profile, likedSongs, recentlyPlayed, setProfile } = usePlayerStore();
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    router.push("/login");
  };

  if (!profile) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#1a1a2e] to-[#0d0b1e]">
        <UserIcon className="w-16 h-16 text-white/20 mb-4" />
        <h1 className="text-xl font-bold mb-2">Not logged in</h1>
        <p className="text-muted-foreground text-center mb-6">Sign in to see your personalized profile and stats.</p>
        <button 
          onClick={() => router.push("/login")}
          className="bg-violet-600 px-8 py-3 rounded-2xl font-semibold shadow-lg shadow-violet-600/20"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pb-32 scrollbar-hide">
      {/* Header / Banner */}
      <section className="relative h-64 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-600/20 to-[#0d0b1e]" />
        
        {/* Profile Info */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="w-24 h-24 rounded-full border-4 border-white/10 overflow-hidden shadow-2xl mb-4 bg-white/5 flex items-center justify-center">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} className="w-full h-full object-cover" alt="" />
            ) : (
              <UserIcon className="w-10 h-10 text-white/40" />
            )}
          </div>
          <h1 className="text-2xl font-bold">{profile.display_name}</h1>
          <p className="text-sm text-muted-foreground">@{profile.username}</p>
        </motion.div>

        {/* Top Actions */}
        <div className="absolute top-8 right-6 flex gap-4">
          <button className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </section>

      <div className="px-6 -mt-8 relative z-20 space-y-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col items-center gap-2 backdrop-blur-md"
          >
            <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
            <span className="text-2xl font-bold">{likedSongs.length}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Liked Songs</span>
          </motion.div>
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col items-center gap-2 backdrop-blur-md"
          >
            <History className="w-6 h-6 text-violet-400" />
            <span className="text-2xl font-bold">{recentlyPlayed.length}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Recent Tracks</span>
          </motion.div>
        </div>

        {/* Preferences Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Music2 className="w-5 h-5 text-violet-400" /> Your Vibes
          </h2>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
            
            {/* Genres */}
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Favorite Genres</p>
              <div className="flex flex-wrap gap-2">
                {profile.favorite_genres?.map(genre => (
                  <span key={genre} className="bg-violet-600/10 text-violet-300 border border-violet-500/20 px-3 py-1.5 rounded-full text-xs font-medium">
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Languages</p>
              <div className="flex flex-wrap gap-2">
                {profile.language_preferences?.map(lang => (
                  <span key={lang} className="bg-blue-600/10 text-blue-300 border border-blue-500/20 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
                    <Globe className="w-3 h-3" /> {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Artists */}
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Fav Artists</p>
              <div className="flex flex-wrap gap-2">
                {profile.favorite_artists?.map(artist => (
                  <span key={artist} className="bg-emerald-600/10 text-emerald-300 border border-emerald-500/20 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
                    <Mic2 className="w-3 h-3" /> {artist}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Menu Items */}
        <div className="space-y-2">
          <button className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center"><Globe className="w-5 h-5 text-blue-400" /></div>
              <div className="text-left">
                <p className="font-semibold">Music Region</p>
                <p className="text-xs text-muted-foreground">{profile.country}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/20" />
          </button>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-5 bg-red-500/5 border border-red-500/10 rounded-2xl hover:bg-red-500/10 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center"><LogOut className="w-5 h-5 text-red-400" /></div>
              <p className="font-semibold text-red-400">Logout</p>
            </div>
            <ChevronRight className="w-5 h-5 text-red-500/20 group-hover:text-red-500/40" />
          </button>
        </div>

        <p className="text-center text-[10px] text-white/20 uppercase tracking-[0.2em] pt-4 pb-8">
          PulseNode v1.0.0
        </p>
      </div>
    </div>
  );
}
