"use client";

import { usePlayerStore } from "@/store/playerStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, 
  Heart, 
  History, 
  Music2, 
  User as UserIcon,
  LogOut,
  ChevronRight,
  Globe,
  Mic2,
  Sparkles,
  ShieldCheck,
  Dna
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
      <div className="h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
        <div className="mesh-gradient opacity-30" />
        <div className="w-24 h-24 rounded-[2.5rem] glass flex items-center justify-center mb-10 animate-float border border-white/10 shadow-2xl relative group">
          <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <UserIcon className="w-10 h-10 text-primary relative z-10" />
        </div>
        <h1 className="text-4xl font-black mb-4 text-white font-outfit tracking-tighter">Join the Pulse</h1>
        <p className="text-white/40 text-center mb-12 max-w-[280px] font-medium leading-relaxed uppercase tracking-[0.1em] text-[10px] font-black">SIGN IN TO UNLOCK YOUR MUSICAL JOURNEY AND PERSONALIZED STATS</p>
        <button 
          onClick={() => router.push("/login")}
          className="bg-primary px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_15px_40px_var(--color-primary-glow)] hover:scale-105 transition-all active:scale-95 text-white"
        >
          Activate Identity
        </button>
      </div>
    );
  }

    <div className="h-full overflow-y-auto pb-32 scrollbar-hide relative bg-black">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="mesh-gradient opacity-40 scale-150 animate-slow-spin" />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[120px]" />
      </div>
      
      {/* Cinematic Header Section */}
      <section className="relative pt-32 pb-20 px-8 flex flex-col items-center z-10">
        <div className="absolute top-0 inset-x-0 h-[30rem] bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        
        {/* Profile Identity */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="relative group mb-10">
            {/* Multi-layered glow */}
            <div className="absolute inset-0 bg-primary/30 blur-[80px] opacity-0 group-hover:opacity-100 transition-all duration-1000 scale-150" />
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary via-secondary to-accent opacity-20 blur-2xl animate-pulse" />
            
            <div className="w-44 h-44 rounded-[4rem] glass-panel p-2 relative border border-white/20 shadow-[0_40px_80px_rgba(0,0,0,0.5)] overflow-hidden group-hover:scale-105 group-hover:rotate-1 transition-all duration-700">
              <div className="w-full h-full rounded-[3.5rem] overflow-hidden relative">
                <img 
                  src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} 
                  className="w-full h-full object-cover transform scale-110 group-hover:scale-100 transition-transform duration-1000" 
                  alt="" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              
              {/* Online status indicator */}
              <div className="absolute -bottom-2 -right-2 w-14 h-14 rounded-[2rem] bg-black border-[6px] border-black flex items-center justify-center shadow-2xl">
                <div className="w-full h-full bg-emerald-500 rounded-[1.5rem] flex items-center justify-center border-2 border-white/20">
                  <div className="w-3 h-3 rounded-full bg-white animate-ping opacity-75" />
                  <div className="absolute w-3 h-3 rounded-full bg-white shadow-[0_0_15px_#fff]" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-black tracking-tighter font-outfit text-white drop-shadow-2xl"
            >
              {profile.display_name}
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-4"
            >
              <span className="text-[11px] font-black text-primary uppercase tracking-[0.4em] bg-primary/10 px-5 py-2 rounded-full border border-primary/20 backdrop-blur-md">
                @{profile.username}
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <div className="flex items-center gap-2 text-white/40">
                <Globe className="w-3.5 h-3.5" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">{profile.country}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Floating Settings */}
        <div className="absolute top-12 right-8 z-20">
          <motion.button 
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 rounded-[1.8rem] glass-panel flex items-center justify-center hover:bg-white/10 transition-all border border-white/10 shadow-2xl group"
          >
            <Settings className="w-7 h-7 text-white/40 group-hover:text-white transition-colors" />
          </motion.button>
        </div>
      </section>

      <div className="px-8 space-y-16 relative z-10">
        
        {/* Kinetic Stats Grid */}
        <div className="grid grid-cols-2 gap-8">
          {[
            { 
              label: "COLLECTED", 
              value: likedSongs.length, 
              icon: Heart, 
              color: "primary",
              desc: "SONGS IN VAULT"
            },
            { 
              label: "ACTIVITY", 
              value: recentlyPlayed.length, 
              icon: History, 
              color: "secondary",
              desc: "TOTAL SESSIONS"
            }
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + (i * 0.1) }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass-panel bg-white/[0.01] border border-white/5 rounded-[3.5rem] p-10 flex flex-col items-center gap-6 relative overflow-hidden group shadow-[0_30px_60px_rgba(0,0,0,0.3)]"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}/10 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
              
              <div className={`w-16 h-16 rounded-[1.8rem] bg-${stat.color}/10 flex items-center justify-center border border-${stat.color}/20 group-hover:scale-110 transition-all duration-500 shadow-inner group-hover:shadow-${stat.color}/20`}>
                <stat.icon className={`w-8 h-8 text-${stat.color} ${stat.color === 'primary' ? 'fill-primary/20' : ''}`} />
              </div>
              
              <div className="text-center">
                <span className="text-4xl font-black block text-white font-outfit leading-none mb-2 tracking-tighter">
                  {stat.value}
                </span>
                <span className="text-[10px] text-white/20 uppercase font-black tracking-[0.3em] block mb-1">
                  {stat.label}
                </span>
                <p className="text-[8px] text-white/10 font-black uppercase tracking-widest">{stat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Musical DNA Visualization */}
        <section className="space-y-10">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-5">
              <div className="w-2.5 h-10 bg-gradient-to-b from-primary to-secondary rounded-full shadow-[0_0_30px_var(--color-primary-glow)]" />
              <div>
                <h2 className="text-3xl font-black font-outfit tracking-tighter text-white leading-none">Acoustic Identity</h2>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-black mt-2">SONIC GENETIC PROFILE</p>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
              <Dna className="w-6 h-6 text-primary animate-pulse" />
            </div>
          </div>
          
          <div className="glass-panel bg-white/[0.01] border border-white/5 rounded-[4rem] p-12 space-y-12 relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.4)]">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/5 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full animate-pulse delay-1000" />
            
            {/* Core Genres Grid */}
            <div className="space-y-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <p className="text-[11px] text-white/40 uppercase font-black tracking-[0.4em]">Genetic Foundations</p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                {profile.favorite_genres?.map((genre, i) => (
                  <motion.span 
                    key={genre}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + (i * 0.05) }}
                    className="group cursor-default"
                  >
                    <div className="bg-white/[0.03] border border-white/5 px-8 py-4 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] text-white/60 group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-white transition-all duration-500 shadow-xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="relative z-10">{genre}</span>
                    </div>
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Vibe Influencers */}
            <div className="space-y-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-secondary/10 border border-secondary/20">
                  <Mic2 className="w-5 h-5 text-secondary" />
                </div>
                <p className="text-[11px] text-white/40 uppercase font-black tracking-[0.4em]">Atmospheric Anchors</p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                {profile.favorite_artists?.map((artist, i) => (
                  <motion.div 
                    key={artist}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + (i * 0.05) }}
                    className="flex items-center gap-4 glass-panel bg-white/[0.04] px-7 py-4 rounded-[2rem] border border-white/10 group hover:bg-white/10 transition-all duration-500 shadow-xl"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_15px_var(--color-secondary)] group-hover:animate-ping" />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/80 group-hover:text-white transition-colors">
                      {artist}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Action Infrastructure */}
        <div className="space-y-6 relative z-10">
          <button className="w-full flex items-center justify-between p-8 glass-panel bg-white/[0.01] rounded-[3rem] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all active:scale-[0.98] group shadow-2xl">
            <div className="flex items-center gap-8">
              <div className="w-16 h-16 rounded-[1.8rem] bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-inner border border-blue-500/10">
                <Globe className="w-8 h-8 text-blue-400" />
              </div>
              <div className="text-left">
                <p className="font-black text-2xl font-outfit tracking-tighter leading-none mb-2">Sonic Jurisdiction</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em]">{profile.country}</p>
                </div>
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <ChevronRight className="w-7 h-7 text-white/20 group-hover:text-white" />
            </div>
          </button>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-8 glass-panel bg-white/[0.01] rounded-[3rem] border border-red-500/10 hover:bg-red-500/10 hover:border-red-500/20 transition-all active:scale-[0.98] group shadow-2xl"
          >
            <div className="flex items-center gap-8">
              <div className="w-16 h-16 rounded-[1.8rem] bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-inner border border-red-500/10">
                <LogOut className="w-8 h-8 text-red-500" />
              </div>
              <div className="text-left">
                <p className="font-black text-2xl font-outfit tracking-tighter leading-none mb-2 text-red-500">Terminate Session</p>
                <p className="text-[10px] text-red-500/40 font-black uppercase tracking-[0.3em]">SECURE LOGOUT</p>
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-red-500/5 flex items-center justify-center group-hover:bg-red-500/10 transition-colors">
              <ChevronRight className="w-7 h-7 text-red-500/20 group-hover:text-red-500" />
            </div>
          </button>
        </div>

        {/* Footer Branding */}
        <div className="py-24 flex flex-col items-center gap-10">
          <div className="flex items-center gap-4">
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <div className="w-1.5 h-20 bg-gradient-to-b from-primary/40 via-secondary/20 to-transparent rounded-full shadow-[0_0_30px_rgba(139,92,246,0.1)]" />
            <div className="w-1 h-1 rounded-full bg-white/10" />
          </div>
          <div className="flex flex-col items-center gap-3">
            <motion.div 
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-[12px] text-white/40 uppercase font-black tracking-[0.8em] leading-none"
            >
              PulseNode
            </motion.div>
            <p className="text-[9px] text-white/10 uppercase font-black tracking-[0.3em]">VERSION 2.4.0 ALPHA • PREMIUM CORE</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronRight(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
  );
}

