"use client";

import { motion } from "framer-motion";
import { Music2 } from "lucide-react";
import { useEffect } from "react";
import { usePlayerStore } from "@/store/playerStore";

export default function AnimatedLoader() {
  const setStage = usePlayerStore((s) => s.setStage);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStage("SPLASH");
    }, 4000); // 4 seconds for a more deliberate, premium entrance
    return () => clearTimeout(timer);
  }, [setStage]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(100px)" }}
      transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[200] bg-[#030014] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Immersive Cinematic Background */}
      <div className="absolute inset-0">
        <div className="mesh-gradient opacity-80 scale-150 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030014] via-transparent to-[#030014] opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.1),transparent_70%)]" />
      </div>

      <div className="relative">
        {/* Hypnotic Orbiting Particles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`orbit-${i}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-150px] border border-white/[0.03] rounded-full"
            style={{ scale: 1 + i * 0.2 }}
          >
            <motion.div 
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 1 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full blur-[2px] shadow-[0_0_15px_white]" 
            />
          </motion.div>
        ))}

        {/* Multi-layered Pulse Rings */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`pulse-${i}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [0.8, 3.5], 
              opacity: [0.3, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`absolute inset-[-80px] border border-white/10 rounded-[4rem] ${
              i % 2 === 0 ? 'shadow-[0_0_100px_rgba(124,58,237,0.15)]' : 'shadow-[0_0_100px_rgba(219,39,119,0.15)]'
            }`}
          />
        ))}

        {/* Main Logo Hexagon-like Container */}
        <motion.div
          initial={{ scale: 0, rotate: -90, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 60,
            damping: 15,
            delay: 0.5
          }}
          className="relative w-56 h-56 glass-thick rounded-[4rem] flex items-center justify-center shadow-[0_0_150px_rgba(124,58,237,0.6)] border-white/30 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-40 mix-blend-overlay" />
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
              filter: ["drop-shadow(0 0 20px rgba(255,255,255,0.4))", "drop-shadow(0 0 40px rgba(255,255,255,0.7))", "drop-shadow(0 0 20px rgba(255,255,255,0.4))"]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="z-10"
          >
            <Music2 className="w-24 h-24 text-white" />
          </motion.div>
          
          {/* Internal Scanning Glow */}
          <motion.div 
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent w-full h-1/2"
          />
        </motion.div>
      </div>

      {/* Title with Advanced Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="mt-32 text-center z-10"
      >
        <div className="overflow-hidden mb-6">
          <motion.h1 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ delay: 1.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-9xl font-black tracking-[-0.07em] text-white flex items-center gap-6 font-premium"
          >
            PULSE<span className="text-gradient">NODE</span>
          </motion.h1>
        </div>
        
        {/* Dynamic Visualizer Bar */}
        <div className="flex items-end justify-center gap-3 h-20 mb-12">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                height: [12, Math.random() * 80 + 20, 12],
                opacity: [0.3, 0.8, 0.3],
                backgroundColor: ["#7c3aed", "#db2777", "#0d9488", "#7c3aed"]
              }}
              transition={{
                duration: 1.5 + Math.random(),
                repeat: Infinity,
                delay: i * 0.05,
                ease: "easeInOut"
              }}
              className="w-3 rounded-full blur-[0.2px] shadow-[0_0_15px_rgba(124,58,237,0.3)]"
            />
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 2 }}
          className="relative px-12"
        >
          <p className="text-[14px] font-black uppercase tracking-[1em] text-white/40 mb-5 pl-[1em]">
            Harmonizing Your Reality
          </p>
          <div className="max-w-[300px] h-[1px] bg-white/5 mx-auto relative overflow-hidden">
            <motion.div 
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent w-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

