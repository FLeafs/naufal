"use client";

import { useAnim } from "../lib/use-anim";

type Props = {
  text: string;
  className?: string;
  /**
   * Kelas untuk tiap huruf/kata. Penting untuk efek gradasi:
   * `text-gilded` memakai `background-clip: text`, dan bila dipasang di
   * elemen induk sementara anaknya di-transform, anak itu jadi lapisan
   * sendiri sehingga gradasinya tidak ikut — teks bisa tampak hilang.
   * Memasang kelas langsung di elemen yang di-transform menghindari itu.
   */
  pieceClassName?: string;
  /**
   * "chars" — huruf per huruf, cocok untuk nama/judul pendek.
   * "words" — kata per kata, jauh lebih enak dibaca untuk kalimat panjang.
   */
  by?: "chars" | "words";
  /** Jeda mulai (ms). */
  delay?: number;
  /** Mulai animasi saat elemen sudah masuk sejauh ini. */
  start?: string;
};

/**
 * Judul yang tersingkap bertahap memakai GSAP saat masuk viewport.
 *
 * Setiap huruf/kata dibungkus dua lapis: pembungkus luar `overflow-hidden`
 * sebagai mask, dan span dalam yang digeser naik. Hasilnya huruf terlihat
 * "terbit" dari balik garis dasar, bukan sekadar memudar di tempat.
 *
 * Teks asli tetap ada sebagai `sr-only` supaya SEO & pembaca layar aman.
 */
export function SplitText({
  text,
  className = "",
  pieceClassName = "",
  by = "chars",
  delay = 0,
  start = "top 88%",
}: Props) {
  const ref = useAnim<HTMLSpanElement>(
    ({ gsap, el }) => {
      const pieces = el.querySelectorAll<HTMLElement>("[data-piece]");
      if (!pieces.length) return;

      gsap.fromTo(
        pieces,
        { yPercent: 118, rotateZ: by === "chars" ? 6 : 3, opacity: 0 },
        {
          yPercent: 0,
          rotateZ: 0,
          opacity: 1,
          duration: 1.15,
          ease: "expo.out",
          delay: delay / 1000,
          stagger: by === "chars" ? 0.035 : 0.075,
          scrollTrigger: { trigger: el, start, once: true },
        },
      );
    },
    [text, by, delay, start],
  );

  // Pecah jadi kata dulu supaya kata tidak pernah terputus antar baris.
  const words = text.split(" ");
  const piece = `inline-block will-change-transform ${pieceClassName}`;

  return (
    <>
      <span className="sr-only">{text}</span>
      <span ref={ref} className={className} aria-hidden>
        {words.map((word, wi) => {
          const space = wi < words.length - 1;
          return (
            <span
              key={`${word}-${wi}`}
              className="inline-flex overflow-hidden py-[0.12em] align-bottom"
            >
              {by === "words" ? (
                <span data-anim data-piece className={piece}>
                  {word}
                  {space ? " " : ""}
                </span>
              ) : (
                <>
                  {Array.from(word).map((ch, ci) => (
                    <span
                      key={`${ch}-${ci}`}
                      data-anim
                      data-piece
                      className={piece}
                    >
                      {ch}
                    </span>
                  ))}
                  {space ? (
                    <span data-anim data-piece className={piece}>
                      &nbsp;
                    </span>
                  ) : null}
                </>
              )}
            </span>
          );
        })}
      </span>
    </>
  );
}
