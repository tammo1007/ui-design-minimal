import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Play, Volume2, VolumeX } from "./icons";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "./hooks";

export interface VideoSource {
  src: string;
  /** e.g. "(min-width: 768px)": first matching source wins */
  media?: string;
  type?: string;
}

interface VideoPanelProps {
  sources: VideoSource[];
  poster: string;
  /** accessible name, e.g. "Our team introduces the product" */
  title: string;
  /** label on the play button */
  label?: string;
  /** e.g. "0:56" next to the label */
  duration?: string;
  /** muted inline preview while in view (only for videos with burned-in subtitles) */
  preview?: boolean;
  className?: string;
}

/**
 * Film panel (always the full 16 : 9 frame: never cropped; narrows on short, wide screens so it fits
 * below the nav; r 28 / 20). While in view it plays as a muted, looping preview
 * (subtitles carry the message); the Liquid Glass play button restarts it from 0:00 with sound.
 * Corner control: sound on/off. Click the film to pause/resume. Thin progress line at the bottom.
 * Reduced motion: no preview: poster + play button only.
 */
export function VideoPanel({ sources, poster, title, label = "Play film", duration, preview = true, className }: VideoPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const [mode, setMode] = useState<"preview" | "film">("preview");
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const reduce = usePrefersReducedMotion();
  const modeRef = useRef(mode);
  modeRef.current = mode;

  // preview: play muted while ≥ 35 % visible; anything leaves the viewport → pause
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) {
          v.pause();
          return;
        }
        if (modeRef.current === "preview" && preview && !reduce) {
          v.muted = true;
          v.play().catch(() => undefined);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [preview, reduce]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onVolume = () => setMuted(v.muted);
    const onTime = () => {
      if (progressRef.current && v.duration) progressRef.current.style.transform = `scaleX(${v.currentTime / v.duration})`;
    };
    const onEnded = () => {
      setMode("preview");
      v.muted = true;
    };
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("volumechange", onVolume);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnded);
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("volumechange", onVolume);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnded);
    };
  }, []);

  const playFilm = () => {
    const v = videoRef.current;
    if (!v) return;
    if (modeRef.current === "preview") v.currentTime = 0;
    setMode("film");
    v.loop = false;
    v.muted = false;
    v.play().catch(() => {
      // autoplay with sound blocked → play muted, the corner control turns sound on
      v.muted = true;
      v.play().catch(() => undefined);
    });
  };

  const togglePause = () => {
    const v = videoRef.current;
    if (!v) return;
    if (modeRef.current !== "film") return playFilm();
    if (v.paused) v.play().catch(() => undefined);
    else v.pause();
  };

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.muted && modeRef.current === "preview") {
      // sound on during the preview: keep the position, continue as the film
      setMode("film");
      v.loop = false;
    }
    v.muted = !v.muted;
    if (v.paused) v.play().catch(() => undefined);
  };

  const showPlay = mode === "preview" || !playing;

  return (
    <div className={cn("lg-video", className)}>
      <video
        ref={videoRef}
        className="lg-video__media"
        poster={poster}
        playsInline
        muted
        loop={mode === "preview"}
        preload="metadata"
        aria-label={title}
        onClick={togglePause}
      >
        {sources.map((s) => (
          <source key={s.src} src={s.src} media={s.media} type={s.type ?? "video/mp4"} />
        ))}
      </video>

      <button
        type="button"
        className="lg-glass lg-video__play"
        data-hidden={!showPlay}
        onClick={playFilm}
        aria-label={mode === "preview" ? `${label}${duration ? ` (${duration})` : ""} with sound` : "Resume film"}
        tabIndex={showPlay ? 0 : -1}
      >
        <span className="lg-video__disc">
          <Play className="size-5 translate-x-px fill-current" strokeWidth={1.5} />
        </span>
        <span className="hidden flex-col items-start pr-1 sm:flex">
          <span className="text-body font-medium text-ink">{mode === "preview" ? label : "Resume"}</span>
          {duration ? <span className="text-caption tabular-nums text-ink-2">{duration} · with sound</span> : null}
        </span>
      </button>

      <button
        type="button"
        className="lg-glass lg-video__sound"
        onClick={toggleSound}
        aria-label={muted ? "Turn sound on" : "Turn sound off"}
        aria-pressed={!muted}
      >
        {muted ? <VolumeX className="size-[1.125rem]" /> : <Volume2 className="size-[1.125rem]" />}
      </button>

      <span className="lg-video__progress" aria-hidden="true">
        <span ref={progressRef} style={{ transform: "scaleX(0)" } as CSSProperties} />
      </span>
    </div>
  );
}
