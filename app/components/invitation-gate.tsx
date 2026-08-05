"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { InvitationConfig } from "../config";
import { refreshScrollTriggers } from "../lib/gsap";
import { FallingLeaves } from "./falling-leaves";
import { Divider } from "./ornaments";
import { MusicPlayer } from "./music-player";
import { SmoothScroll } from "./smooth-scroll";

/* Query string dibaca lewat useSyncExternalStore: saat render di server
   nilainya "" lalu React otomatis render ulang di browser dengan nilai asli —
   jadi tidak ada hydration mismatch dan nama tamu tetap muncul. */
const subscribeNoop = () => () => {};
const getSearch = () => window.location.search;
const getServerSearch = () => "";

/** Nama tamu dari URL: ?to=Nama%20Tamu (atau ?kepada=). */
function useGuestName(): string | null {
  const search = useSyncExternalStore(subscribeNoop, getSearch, getServerSearch);
  if (!search) return null;
  const params = new URLSearchParams(search);
  const to = params.get("to") ?? params.get("kepada");
  return to ? to.trim().slice(0, 60) : null;
}

/**
 * Layar sampul. Selama belum dibuka, scroll dikunci dan isi undangan
 * disembunyikan — persis seperti undangan digital pada umumnya.
 */
export function InvitationGate({
  cfg,
  children,
}: {
  cfg: InvitationConfig;
  children: React.ReactNode;
}) {
  const [opened, setOpened] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const guest = useGuestName();

  // Kunci scroll selama sampul masih tampil (native + Lenis).
  useEffect(() => {
    document.body.classList.toggle("is-locked", !opened);
    const lenis = window.__lenis;
    if (lenis) {
      if (opened) lenis.start();
      else lenis.stop();
    }
    return () => document.body.classList.remove("is-locked");
  }, [opened]);

  /* Selama sampul tertutup, isi undangan punya tinggi 0 sehingga semua
     ScrollTrigger terhitung di posisi yang salah. Setelah dibuka, tunggu
     layout benar-benar ter-render lalu ukur ulang. */
  useEffect(() => {
    if (!opened) return;
    const id = window.setTimeout(() => void refreshScrollTriggers(), 120);
    return () => window.clearTimeout(id);
  }, [opened]);

  function open() {
    setLeaving(true); // animasi sampul naik
    window.setTimeout(() => {
      setOpened(true);
      window.__lenis?.scrollTo(0, { immediate: true });
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 900);
  }

  return (
    <>
      {/* Lenis hanya diaktifkan setelah undangan dibuka */}
      {opened ? <SmoothScroll /> : null}
      <MusicPlayer autoPlay={opened} src={cfg.music.src} />

      {/* ---------- ISI UNDANGAN ---------- */}
      <div
        className={
          opened
            ? "opacity-100 transition-opacity duration-1000"
            : "pointer-events-none h-0 overflow-hidden opacity-0"
        }
        aria-hidden={!opened}
      >
        {children}
      </div>

      {/* ---------- SAMPUL ---------- */}
      {!opened ? (
        <div
          className={`fixed inset-0 z-50 overflow-hidden bg-ink transition-all duration-[900ms] ease-[cubic-bezier(0.7,0,0.3,1)] ${
            leaving ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          {/* Foto latar */}
          <Image
            src={cfg.coverPhoto}
            alt=""
            fill
            sizes="100vw"
            quality={90}
            loading="eager"
            fetchPriority="high"
            className="slow-zoom object-cover object-center"
          />

          {/* Gradasi gelap agar teks terbaca */}
          <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/60 to-ink/95" />
          <div className="absolute inset-0 bg-gradient-to-t from-ember/25 via-transparent to-transparent" />

          <FallingLeaves />

          {/* Konten sampul */}
          <div className="vignette grain relative flex h-full flex-col items-center justify-center px-6 py-10 text-center">
            <p className="text-[0.7rem] uppercase tracking-[0.4em] text-sand sm:text-sm">
              The Wedding of
            </p>

            <Divider className="my-5 opacity-70" />

            <h1 className="font-script text-6xl leading-[1.05] text-gilded drop-shadow-[0_2px_18px_rgba(0,0,0,0.6)] sm:text-8xl">
              {cfg.couple.brideShort}
              <span className="mx-1.5">&</span>
              {cfg.couple.groomShort}
            </h1>

            <p className="mt-6 font-display text-lg font-light tracking-[0.3em] text-sand sm:text-2xl">
              {cfg.dateText}
            </p>

            {/* Sapaan tamu */}
            <div className="mt-9 space-y-1.5">
              <p className="text-[0.75rem] uppercase tracking-[0.25em] text-muted">
                Kepada Bapak / Ibu / Saudara / i
              </p>
              <p className="font-display text-2xl font-normal text-parchment sm:text-3xl">
                {guest ?? "Tamu Undangan"}
              </p>
            </div>

            {/* Nama pengundang — hanya ada di mode QNET */}
            {cfg.host ? (
              <div className="mt-6 rounded-xl border border-edge bg-panel/70 px-6 py-3 backdrop-blur-sm">
                <p className="text-[0.68rem] uppercase tracking-[0.28em] text-amber">
                  {cfg.host.label}
                </p>
                <p className="mt-1 font-display text-xl text-parchment sm:text-2xl">
                  {cfg.host.name}
                </p>
              </div>
            ) : null}

            <button
              type="button"
              onClick={open}
              className="pulse-ring mt-8 inline-flex items-center gap-2.5 rounded-full border border-amber/50 bg-panel/80 px-8 py-4 text-[0.8rem] font-medium uppercase tracking-[0.22em] text-gold shadow-xl backdrop-blur-sm transition duration-300 hover:border-amber hover:bg-panel hover:tracking-[0.3em] active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1.2l-10 5.6L2 7.2V6Zm0 3.5V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9.5l-10 5.6L2 9.5Z" />
              </svg>
              Buka Undangan
            </button>

            <p className="mt-6 max-w-xs text-[0.78rem] leading-relaxed text-muted">
              Mohon maaf apabila ada kesalahan penulisan nama dan gelar
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
