"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tombol musik latar. Mulai diputar saat undangan dibuka (`autoPlay`),
 * karena klik tombol "Buka Undangan" adalah gesture yang diizinkan browser.
 * Bila file mp3 tidak ada, tombol otomatis disembunyikan.
 */
export function MusicPlayer({
  autoPlay,
  src,
}: {
  autoPlay: boolean;
  src: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);

  // Mulai memutar begitu undangan dibuka.
  useEffect(() => {
    if (!autoPlay) return;
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.55;
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false)); // diblokir browser — user bisa tekan manual
  }, [autoPlay]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  if (!available) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setAvailable(false)}
      />

      {autoPlay ? (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Hentikan musik" : "Putar musik"}
          className="fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full border border-edge bg-panel/85 text-gold shadow-lg backdrop-blur-sm transition hover:border-amber/60 hover:bg-panel active:scale-95"
        >
          <svg
            viewBox="0 0 24 24"
            className={`h-5 w-5 ${playing ? "spin-slow" : ""}`}
            fill="currentColor"
            aria-hidden
          >
            {playing ? (
              <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z" />
            ) : (
              <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6ZM3 3l18 18-1.4 1.4L1.6 4.4 3 3Z" />
            )}
          </svg>
        </button>
      ) : null}
    </>
  );
}
