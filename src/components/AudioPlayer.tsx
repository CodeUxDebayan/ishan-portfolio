"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useUIStore } from "@/store/useUIStore";

export function AudioPlayer() {
  const { isAudioPlaying, toggleAudio, setAudioPlaying } = useUIStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element with preload none to avoid initial bandwidth competition
    const audio = new Audio("/audio/bg-music.mp3");
    audio.loop = true;
    audio.volume = 0.45;
    audio.preload = "none";
    audioRef.current = audio;

    const handleEnded = () => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Sync state with audio playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isAudioPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented by browser policy
          setAudioPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isAudioPlaying, setAudioPlaying]);

  return (
    <button
      type="button"
      onClick={toggleAudio}
      aria-label={isAudioPlaying ? "Mute background music" : "Play background music"}
      className="flex items-center gap-2 bg-[#fcfcfc] text-[#100f0c] font-medium rounded-full px-3.5 sm:px-4 py-2 text-xs sm:text-sm hover:bg-white shadow-sm hover:shadow transition-all pointer-events-auto cursor-pointer border border-[#100f0c]/10 group select-none"
    >
      {/* Animated Equalizer Waveform */}
      <div className="flex items-center gap-[2.5px] h-3.5 w-3.5 justify-center">
        <motion.span
          animate={
            isAudioPlaying
              ? { height: ["3px", "12px", "5px", "11px", "3px"] }
              : { height: "3px" }
          }
          transition={
            isAudioPlaying
              ? { repeat: Infinity, duration: 1.1, ease: "easeInOut" }
              : { duration: 0.2 }
          }
          className="w-[2px] bg-[#100f0c] rounded-full"
        />
        <motion.span
          animate={
            isAudioPlaying
              ? { height: ["5px", "14px", "8px", "13px", "5px"] }
              : { height: "6px" }
          }
          transition={
            isAudioPlaying
              ? { repeat: Infinity, duration: 0.9, ease: "easeInOut", delay: 0.15 }
              : { duration: 0.2 }
          }
          className="w-[2px] bg-[#100f0c] rounded-full"
        />
        <motion.span
          animate={
            isAudioPlaying
              ? { height: ["4px", "13px", "6px", "14px", "4px"] }
              : { height: "4px" }
          }
          transition={
            isAudioPlaying
              ? { repeat: Infinity, duration: 1.25, ease: "easeInOut", delay: 0.3 }
              : { duration: 0.2 }
          }
          className="w-[2px] bg-[#100f0c] rounded-full"
        />
        <motion.span
          animate={
            isAudioPlaying
              ? { height: ["3px", "10px", "4px", "9px", "3px"] }
              : { height: "2px" }
          }
          transition={
            isAudioPlaying
              ? { repeat: Infinity, duration: 0.85, ease: "easeInOut", delay: 0.45 }
              : { duration: 0.2 }
          }
          className="w-[2px] bg-[#100f0c] rounded-full"
        />
      </div>

      <span className="tracking-tight text-xs sm:text-sm font-sans">
        {isAudioPlaying ? "sound on" : "sound off"}
      </span>
    </button>
  );
}
