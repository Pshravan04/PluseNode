import { createClient } from "./supabase";
import { Playlist, Track } from "@/store/types";

export async function getUserPlaylists(userId: string): Promise<Playlist[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("playlists")
    .select("*, playlist_tracks(*)")
    .or(`owner_id.eq.${userId},collaborators.cs.{${userId}}`)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data as any;
}

export async function createPlaylist(name: string, userId: string, isCollaborative = false): Promise<Playlist | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("playlists")
    .insert({
      name,
      owner_id: userId,
      is_collaborative: isCollaborative,
      collaborators: isCollaborative ? [userId] : [],
      is_public: true,
    })
    .select()
    .single();

  if (error) return null;
  return data;
}

export async function addTrackToPlaylist(playlistId: string, track: Track): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("playlist_tracks")
    .insert({
      playlist_id: playlistId,
      track_id: track.id,
      track_data: track,
    });

  return !error;
}

export async function removeTrackFromPlaylist(playlistId: string, trackId: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("playlist_tracks")
    .delete()
    .match({ playlist_id: playlistId, track_id: trackId });

  return !error;
}

export async function addCollaborator(playlistId: string, username: string): Promise<{ success: boolean; message: string }> {
  const supabase = createClient();
  
  // 1. Find user by username
  const { data: userData, error: userError } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .single();

  if (userError || !userData) return { success: false, message: "User not found" };

  // 2. Get current collaborators
  const { data: playlistData, error: playlistError } = await supabase
    .from("playlists")
    .select("collaborators")
    .eq("id", playlistId)
    .single();

  if (playlistError) return { success: false, message: "Playlist not found" };

  const currentCollabs = playlistData.collaborators || [];
  if (currentCollabs.includes(userData.id)) return { success: true, message: "User is already a collaborator" };

  // 3. Update collaborators
  const { error: updateError } = await supabase
    .from("playlists")
    .update({ collaborators: [...currentCollabs, userData.id], is_collaborative: true })
    .eq("id", playlistId);

  if (updateError) return { success: false, message: "Failed to add collaborator" };
  return { success: true, message: "Collaborator added!" };
}
