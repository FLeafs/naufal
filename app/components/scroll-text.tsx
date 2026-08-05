"use client";

import { useAnim } from "../lib/use-anim";

/**
 * Paragraf yang menyala kata demi kata mengikuti posisi scroll.
 *
 * Berbeda dari Reveal yang sekali jalan: di sini `scrub` membuat progres
 * animasi terikat langsung ke scroll, jadi tamu merasa "menarik" teks agar
 * terbaca. Dipakai untuk kutipan — bagian yang memang ingin dibaca perlahan.
 */
export function ScrollText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useAnim<HTMLParagraphElement>(
    ({ gsap, el }) => {
      const words = el.querySelectorAll<HTMLElement>("[data-word]");
      if (!words.length) return;

      gsap.fromTo(
        words,
        { opacity: 0.14, filter: "blur(3px)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          ease: "none",
          stagger: 0.5,
          scrollTrigger: {
            trigger: el,
            start: "top 78%",
            end: "bottom 45%",
            scrub: 0.6,
          },
        },
      );
    },
    [text],
  );

  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, i) => (
          <span key={`${word}-${i}`} data-word data-anim className="inline-block">
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    </p>
  );
}
