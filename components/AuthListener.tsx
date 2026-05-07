"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { usePlayerStore } from "@/store/playerStore";
import { useRouter, usePathname } from "next/navigation";

export default function AuthListener() {
  const supabase = createClient();
  const setProfile = usePlayerStore((s) => s.setProfile);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Fetch profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          setProfile(profile);
          if (pathname === "/login" || pathname === "/signup") {
            router.push("/");
          }
        } else {
          // If logged in but no profile, send to onboarding
          if (pathname !== "/onboarding") {
            router.push("/onboarding");
          }
        }
      } else {
        // Not logged in
        setProfile(null);
        const publicRoutes = ["/login", "/signup", "/onboarding"];
        if (!publicRoutes.includes(pathname)) {
          // Optional: allow viewing home/search/library without login, 
          // but redirect for specific actions. For now, let's keep it open
          // or force login if you prefer.
        }
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          if (profile) setProfile(profile);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase, setProfile, pathname, router]);

  return null;
}
