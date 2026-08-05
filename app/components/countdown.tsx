"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { loadGsap, prefersReducedMotion } from "../lib/gsap";

type Remaining = { days: number; hours: number; minutes: number; seconds: number };

const ZERO: Remaining = { days: 0, hours: 0, minutes: 0, seconds: 0 };

function remainingFrom(nowSeconds: number, target: number): Remaining {
  const diff = target - nowSeconds * 1000;
  if (diff <= 0) return ZERO;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/* Detik berjalan diperlakukan sebagai "external store" — cara idiomatik React
   untuk data yang berubah di luar React (di sini: jam sistem). Di server nilainya
   0 sehingga HTML awal identik dengan hasil hydration. */
function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 1000);
  return () => clearInterval(id);
}
const getSnapshot = () => Math.floor(Date.now() / 1000);
const getServerSnapshot = () => 0;

/**
 * Satu kotak angka. Nilai lama digeser ke atas dan nilai baru masuk dari
 * bawah, jadi perubahan angka terasa seperti papan jadwal yang berputar.
 */
function Unit({ label, value }: { label: string; value: number }) {
  const text = String(value).padStart(2, "0");
  const digitRef = useRef<HTMLDivElement>(null);
  const previous = useRef(text);

  useEffect(() => {
    if (previous.current === text) return;
    previous.current = text;

    const el = digitRef.current;
    if (!el || prefersReducedMotion()) return;

    let cancelled = false;
    loadGsap().then(({ gsap }) => {
      if (cancelled || !digitRef.current) return;
      gsap.fromTo(
        digitRef.current,
        { yPercent: 55, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
      );
    });

    return () => {
      cancelled = true;
    };
  }, [text]);

  return (
    <div className="relative min-w-[4.2rem] overflow-hidden rounded-xl border border-edge bg-panel/60 px-2 py-3.5 backdrop-blur-md sm:min-w-[5.5rem] sm:px-4 sm:py-5">
      {/* Kilau tipis di tepi atas kotak */}
      <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-amber/50 to-transparent" />

      <div
        ref={digitRef}
        className="font-display text-3xl font-light tabular-nums text-parchment sm:text-5xl"
        suppressHydrationWarning
      >
        {text}
      </div>
      <div className="mt-1.5 text-[0.68rem] uppercase tracking-[0.18em] text-muted sm:text-xs">
        {label}
      </div>
    </div>
  );
}

export function Countdown({ target }: { target: string }) {
  const nowSeconds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const targetMs = new Date(target).getTime();
  const time = nowSeconds === 0 ? ZERO : remainingFrom(nowSeconds, targetMs);

  const units = [
    { label: "Hari", value: time.days },
    { label: "Jam", value: time.hours },
    { label: "Menit", value: time.minutes },
    { label: "Detik", value: time.seconds },
  ];

  return (
    <div className="flex items-stretch justify-center gap-2.5 sm:gap-4">
      {units.map((unit) => (
        <Unit key={unit.label} label={unit.label} value={unit.value} />
      ))}
    </div>
  );
}
