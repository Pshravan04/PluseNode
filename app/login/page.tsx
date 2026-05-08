"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Music2, Mail, Lock, ChevronRight, Sparkles, LogIn } from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import BackgroundParticles from "@/components/BackgroundParticles";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const setStage = usePlayerStore((s) => s.setStage);
  const setProfile = usePlayerStore((s) => s.setProfile);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      alert(error.message);
    } else if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        setProfile(profile);
        setStage("MAIN");
        router.push("/");
      } else {
        setStage("ONBOARDING");
        router.push("/onboarding");
      }
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ 
      provider: 'google', 
      options: { redirectTo: window.location.origin } 
    });
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
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/30 blur-[100px] rounded-full group-hover:bg-primary/40 transition-all duration-1000" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-secondary/20 blur-[100px] rounded-full group-hover:bg-secondary/30 transition-all duration-1000" />
          
          <div className="flex flex-col items-center gap-14 mb-20">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-32 h-32 glass rounded-[3.5rem] flex items-center justify-center relative overflow-hidden group/icon shadow-[0_20px_50px_rgba(139,92,246,0.3)] border-white/20"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary opacity-30" />
              <Music2 className="w-16 h-16 text-white relative z-10" />
              <motion.div 
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [1, 1.5, 1],
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-white/20 blur-2xl"
              />
            </motion.div>
            <div className="text-center space-y-6">
              <h1 className="text-8xl font-black tracking-[-0.06em] text-white font-premium text-gradient-premium">
                Reconnect.
              </h1>
              <p className="text-white/30 text-xl font-bold tracking-[0.6em] uppercase">
                SYNC YOUR FREQUENCY
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="space-y-8"
            >
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none text-white/10 group-focus-within/input:text-primary transition-all group-focus-within/input:scale-110">
                  <Mail className="w-7 h-7" />
                </div>
                <input
                  type="email"
                  placeholder="Email address"
                  required
                  className="w-full bg-white/[0.01] border border-white/5 rounded-[2.5rem] py-8 pl-20 pr-10 outline-none focus:border-primary/50 focus:bg-white/[0.03] focus:shadow-[0_0_60px_rgba(139,92,246,0.1)] transition-all text-white placeholder:text-white/10 text-2xl font-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none text-white/10 group-focus-within/input:text-primary transition-all group-focus-within/input:scale-110">
                  <Lock className="w-7 h-7" />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  required
                  className="w-full bg-white/[0.01] border border-white/5 rounded-[2.5rem] py-8 pl-20 pr-10 outline-none focus:border-primary/50 focus:bg-white/[0.03] focus:shadow-[0_0_60px_rgba(139,92,246,0.1)] transition-all text-white placeholder:text-white/10 text-2xl font-black"
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
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              {loading ? "Syncing..." : (
                <>
                  Sign In
                  <ChevronRight className="w-9 h-9 group-hover:translate-x-3 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
                </>
              )}
            </motion.button>
          </form>

          <div className="relative my-16 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative bg-[#020108] px-10 text-[12px] uppercase font-black tracking-[0.6em] text-white/10 whitespace-nowrap">
              Secure Frequency
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full glass border-white/10 text-white/40 py-7 rounded-[2.5rem] font-black flex items-center justify-center gap-6 hover:bg-white/5 hover:text-white transition-all active:scale-[0.98] text-2xl group/google"
            >
              <img src="https://www.google.com/favicon.ico" className="w-8 h-8 grayscale opacity-20 group-hover/google:grayscale-0 group-hover/google:opacity-100 transition-all duration-700" alt="" />
              Continue with Google
            </button>
          </div>

          <p className="text-center mt-16 text-white/20 font-bold text-xl tracking-tight">
            New listener?{" "}
            <button 
              onClick={() => {
                setStage("AUTH");
                router.push("/signup");
              }} 
              className="text-white font-black hover:text-primary transition-all border-b-2 border-primary/20 hover:border-primary pb-1"
            >
              Create Pulse
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
            Secure • Encrypted • PulseNode Archive
          </p>
        </motion.div>
      </motion.div>
    </div>

  );
}

