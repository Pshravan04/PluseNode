export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  audioUrl: string;
  duration: number; // seconds
  genre: string;
  language?: string;
  saavnId?: string;
  hasLyrics?: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  country?: string;
  gender?: string;
  age_group?: string;
  favorite_genres: string[];
  favorite_artists: string[];
  music_moods: string[];
  language_preferences: string[];
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  cover_url?: string;
  owner_id: string;
  is_public: boolean;
  is_collaborative: boolean;
  tracks?: Track[];
  collaborators?: string[];
  created_at: string;
}
