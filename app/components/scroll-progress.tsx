"use client";

import { useAnim } from "../lib/use-anim";

/**
 * Garis tipis di tepi atas layar yang mengisi sesuai posisi scroll.
 * Memberi tamu gambaran seberapa panjang undangan ini.
 */
export function ScrollProgress() {
  const ref = useAnim<HTMLDivElement>(({ gsap, el }) => {
    const bar = el.firstElementChild;
    if (!bar) return;

    gsap.fromTo(
      bar,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
        },
      },
    );
  });

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[2px] bg-edge/40"
      aria-hidden
    >
      <div className="h-full origin-left bg-gradient-to-r from-ember via-amber to-gold" />
    </div>
  );
}
