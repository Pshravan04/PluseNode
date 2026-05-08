"use client";

import { usePlayerStore } from "@/store/playerStore";
import { useEffect } from "react";
import AnimatedLoader from "./AnimatedLoader";
import SplashScreen from "./SplashScreen";
import { createClient } from "@/lib/supabase";
import { AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

export default function AppFlow({ children }: { children: React.ReactNode }) {
  const { stage, setStage, setProfile, profile } = usePlayerStore();
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check session and profile on mount and stage changes
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
          // If profile exists and user is logged in
          if (stage === "SPLASH") {
            // Auto-transition to MAIN if they are already logged in after splash
            setStage("MAIN");
            if (pathname !== "/") router.push("/");
          }
        } else {
          // Logged in but no profile
          if (stage === "SPLASH") {
            setStage("ONBOARDING");
            if (pathname !== "/onboarding") router.push("/onboarding");
          }
        }
      }
    }
    
    // Only check if we are in a state that could transition
    if (stage === "LOADER" || stage === "SPLASH") {
      checkUser();
    }
  }, [supabase, setProfile, setStage, pathname, router, stage]);

  // Stage-based routing
  useEffect(() => {
    if (stage === "AUTH" && (pathname === "/" || pathname === "/onboarding")) {
      router.push("/login");
    }
    if (stage === "ONBOARDING" && pathname !== "/onboarding") {
      router.push("/onboarding");
    }
    if (stage === "MAIN" && (pathname === "/login" || pathname === "/signup" || pathname === "/onboarding")) {
      router.push("/");
    }
  }, [stage, pathname, router]);

  return (
    <>
      <AnimatePresence mode="wait">
        {stage === "LOADER" && <AnimatedLoader key="loader" />}
        {stage === "SPLASH" && <SplashScreen key="splash" />}
      </AnimatePresence>
      
      <div style={{ visibility: (stage === "MAIN" || stage === "AUTH" || stage === "ONBOARDING") ? "visible" : "hidden" }}>
        {children}
      </div>
    </>
  );
}
