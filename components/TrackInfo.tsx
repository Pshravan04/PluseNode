"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePlayerStore } from "@/store/playerStore";

export default function TrackInfo() {
  const currentTrack = usePlayerStore((s) => s.currentTrack);

  return (
    <div className="flex flex-col items-center gap-1 px-4 text-center">
      <AnimatePresence mode="wait">
        {currentTrack && (
          <motion.div
            key={currentTrack.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center gap-1"
          >
            <h1 className="text-white text-2xl font-bold tracking-tight truncate max-w-xs">
              {currentTrack.title}
            </h1>
            <p className="text-white/60 text-sm font-medium">
              {currentTrack.artist}
            </p>
            <p className="text-purple-300/50 text-xs mt-1">
              Songs you&apos;ll love instantly :D
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {!currentTrack && (
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-48 bg-white/10 rounded-full animate-pulse" />
          <div className="h-4 w-32 bg-white/10 rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
}
