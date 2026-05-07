"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Smartphone } from "lucide-react";
import Image from "next/image";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check if already dismissed in this session
      const isDismissed = sessionStorage.getItem("pwa_prompt_dismissed");
      if (!isDismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem("pwa_prompt_dismissed", "true");
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-24 left-4 right-4 z-[100] p-4 bg-[#1a1a2e] border border-white/10 rounded-3xl shadow-2xl shadow-purple-500/10 backdrop-blur-xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-violet-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-violet-600/20">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm">Install PulseNode</h3>
              <p className="text-xs text-white/40 truncate">Add to home screen for the full app experience</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleDismiss}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white/40" />
              </button>
              <button 
                onClick={handleInstall}
                className="bg-white text-black px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-white/5 active:scale-95 transition-transform flex items-center gap-2"
              >
                <Download className="w-3 h-3" /> Install
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
