// JioSaavn API wrapper (saavn.dev)
// Covers: Hindi, English, Punjabi, Tamil, Telugu, Bengali, Kannada, Marathi, Malayalam + more

const BASE_URL = "https://saavn.dev/api";

export interface SaavnSong {
  id: string;
  name: string;
  year: string;
  duration: string;
  label: string;
  primaryArtists: string;
  featuredArtists: string;
  explicitContent: number;
  playCount: string;
  language: string;
  hasLyrics: string;
  url: string;
  copyright: string;
  album: { id: string; name: string; url: string };
  image: Array<{ quality: string; url: string }>;
  downloadUrl: Array<{ quality: string; url: string }>;
  artists: {
    primary: Array<{ id: string; name: string; image: Array<{ quality: string; url: string }> }>;
  };
}

export interface SaavnArtist {
  id: string;
  name: string;
  image: Array<{ quality: string; url: string }>;
  followerCount: string;
  isVerified: boolean;
  dominantLanguage: string;
  dominantType: string;
}

// Get best image URL (prefer 500x500)
export function getBestImage(images: Array<{ quality: string; url: string }>): string {
  const preferred = images?.find((i) => i.quality === "500x500" || i.quality === "high");
  return preferred?.url || images?.[0]?.url || "/pulsenode-logo.png";
}

// Get best audio URL (prefer 320kbps)
export function getBestAudio(urls: Array<{ quality: string; url: string }>): string {
  const preferred = urls?.find((u) => u.quality === "320kbps") ||
    urls?.find((u) => u.quality === "160kbps") ||
    urls?.[0];
  return preferred?.url || "";
}

// Convert JioSaavn song to our Track format
import { Track } from "@/store/types";
export function toTrack(song: SaavnSong): Track {
  return {
    id: song.id,
    title: song.name,
    artist: song.primaryArtists || song.artists?.primary?.map((a) => a.name).join(", ") || "Unknown",
    album: song.album?.name || "",
    albumArt: getBestImage(song.image),
    audioUrl: getBestAudio(song.downloadUrl),
    duration: parseInt(song.duration) || 180,
    genre: song.language || "Unknown",
    language: song.language,
    saavnId: song.id,
    hasLyrics: song.hasLyrics === "true",
  };
}

// Search songs
export async function searchSongs(query: string, limit = 20, page = 1): Promise<Track[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/search/songs?query=${encodeURIComponent(query)}&limit=${limit}&page=${page}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.data?.results || []).map(toTrack);
  } catch {
    return [];
  }
}

// Search artists
export async function searchArtists(query: string, limit = 10): Promise<SaavnArtist[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/search/artists?query=${encodeURIComponent(query)}&limit=${limit}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data?.data?.results || [];
  } catch {
    return [];
  }
}

// Get trending songs by language/genre query
export async function getTrendingSongs(language = "hindi", limit = 20): Promise<Track[]> {
  const queries: Record<string, string> = {
    hindi: "top hindi songs 2024",
    english: "top english songs 2024",
    punjabi: "top punjabi songs 2024",
    tamil: "top tamil songs 2024",
    telugu: "top telugu songs 2024",
    bollywood: "bollywood hits 2024",
    lofi: "lofi chill beats",
    romantic: "romantic hindi songs",
    party: "party songs dance hits",
    devotional: "bhajans devotional songs",
  };
  return searchSongs(queries[language] || language, limit);
}

// Get song details by ID
export async function getSongById(id: string): Promise<Track | null> {
  try {
    const res = await fetch(`${BASE_URL}/songs/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    const song = data?.data?.[0];
    return song ? toTrack(song) : null;
  } catch {
    return null;
  }
}

// Get songs by artist ID
export async function getArtistSongs(artistId: string, limit = 20): Promise<Track[]> {
  try {
    const res = await fetch(`${BASE_URL}/artists/${artistId}/songs?limit=${limit}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.data?.songs || []).map(toTrack);
  } catch {
    return [];
  }
}

// Get personalized recommendations based on user preferences
export async function getRecommendations(prefs: {
  genres: string[];
  languages: string[];
  artists: string[];
}): Promise<{ title: string; tracks: Track[] }[]> {
  const sections: { title: string; query: string }[] = [];

  if (prefs.languages.includes("hindi") || prefs.languages.length === 0) {
    sections.push({ title: "🔥 Trending in India", query: "top hindi songs 2024" });
    sections.push({ title: "💕 Bollywood Hits", query: "bollywood superhits arijit singh" });
  }
  if (prefs.languages.includes("english")) {
    sections.push({ title: "🌍 International Hits", query: "top english songs 2024 billboard" });
  }
  if (prefs.languages.includes("punjabi")) {
    sections.push({ title: "🎉 Punjabi Bangers", query: "top punjabi songs 2024 diljit" });
  }
  if (prefs.languages.includes("tamil")) {
    sections.push({ title: "🎵 Tamil Hits", query: "top tamil songs 2024" });
  }
  if (prefs.languages.includes("telugu")) {
    sections.push({ title: "🎶 Telugu Hits", query: "top telugu songs 2024" });
  }
  if (prefs.genres.includes("lofi")) {
    sections.push({ title: "😌 Lo-Fi Vibes", query: "lofi chill beats study music" });
  }
  if (prefs.genres.includes("devotional")) {
    sections.push({ title: "🙏 Devotional", query: "bhajans aarti devotional songs" });
  }
  if (prefs.artists.length > 0) {
    sections.push({ title: `🎤 Based on your fav artists`, query: prefs.artists[0] });
  }

  // Always add these
  sections.push({ title: "🌙 Late Night Chill", query: "night drive chill lofi songs" });
  sections.push({ title: "💪 Workout Energy", query: "workout gym songs high energy" });

  const results = await Promise.all(
    sections.slice(0, 5).map(async (s) => ({
      title: s.title,
      tracks: await searchSongs(s.query, 10),
    }))
  );

  return results.filter((r) => r.tracks.length > 0);
}
