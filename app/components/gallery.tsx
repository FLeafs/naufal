"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { InvitationConfig } from "../config";
import { useAnim } from "../lib/use-anim";

/**
 * Deretan foto yang bergeser horizontal mengikuti scroll vertikal.
 *
 * Tidak memakai `pin` ScrollTrigger — pinning bersama Lenis mudah terasa
 * tersendat di HP. Cukup menggeser track-nya, arah gerak baru sudah cukup
 * untuk memecah kesan halaman yang cuma turun lurus.
 */
export function GalleryStrip({
  photos,
  alt,
}: {
  photos: readonly string[];
  alt: string;
}) {
  const ref = useAnim<HTMLDivElement>(({ gsap, el }) => {
    const track = el.querySelector<HTMLElement>("[data-track]");
    if (!track) return;

    const distance = track.scrollWidth - el.clientWidth;
    if (distance <= 0) return;

    gsap.fromTo(
      track,
      { x: 0 },
      {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      },
    );
  });

  return (
    <div ref={ref} className="relative overflow-hidden py-2" aria-hidden>
      <div data-track className="flex w-max gap-3">
        {photos.map((src, i) => (
          <div
            key={src}
            className="relative h-44 w-32 shrink-0 overflow-hidden rounded-lg border border-edge sm:h-56 sm:w-40"
          >
            <Image
              src={src}
              alt={`${alt} ${i + 1}`}
              fill
              sizes="160px"
              className="object-cover opacity-80"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Gallery({
  photos,
  cfg,
}: {
  photos: readonly string[];
  cfg: InvitationConfig;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex !== null;
  const total = photos.length;

  const close = useCallback(() => setOpenIndex(null), []);
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i + 1) % total)),
    [total],
  );
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i - 1 + total) % total)),
    [total],
  );

  // Grid muncul bertahap: tiap kartu naik & mengecil-ke-normal berurutan.
  const gridRef = useAnim<HTMLDivElement>(({ gsap, el }) => {
    const cards = el.querySelectorAll<HTMLElement>("[data-card]");
    if (!cards.length) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 40, scale: 0.94 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.95,
        ease: "power3.out",
        stagger: { each: 0.07, from: "start" },
        clearProps: "transform",
        scrollTrigger: { trigger: el, start: "top 82%", once: true },
      },
    );
  });

  // Navigasi keyboard + kunci scroll saat lightbox terbuka.
  useEffect(() => {
    if (!isOpen) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    }

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      window.__lenis?.start();
    };
  }, [isOpen, close, next, prev]);

  return (
    <>
      {/* Grid masonry-ish: beberapa foto dibuat lebih tinggi agar dinamis */}
      <div
        ref={gridRef}
        className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3"
      >
        {photos.map((src, i) => {
          const tall = i % 5 === 0 || i % 5 === 3;
          return (
            <button
              key={src}
              type="button"
              data-card
              data-anim
              onClick={() => setOpenIndex(i)}
              className={`group relative overflow-hidden rounded-lg border border-edge bg-panel transition duration-500 hover:border-amber/70 ${
                tall ? "row-span-2 aspect-[3/4]" : "aspect-square"
              }`}
            >
              <Image
                src={src}
                alt={`Foto ${cfg.couple.brideShort} & ${cfg.couple.groomShort} ${i + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover opacity-85 transition duration-700 group-hover:scale-[1.07] group-hover:opacity-100"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            </button>
          );
        })}
      </div>

      {/* Lightbox */}
      {isOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Pratinjau foto"
          className="fixed inset-0 z-50 flex items-center justify-center bg-void/95 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Tutup"
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-edge bg-panel/70 text-parchment transition hover:border-amber/60 hover:bg-panel"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
              <path d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3 1.4 1.4Z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Foto sebelumnya"
            className="absolute left-2 grid h-12 w-12 place-items-center rounded-full border border-edge bg-panel/70 text-parchment transition hover:border-amber/60 hover:bg-panel sm:left-6"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
              <path d="M15.4 4.6 8 12l7.4 7.4 1.4-1.4L10.8 12l6-6-1.4-1.4Z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Foto berikutnya"
            className="absolute right-2 grid h-12 w-12 place-items-center rounded-full border border-edge bg-panel/70 text-parchment transition hover:border-amber/60 hover:bg-panel sm:right-6"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
              <path d="M8.6 4.6 16 12l-7.4 7.4L7.2 18l6-6-6-6 1.4-1.4Z" />
            </svg>
          </button>

          <div
            className="relative max-h-[82vh] w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[openIndex]}
              alt={`Foto ${openIndex + 1}`}
              width={1616}
              height={1080}
              sizes="(max-width: 768px) 100vw, 768px"
              className="max-h-[82vh] w-full rounded-lg object-contain"
            />
            <p className="mt-3 text-center text-sm tracking-[0.2em] text-sand">
              {openIndex + 1} / {total}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
