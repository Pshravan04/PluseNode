"use client";

import { motion } from "framer-motion";

export default function BackgroundParticles() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Mesh Gradient Base */}
      <div className="mesh-gradient opacity-70 scale-150 rotate-12" />
      <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-black/40" />
      
      {/* Decorative Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(6,182,212,0.1),transparent_50%)]" />

      {/* Atmospheric Particles */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: 0 
            }}
            animate={{ 
              y: [null, (Math.random() > 0.5 ? "-30%" : "30%")],
              opacity: [0, Math.random() * 0.8, 0],
              scale: [0, Math.random() * 1.5 + 0.5, 0]
            }}
            transition={{ 
              duration: 10 + Math.random() * 15, 
              repeat: Infinity, 
              delay: Math.random() * 10,
              ease: "easeInOut"
            }}
            className="absolute w-1.5 h-1.5 bg-white rounded-full blur-[1.5px]"
          />
        ))}
      </div>

      {/* Floating Orbital Dust */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`dust-${i}`}
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            duration: 30 + i * 10, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute inset-[-100px] border border-dashed border-white/5 rounded-full opacity-10"
          style={{ padding: i * 100 }}
        />
      ))}
    </div>
  );
}
