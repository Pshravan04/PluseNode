"use client";

import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/playerStore";

export default function AudioEngine() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { currentTrack, isPlaying, volume, next, prev, setCurrentTime, setDuration, togglePlay } =
    usePlayerStore();

  // Create audio element once
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
    audioRef.current.preload = "auto";

    const audio = audioRef.current;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => next();
    const onError = () => next(); // skip broken tracks

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Change src when track changes
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    audioRef.current.src = currentTrack.audioUrl;
    audioRef.current.load();
    if (isPlaying) audioRef.current.play().catch(() => {});

    // ── Media Session API (lock screen controls) ──────────────────
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        album: currentTrack.album || "PulseNode",
        artwork: [
          { src: currentTrack.albumArt, sizes: "512x512", type: "image/png" },
        ],
      });

      navigator.mediaSession.setActionHandler("play", () => {
        audioRef.current?.play();
        usePlayerStore.getState().resume();
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        audioRef.current?.pause();
        usePlayerStore.getState().pause();
      });
      navigator.mediaSession.setActionHandler("nexttrack", () => {
        usePlayerStore.getState().next();
      });
      navigator.mediaSession.setActionHandler("previoustrack", () => {
        usePlayerStore.getState().prev();
      });
      navigator.mediaSession.setActionHandler("seekto", (details) => {
        if (audioRef.current && details.seekTime != null) {
          audioRef.current.currentTime = details.seekTime;
          setCurrentTime(details.seekTime);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.id]);

  // Sync play/pause state with Media Session
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
      if ("mediaSession" in navigator) navigator.mediaSession.playbackState = "playing";
    } else {
      audioRef.current.pause();
      if ("mediaSession" in navigator) navigator.mediaSession.playbackState = "paused";
    }
  }, [isPlaying]);

  // Sync volume
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  // Seek from store (when user scrubs progress bar)
  useEffect(() => {
    // handled externally via audioRef exposure — see useAudioSeek hook
  }, []);

  // Expose seek capability globally
  useEffect(() => {
    (window as Window & { __pulsenode_seek?: (t: number) => void }).__pulsenode_seek = (t: number) => {
      if (audioRef.current) {
        audioRef.current.currentTime = t;
        setCurrentTime(t);
      }
    };
  }, [setCurrentTime]);

  return null;
}
