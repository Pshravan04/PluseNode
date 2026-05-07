"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { usePlayerStore } from "@/store/playerStore";
import { searchArtists } from "@/lib/saavn";
import { UserProfile } from "@/store/types";

const GENRES = [
  "Bollywood", "Pop", "Hip Hop", "Lofi", "Electronic", 
  "Rock", "Classical", "Devotional", "Romantic", "Party", "Soul"
];

const LANGUAGES = [
  "Hindi", "English", "Punjabi", "Tamil", "Telugu", "Marathi", "Bengali", "Kannada"
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    display_name: "",
    username: "",
    country: "India",
    gender: "Other",
    favorite_genres: [],
    language_preferences: ["Hindi", "English"],
    favorite_artists: [],
  });
  const [artistSearch, setArtistSearch] = useState("");
  const [artistResults, setArtistResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleArtistSearch = async (q: string) => {
    setArtistSearch(q);
    if (q.length > 2) {
      const results = await searchArtists(q);
      setArtistResults(results);
    }
  };

  const toggleItem = (list: string[], item: string, key: keyof UserProfile) => {
    const newList = list.includes(item) 
      ? list.filter(i => i !== item)
      : [...list, item];
    setFormData({ ...formData, [key]: newList });
  };

  const handleFinish = async () => {
    setLoading(true);
    // 1. Get current session
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // 2. Save profile to Supabase
      const profile = {
        ...formData,
        id: user.id,
        email: user.email,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profile);

      if (!error) {
        usePlayerStore.getState().setProfile(profile as any);
        router.push("/");
      } else {
        alert("Error saving profile. Check console.");
        console.error(error);
      }
    } else {
      // For local development/testing without real auth
      usePlayerStore.getState().setProfile(formData as any);
      router.push("/");
    }
    setLoading(false);
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-[#1a1a2e] to-[#0d0b1e] flex items-center justify-center p-6 overflow-y-auto">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Welcome to PulseNode</h1>
              <p className="text-muted-foreground">Let's set up your profile.</p>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Display Name"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-violet-500 transition-colors"
                  value={formData.display_name}
                  onChange={e => setFormData({ ...formData, display_name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-violet-500 transition-colors"
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
              <button 
                onClick={nextStep}
                disabled={!formData.display_name || !formData.username}
                className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 py-4 rounded-2xl font-semibold shadow-lg shadow-violet-600/20 transition-all"
              >
                Continue
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold">Personal Info</h2>
              <div className="space-y-4">
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none"
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="text"
                  placeholder="Country"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none"
                  value={formData.country}
                  onChange={e => setFormData({ ...formData, country: e.target.value })}
                />
              </div>
              <div className="flex gap-4">
                <button onClick={prevStep} className="flex-1 bg-white/5 py-4 rounded-2xl font-semibold">Back</button>
                <button onClick={nextStep} className="flex-1 bg-violet-600 py-4 rounded-2xl font-semibold">Continue</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold">Languages</h2>
              <p className="text-muted-foreground text-sm">Select the languages you listen to.</p>
              <div className="grid grid-cols-2 gap-3">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang}
                    onClick={() => toggleItem(formData.language_preferences!, lang, 'language_preferences')}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                      formData.language_preferences?.includes(lang) 
                        ? 'bg-violet-600 border-violet-500 shadow-md shadow-violet-600/20' 
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={prevStep} className="flex-1 bg-white/5 py-4 rounded-2xl font-semibold">Back</button>
                <button onClick={nextStep} className="flex-1 bg-violet-600 py-4 rounded-2xl font-semibold">Continue</button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold">Genres</h2>
              <p className="text-muted-foreground text-sm">What's your vibe?</p>
              <div className="grid grid-cols-3 gap-3">
                {GENRES.map(genre => (
                  <button
                    key={genre}
                    onClick={() => toggleItem(formData.favorite_genres!, genre, 'favorite_genres')}
                    className={`p-3 rounded-xl border text-xs font-medium transition-all ${
                      formData.favorite_genres?.includes(genre) 
                        ? 'bg-violet-600 border-violet-500 shadow-md shadow-violet-600/20' 
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={prevStep} className="flex-1 bg-white/5 py-4 rounded-2xl font-semibold">Back</button>
                <button onClick={nextStep} className="flex-1 bg-violet-600 py-4 rounded-2xl font-semibold">Continue</button>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold">Favorite Artists</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Search artists..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-violet-500"
                  value={artistSearch}
                  onChange={e => handleArtistSearch(e.target.value)}
                />
                <div className="flex flex-wrap gap-2 min-h-[40px]">
                  {formData.favorite_artists?.map(artist => (
                    <span key={artist} className="bg-violet-600/20 text-violet-400 px-3 py-1 rounded-full text-xs border border-violet-500/30 flex items-center gap-2">
                      {artist}
                      <button onClick={() => toggleItem(formData.favorite_artists!, artist, 'favorite_artists')}>×</button>
                    </span>
                  ))}
                </div>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
                  {artistResults.map(artist => (
                    <button
                      key={artist.id}
                      onClick={() => toggleItem(formData.favorite_artists!, artist.name, 'favorite_artists')}
                      className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl transition-colors text-left"
                    >
                      <img src={artist.image?.[0]?.url} className="w-10 h-10 rounded-full object-cover" alt="" />
                      <span className="text-sm">{artist.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={prevStep} className="flex-1 bg-white/5 py-4 rounded-2xl font-semibold">Back</button>
                <button 
                  onClick={handleFinish}
                  disabled={loading}
                  className="flex-1 bg-violet-600 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2"
                >
                  {loading ? 'Setting up...' : 'Start Listening'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 flex justify-center gap-2">
          {[1,2,3,4,5].map(i => (
            <div key={i} className={`h-1 rounded-full transition-all ${i <= step ? 'w-8 bg-violet-600' : 'w-2 bg-white/10'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
