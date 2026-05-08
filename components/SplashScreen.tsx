"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Play, Mic2, Disc, Music } from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";

export default function SplashScreen() {
  const setStage = usePlayerStore((s) => s.setStage);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -50, filter: "blur(100px)" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[150] bg-[#030014] overflow-hidden flex flex-col"
    >
      {/* Dynamic Atmospheric Background */}
      <div className="absolute inset-0 z-0">
        <div className="mesh-gradient opacity-90 scale-150 rotate-12" />
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(124,58,237,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(219,39,119,0.15),transparent_50%)]" />
      </div>

      {/* Interactive Background Particles */}
      <div className="absolute inset-0 z-1 opacity-40">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: 0 
            }}
            animate={{ 
              y: [null, "-30%"],
              opacity: [0, 0.7, 0],
              scale: [0, Math.random() * 1.5 + 0.5, 0]
            }}
            transition={{ 
              duration: 8 + Math.random() * 12, 
              repeat: Infinity, 
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
            className="absolute w-1.5 h-1.5 bg-white rounded-full blur-[1.5px]"
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-10 text-center relative z-10">
        {/* Main Hero Visualizer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 60 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.8, type: "spring", damping: 20 }}
          className="relative mb-28"
        >
          <div className="w-72 h-72 glass-thick rounded-[4.5rem] flex items-center justify-center relative overflow-hidden group border-white/20 shadow-[0_50px_100px_rgba(0,0,0,0.7)]">
             <motion.div
               animate={{ rotate: 360 }}
               transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 opacity-10"
             >
               <Disc className="w-full h-full text-white p-10" />
             </motion.div>
             
             {/* Center Glow Icon */}
             <motion.div
               animate={{ 
                 scale: [1, 1.12, 1],
                 filter: [
                   "drop-shadow(0 0 40px rgba(124, 58, 237, 0.8))", 
                   "drop-shadow(0 0 60px rgba(219, 39, 119, 0.8))", 
                   "drop-shadow(0 0 40px rgba(124, 58, 237, 0.8))"
                 ]
               }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
               className="relative z-20"
             >
               <Sparkles className="w-36 h-36 text-white" />
             </motion.div>
             
             {/* Dynamic Floaties */}
             <motion.div 
               animate={{ y: [0, -30, 0], x: [0, 15, 0], opacity: [0.4, 1, 0.4] }}
               transition={{ duration: 6, repeat: Infinity }}
               className="absolute top-12 right-12"
             >
               <div className="p-4 rounded-2xl glass-card border-white/20">
                 <Mic2 className="w-10 h-10 text-secondary" />
               </div>
             </motion.div>
             <motion.div 
               animate={{ y: [0, 30, 0], x: [0, -15, 0], opacity: [0.4, 1, 0.4] }}
               transition={{ duration: 6.5, repeat: Infinity }}
               className="absolute bottom-12 left-12"
             >
               <div className="p-4 rounded-2xl glass-card border-white/20">
                 <Play className="w-10 h-10 text-accent fill-current" />
               </div>
             </motion.div>
          </div>
          
          {/* Orbital Rings */}
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 25 + i * 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-40px] border border-dashed border-white/10 rounded-full opacity-30"
              style={{ padding: i * 30 }}
            />
          ))}
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-12"
        >
          <h1 className="text-[10rem] font-black tracking-[-0.06em] leading-[0.7] font-premium">
            <span className="opacity-40">Define</span><br />
            <span className="text-gradient">
              Your Sound.
            </span>
          </h1>
          <p className="text-4xl text-white/40 max-w-[500px] mx-auto leading-tight font-medium tracking-tight px-10">
            Intelligent sonic architecture <br /> for the elite auditory explorer.
          </p>
        </motion.div>
      </div>

      {/* Action Footer */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="p-16 pb-32 relative z-10 w-full max-w-2xl mx-auto"
      >
        <button
          onClick={() => setStage("AUTH")}
          className="btn-premium w-full h-32 text-5xl flex items-center justify-center gap-8 group shadow-[0_30px_100px_rgba(124, 58, 237, 0.3)] border border-white/20"
        >
          Begin Journey
          <ArrowRight className="w-16 h-16 group-hover:translate-x-8 transition-transform duration-700 ease-in-out" />
        </button>
        
        <div className="mt-20 flex flex-col items-center gap-6">
          <p className="text-white/20 font-black tracking-[0.6em] text-[15px] uppercase">
            Synchronized with Archive
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => setStage("AUTH")}
              className="text-white font-black text-2xl hover:text-primary transition-all border-b-4 border-primary/20 hover:border-primary pb-2"
            >
              Access Frequency
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

