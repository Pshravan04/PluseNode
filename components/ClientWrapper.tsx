"use client";

import BottomPlayer from "@/components/BottomPlayer";
import BottomNav from "@/components/BottomNav";
import AudioEngine from "@/components/AudioEngine";
import AuthListener from "@/components/AuthListener";
import NowPlayingView from "@/components/NowPlayingView";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";
import AppFlow from "@/components/AppFlow";
import { usePlayerStore } from "@/store/playerStore";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const stage = usePlayerStore((s) => s.stage);
  const isMain = stage === "MAIN";

  return (
    <>
      <ServiceWorkerRegistrar />
      <AuthListener />
      <AudioEngine />
      <NowPlayingView />
      <PWAInstallPrompt />
      
      <AppFlow>
        <main className={`h-full ${isMain ? 'pb-32' : ''}`}>
          {children}
        </main>

        {isMain && (
          <div className="fixed bottom-0 left-0 right-0 z-50 p-4 space-y-4 pointer-events-none">
            <div className="pointer-events-auto">
              <BottomPlayer />
            </div>
            <div className="pointer-events-auto">
              <BottomNav />
            </div>
          </div>
        )}
      </AppFlow>
    </>
  );
}
