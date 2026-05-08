"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { usePlayerStore } from "@/store/playerStore";
import { searchArtists } from "@/lib/saavn";
import { UserProfile } from "@/store/types";
import { ChevronRight, ChevronLeft, Music2, Check, Search, Sparkles, User, Heart, Languages, Radio, MapPin } from "lucide-react";
import BackgroundParticles from "@/components/BackgroundParticles";

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
  const setStage = usePlayerStore((s) => s.setStage);

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
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
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
        setStage("MAIN");
        router.push("/");
      } else {
        console.error("Error saving profile:", error.message);
      }
    } else {
      usePlayerStore.getState().setProfile(formData as any);
      setStage("MAIN");
      router.push("/");
    }
    setLoading(false);
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const StepWrapper = ({ children, title, subtitle, icon: Icon }: { children: React.ReactNode, title: string, subtitle: string, icon: any }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-xl space-y-12"
    >
      <div className="flex flex-col items-center text-center space-y-8">
        <div className="w-28 h-28 glass rounded-[3rem] flex items-center justify-center shadow-2xl relative group overflow-hidden border-2 border-white/10">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-30"
          />
          <Icon className="w-12 h-12 text-white relative z-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
        </div>
        <div className="space-y-4">
          <h1 className="text-7xl font-black text-white leading-[0.8] tracking-tighter font-outfit">
            {title.split(' ').map((word, i) => (
              <span key={i} className={i === title.split(' ').length - 1 ? "text-gradient" : ""}>
                {word}{' '}
              </span>
            ))}
          </h1>
          <p className="text-white/20 text-[12px] font-black tracking-[0.6em] uppercase">{subtitle}</p>
        </div>
      </div>
      <div className="glass-panel p-12 md:p-16 relative overflow-hidden border border-white/10 shadow-[0_60px_120px_rgba(0,0,0,0.7)] rounded-[4rem]">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/10 blur-[120px] opacity-50" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-secondary/10 blur-[120px] opacity-50" />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="fixed inset-0 z-[100] bg-[#030014] flex flex-col items-center justify-center p-6 overflow-hidden">
      <BackgroundParticles />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[20px]" />

      <div className="w-full max-w-xl relative z-10 flex flex-col min-h-[750px]">
        {/* Cinematic Progress Timeline */}
        <div className="flex gap-4 mb-20 px-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div 
              key={i} 
              className={`h-2.5 rounded-full transition-all duration-1000 ease-[0.16,1,0.3,1] relative overflow-hidden ${
                i === step 
                  ? 'flex-[6] bg-white shadow-[0_0_40px_rgba(255,255,255,0.4)]' 
                  : i < step ? 'flex-1 bg-primary/40' : 'flex-1 bg-white/5'
              }`} 
            >
              {i === step && (
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <StepWrapper key="s1" icon={User} title="Your Identity." subtitle="DESIGN YOUR SONIC AVATAR">
                <div className="space-y-10">
                  <div className="space-y-5">
                    <label className="text-[12px] font-black text-white/10 uppercase tracking-[0.5em] ml-3">Display Name</label>
                    <div className="relative group/input">
                      <User className="absolute left-8 top-1/2 -translate-y-1/2 w-7 h-7 text-white/10 group-focus-within/input:text-primary transition-all group-focus-within/input:scale-110" />
                      <input
                        type="text"
                        placeholder="e.g. Maverick"
                        className="w-full glass bg-white/[0.01] border-white/5 rounded-[2.5rem] py-8 pl-20 pr-10 outline-none focus:border-primary/50 focus:bg-white/[0.04] focus:shadow-[0_0_60px_rgba(139,92,246,0.1)] transition-all text-white text-2xl font-black placeholder:text-white/5"
                        value={formData.display_name}
                        onChange={e => setFormData({ ...formData, display_name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-5">
                    <label className="text-[12px] font-black text-white/10 uppercase tracking-[0.5em] ml-3">Username</label>
                    <div className="relative group/input">
                      <span className="absolute left-8 top-1/2 -translate-y-1/2 text-white/10 font-black text-3xl group-focus-within/input:text-secondary transition-all group-focus-within/input:scale-110">@</span>
                      <input
                        type="text"
                        placeholder="pulse_zero"
                        className="w-full glass bg-white/[0.01] border-white/5 rounded-[2.5rem] py-8 pl-18 pr-10 outline-none focus:border-secondary/50 focus:bg-white/[0.04] focus:shadow-[0_0_60px_rgba(219,39,119,0.1)] transition-all text-white text-2xl font-black placeholder:text-white/5"
                        value={formData.username}
                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <button 
                  onClick={nextStep}
                  disabled={!formData.display_name || !formData.username}
                  className="w-full mt-16 bg-white text-black py-8 rounded-[2.5rem] font-black text-3xl flex items-center justify-center gap-6 shadow-[0_30px_60px_rgba(255,255,255,0.15)] hover:scale-[1.03] active:scale-[0.97] transition-all disabled:opacity-10 disabled:scale-100 group"
                >
                  Continue <ChevronRight className="w-10 h-10 group-hover:translate-x-3 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
                </button>
              </StepWrapper>
            )}

            {step === 2 && (
              <StepWrapper key="s2" icon={Heart} title="Deep Core." subtitle="AUTHENTIC PARAMETERS">
                <div className="space-y-12">
                  <div className="space-y-6">
                    <label className="text-[12px] font-black text-white/10 uppercase tracking-[0.5em] block text-center">Gender Archetype</label>
                    <div className="grid grid-cols-3 gap-6">
                      {["Male", "Female", "Other"].map(g => (
                        <button
                          key={g}
                          onClick={() => setFormData({ ...formData, gender: g })}
                          className={`py-8 rounded-3xl border-2 font-black transition-all text-lg relative overflow-hidden ${
                            formData.gender === g 
                              ? 'bg-white border-white text-black shadow-[0_20px_40px_rgba(255,255,255,0.2)]' 
                              : 'glass bg-white/[0.01] border-white/5 text-white/10 hover:text-white/40 hover:border-white/20'
                          }`}
                        >
                          <span className="relative z-10">{g}</span>
                          {formData.gender === g && (
                            <motion.div 
                              layoutId="gender-glow"
                              className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 opacity-40"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <label className="text-[12px] font-black text-white/10 uppercase tracking-[0.5em] ml-3">Location Node</label>
                    <div className="relative group/input">
                      <MapPin className="absolute left-8 top-1/2 -translate-y-1/2 w-7 h-7 text-white/10 group-focus-within/input:text-accent transition-all group-focus-within/input:scale-110" />
                      <input
                        type="text"
                        placeholder="Global Station"
                        className="w-full glass bg-white/[0.01] border-white/5 rounded-[2.5rem] py-8 pl-20 pr-10 outline-none focus:border-accent/50 focus:bg-white/[0.04] text-white text-2xl font-black placeholder:text-white/5"
                        value={formData.country}
                        onChange={e => setFormData({ ...formData, country: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-6 mt-16">
                  <button onClick={prevStep} className="flex-1 glass bg-white/[0.01] border-white/5 py-8 rounded-[2.5rem] font-black text-white/10 text-xl hover:bg-white/5 hover:text-white transition-all">Back</button>
                  <button onClick={nextStep} className="flex-[3] bg-white text-black py-8 rounded-[2.5rem] font-black text-3xl flex items-center justify-center gap-6 shadow-[0_30px_60px_rgba(255,255,255,0.1)] hover:scale-[1.03] transition-all">
                    Synchronize <ChevronRight className="w-10 h-10" />
                  </button>
                </div>
              </StepWrapper>
            )}

            {step === 3 && (
              <StepWrapper key="s3" icon={Languages} title="Linguistics." subtitle="SONIC DIALECT PREFERENCES">
                <div className="grid grid-cols-2 gap-5 max-h-[400px] overflow-y-auto pr-4 scrollbar-hide py-2">
                  {LANGUAGES.map(lang => {
                    const isSelected = formData.language_preferences?.includes(lang);
                    return (
                      <button
                        key={lang}
                        onClick={() => toggleItem(formData.language_preferences!, lang, 'language_preferences')}
                        className={`p-8 rounded-[2.5rem] border-2 font-black transition-all flex items-center justify-between text-xl relative group/lang ${
                           isSelected 
                            ? 'bg-primary border-primary text-white shadow-[0_20px_50px_rgba(124,58,237,0.4)]' 
                            : 'glass bg-white/[0.01] border-white/5 text-white/10 hover:border-white/20 hover:text-white/40'
                        }`}
                      >
                        <span className="relative z-10">{lang}</span>
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 45 }}>
                              <Check className="w-7 h-7 text-white" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                        {isSelected && (
                          <motion.div 
                            animate={{ opacity: [0.2, 0.4, 0.2] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-6 mt-16">
                  <button onClick={prevStep} className="flex-1 glass bg-white/[0.01] border-white/5 py-8 rounded-[2.5rem] font-black text-white/10 text-xl hover:text-white transition-all">Back</button>
                  <button onClick={nextStep} className="flex-[3] bg-white text-black py-8 rounded-[2.5rem] font-black text-3xl flex items-center justify-center gap-6 shadow-[0_30px_60px_rgba(255,255,255,0.1)] hover:scale-[1.03] transition-all">Next Step <ChevronRight className="w-10 h-10" /></button>
                </div>
              </StepWrapper>
            )}

            {step === 4 && (
              <StepWrapper key="s4" icon={Radio} title="Vibe Map." subtitle="DEFINE YOUR SPECTRE">
                <div className="grid grid-cols-2 gap-5 max-h-[400px] overflow-y-auto pr-4 scrollbar-hide py-2">
                  {GENRES.map(genre => {
                    const isSelected = formData.favorite_genres?.includes(genre);
                    return (
                      <button
                        key={genre}
                        onClick={() => toggleItem(formData.favorite_genres!, genre, 'favorite_genres')}
                        className={`p-8 rounded-[2.5rem] border-2 font-black transition-all flex items-center justify-between text-xl relative overflow-hidden ${
                           isSelected 
                            ? 'bg-secondary border-secondary text-white shadow-[0_20px_50px_rgba(219,39,119,0.3)]' 
                            : 'glass bg-white/[0.01] border-white/5 text-white/10 hover:border-white/20 hover:text-white/40'
                        }`}
                      >
                        <span className="relative z-10">{genre}</span>
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div initial={{ scale: 0, x: 20 }} animate={{ scale: 1, x: 0 }} exit={{ scale: 0, x: 20 }}>
                              <Sparkles className="w-7 h-7 text-white" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-6 mt-16">
                  <button onClick={prevStep} className="flex-1 glass bg-white/[0.01] border-white/5 py-8 rounded-[2.5rem] font-black text-white/10 text-xl hover:text-white transition-all">Back</button>
                  <button onClick={nextStep} className="flex-[3] bg-white text-black py-8 rounded-[2.5rem] font-black text-3xl flex items-center justify-center gap-6 shadow-[0_30px_60px_rgba(255,255,255,0.1)] hover:scale-[1.03] transition-all">Continue <ChevronRight className="w-10 h-10" /></button>
                </div>
              </StepWrapper>
            )}

            {step === 5 && (
              <StepWrapper key="s5" icon={Music2} title="Inspirations." subtitle="FOLLOW YOUR SONIC GUIDES">
                <div className="space-y-10">
                  <div className="relative group/search">
                    <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-7 h-7 text-white/10 group-focus-within/search:text-primary transition-all group-focus-within/search:scale-110" />
                    <input
                      type="text"
                      placeholder="Search for artists..."
                      className="w-full glass bg-white/[0.01] border-white/5 rounded-[2.5rem] py-8 pl-20 pr-10 outline-none focus:border-primary/50 focus:bg-white/[0.04] focus:shadow-[0_0_60px_rgba(139,92,246,0.1)] transition-all text-white text-2xl font-black placeholder:text-white/5"
                      value={artistSearch}
                      onChange={e => handleArtistSearch(e.target.value)}
                    />
                  </div>
                  
                  <AnimatePresence>
                    {formData.favorite_artists?.length! > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex flex-wrap gap-4 max-h-32 overflow-y-auto scrollbar-hide py-2"
                      >
                        {formData.favorite_artists?.map(artist => (
                          <motion.span 
                            key={artist}
                            initial={{ scale: 0, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white text-black px-6 py-4 rounded-3xl text-sm font-black flex items-center gap-4 shadow-2xl border-2 border-white"
                          >
                            {artist}
                            <button onClick={() => toggleItem(formData.favorite_artists!, artist, 'favorite_artists')} className="hover:text-secondary transition-colors text-xl">×</button>
                          </motion.span>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="max-h-[300px] overflow-y-auto space-y-5 pr-4 scrollbar-hide py-2">
                    {artistResults.map(artist => {
                      const isSelected = formData.favorite_artists?.includes(artist.name);
                      return (
                        <motion.button
                          key={artist.id}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          onClick={() => toggleItem(formData.favorite_artists!, artist.name, 'favorite_artists')}
                          className={`w-full flex items-center gap-6 p-6 rounded-[2.5rem] transition-all text-left border-2 relative overflow-hidden ${
                            isSelected
                              ? 'bg-primary/15 border-primary/40 shadow-[0_15px_40px_rgba(139,92,246,0.15)]'
                              : 'glass bg-white/[0.01] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
                          }`}
                        >
                          <div className="relative">
                            <img src={artist.image?.[artist.image.length-1]?.url} className="w-20 h-20 rounded-[2rem] object-cover border-2 border-white/10 shadow-2xl" alt="" />
                            {isSelected && (
                              <motion.div 
                                initial={{ scale: 0 }} 
                                animate={{ scale: 1 }} 
                                className="absolute -top-3 -right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-2xl z-20"
                              >
                                <Check className="w-6 h-6 text-primary" />
                              </motion.div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-black text-white text-2xl leading-tight">{artist.name}</p>
                            <p className="text-[12px] text-white/20 font-black uppercase tracking-[0.3em] mt-2">{artist.type || 'Artist'}</p>
                          </div>
                        </motion.button>
                      );
                    })}
                    {artistResults.length === 0 && !artistSearch && (
                      <div className="text-center py-20 bg-white/[0.01] rounded-[3.5rem] border-2 border-dashed border-white/5 group">
                        <motion.div
                          animate={{ rotate: [0, 15, -15, 0] }}
                          transition={{ duration: 5, repeat: Infinity }}
                        >
                          <Music2 className="w-20 h-20 text-white/5 mx-auto mb-8 group-hover:text-white/10 transition-colors" />
                        </motion.div>
                        <p className="text-white/10 font-black text-xl tracking-tight uppercase tracking-[0.3em]">Seek your idols</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-6 mt-16">
                  <button onClick={prevStep} className="flex-1 glass bg-white/[0.01] border-white/5 py-8 rounded-[2.5rem] font-black text-white/10 text-xl hover:text-white transition-all">Back</button>
                  <button 
                    onClick={handleFinish}
                    disabled={loading || formData.favorite_artists?.length === 0}
                    className="flex-[3] bg-gradient-to-br from-white to-white/90 py-8 rounded-[2.5rem] font-black text-3xl text-black flex items-center justify-center gap-6 shadow-[0_30px_60px_rgba(255,255,255,0.15)] disabled:opacity-5 disabled:scale-100 hover:scale-[1.03] active:scale-[0.97] transition-all relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative z-10">{loading ? 'Calibrating...' : 'Launch Pulse'}</span>
                    {!loading && <Sparkles className="w-10 h-10 text-secondary animate-pulse relative z-10" />}
                  </button>
                </div>
              </StepWrapper>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>

  );
}
