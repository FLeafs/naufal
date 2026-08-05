"use client";

import { useAnim } from "../lib/use-anim";

/**
 * Efek parallax GSAP untuk foto latar.
 *
 * Selain menggeser posisi (`strength`), lapisan juga di-zoom pelan selama
 * section dilewati. Kombinasi geser + zoom inilah yang memberi kesan kedalaman;
 * geseran saja terasa seperti gambar yang cuma naik-turun.
 */
export function Parallax({
  children,
  /** Besar geseran vertikal, dalam persen tinggi elemen. */
  strength = 14,
  /** Zoom di akhir scroll. 1 = tanpa zoom. */
  zoom = 1.08,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  zoom?: number;
  className?: string;
}) {
  const ref = useAnim<HTMLDivElement>(
    ({ gsap, el }) => {
      const trigger = el.parentElement ?? el;

      gsap
        .timeline({
          scrollTrigger: {
            trigger,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.1, // sedikit tertinggal dari scroll → terasa berbobot
          },
          defaults: { ease: "none" },
        })
        .fromTo(el, { yPercent: -strength }, { yPercent: strength }, 0)
        .fromTo(el, { scale: zoom }, { scale: 1 }, 0);
    },
    [strength, zoom],
  );

  return (
    <div ref={ref} className={`absolute inset-0 ${className}`}>
      {children}
    </div>
  );
}
