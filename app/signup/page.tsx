"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Music2, Mail, Lock, ChevronRight, Sparkles, UserPlus } from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import BackgroundParticles from "@/components/BackgroundParticles";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const setStage = usePlayerStore((s) => s.setStage);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/onboarding`
      }
    });
    if (error) {
      alert(error.message);
    } else {
      setStage("ONBOARDING");
      router.push("/onboarding");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#020108]">
      <BackgroundParticles />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      <motion.div 
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="glass-panel p-16 shadow-2xl relative overflow-hidden group border-white/10 rounded-[4rem]">
          {/* Decorative Elements */}
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-secondary/30 blur-[100px] rounded-full group-hover:bg-secondary/40 transition-all duration-1000" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all duration-1000" />
          
          <div className="flex flex-col items-center gap-14 mb-20">
            <motion.div 
              whileHover={{ rotate: -10, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-32 h-32 glass rounded-[3.5rem] flex items-center justify-center relative overflow-hidden group/icon shadow-[0_20px_50px_rgba(236,72,153,0.3)] border-white/20"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-secondary to-primary opacity-30" />
              <UserPlus className="w-16 h-16 text-white relative z-10" />
              <motion.div 
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [1, 1.4, 1],
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-white/10 blur-2xl"
              />
            </motion.div>
            <div className="text-center space-y-6">
              <h1 className="text-8xl font-black tracking-[-0.06em] text-white font-premium text-gradient-premium">
                Initialize.
              </h1>
              <p className="text-white/30 text-xl font-bold tracking-[0.6em] uppercase">
                JOIN THE ARCHIVE
              </p>
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-10">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="space-y-8"
            >
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none text-white/10 group-focus-within/input:text-secondary transition-all group-focus-within/input:scale-110">
                  <Mail className="w-7 h-7" />
                </div>
                <input
                  type="email"
                  placeholder="Email address"
                  required
                  className="w-full bg-white/[0.01] border border-white/5 rounded-[2.5rem] py-8 pl-20 pr-10 outline-none focus:border-secondary/50 focus:bg-white/[0.03] focus:shadow-[0_0_60px_rgba(236,72,153,0.1)] transition-all text-white placeholder:text-white/10 text-2xl font-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none text-white/10 group-focus-within/input:text-secondary transition-all group-focus-within/input:scale-110">
                  <Lock className="w-7 h-7" />
                </div>
                <input
                  type="password"
                  placeholder="Create strong password"
                  required
                  className="w-full bg-white/[0.01] border border-white/5 rounded-[2.5rem] py-8 pl-20 pr-10 outline-none focus:border-secondary/50 focus:bg-white/[0.03] focus:shadow-[0_0_60px_rgba(236,72,153,0.1)] transition-all text-white placeholder:text-white/10 text-2xl font-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="w-full group relative overflow-hidden bg-white text-black py-8 rounded-[2.5rem] font-black text-3xl shadow-[0_30px_60px_rgba(255,255,255,0.1)] hover:scale-[1.03] active:scale-[0.97] transition-all disabled:opacity-50 flex items-center justify-center gap-6"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              {loading ? "Initializing..." : (
                <>
                  Get Started
                  <Sparkles className="w-8 h-8 text-secondary animate-pulse" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center mt-16 text-white/20 font-bold text-xl tracking-tight">
            Already Pulse?{" "}
            <button 
              onClick={() => {
                setStage("AUTH");
                router.push("/login");
              }} 
              className="text-white font-black hover:text-secondary transition-all border-b-2 border-secondary/20 hover:border-secondary pb-1"
            >
              Sign In
            </button>
          </p>
        </div>

        {/* Footer info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 text-center"
        >
          <p className="text-[12px] text-white/5 uppercase tracking-[0.5em] font-black">
            Private • Seamless • PulseNode Archive
          </p>
        </motion.div>
      </motion.div>
    </div>

  );
}

