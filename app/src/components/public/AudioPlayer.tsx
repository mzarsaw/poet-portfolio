"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { formatDuration } from "@/lib/utils";

interface AudioPlayerProps {
  src: string;
  title: string;
  compact?: boolean;
}

export default function AudioPlayer({ src, title, compact = false }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(Math.floor(audio.currentTime));
    const onLoadedMetadata = () => setDuration(Math.floor(audio.duration));
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    if (!audio) return;
    const value = Number(e.target.value);
    audio.currentTime = value;
    setCurrentTime(value);
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`audio-player ${compact ? "flex items-center gap-3" : "space-y-3"}`}>
      <audio ref={audioRef} src={src} preload="metadata" />

      <button
        onClick={togglePlay}
        className="flex-shrink-0 w-10 h-10 rounded-full bg-accent text-bg flex items-center justify-center hover:opacity-90 transition-opacity"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
      </button>

      <div className={compact ? "flex-1 min-w-0" : ""}>
        {!compact && <p className="text-sm font-medium text-fg">{title}</p>}

        <div className="flex items-center gap-2">
          <span className="text-xs text-fg-muted w-10 text-right">{formatDuration(currentTime)}</span>
          <div className="flex-1 relative">
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full"
              aria-label="Seek"
            />
          </div>
          <span className="text-xs text-fg-muted w-10">{formatDuration(duration)}</span>

          {!compact && (
            <button
              onClick={() => {
                setMuted(!muted);
                if (audioRef.current) audioRef.current.muted = !muted;
              }}
              className="text-fg-muted hover:text-fg"
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
