"use client";

import { useAnim } from "../lib/use-anim";

/** Ragam gerak masuk. Dipilih per section supaya tidak semua sama. */
export type RevealVariant =
  | "up" /* naik dari bawah — default */
  | "fade" /* hanya memudar, untuk teks panjang */
  | "left" /* masuk dari kiri */
  | "right" /* masuk dari kanan */
  | "scale" /* mengecil → normal, untuk foto & kartu */
  | "curtain" /* tersingkap dari bawah lewat clip-path */
  | "blur"; /* dari buram & agak turun, terasa lembut */

type Props = {
  children: React.ReactNode;
  /** Jeda mulai, dalam milidetik. */
  delay?: number;
  variant?: RevealVariant;
  /** Jarak gerak (px). Diabaikan oleh varian fade/scale/curtain. */
  distance?: number;
  /**
   * Bila diberi selector, anak-anak yang cocok dianimasikan satu per satu
   * (stagger) alih-alih seluruh blok bergerak sebagai satu kesatuan.
   */
  stagger?: string;
  className?: string;
  as?: "div" | "section" | "li" | "span" | "p" | "article";
};

function fromState(
  variant: RevealVariant,
  d: number,
): gsap.TweenVars {
  switch (variant) {
    case "fade":
      return { opacity: 0 };
    case "left":
      return { opacity: 0, x: -d };
    case "right":
      return { opacity: 0, x: d };
    case "scale":
      return { opacity: 0, scale: 0.9 };
    case "curtain":
      return { clipPath: "inset(100% 0% 0% 0%)", y: d * 0.5 };
    case "blur":
      return { opacity: 0, y: d * 0.7, filter: "blur(12px)" };
    case "up":
    default:
      return { opacity: 0, y: d };
  }
}

function toState(variant: RevealVariant): gsap.TweenVars {
  const base = { opacity: 1, x: 0, y: 0, scale: 1 };
  if (variant === "curtain") {
    return { clipPath: "inset(0% 0% 0% 0%)", y: 0 };
  }
  if (variant === "blur") {
    return { ...base, filter: "blur(0px)" };
  }
  return base;
}

/**
 * Membungkus konten agar muncul saat masuk viewport.
 *
 * Memakai ScrollTrigger (bukan IntersectionObserver + transisi CSS) supaya
 * gerakannya sinkron dengan smooth-scroll Lenis dan bisa di-stagger.
 */
export function Reveal({
  children,
  delay = 0,
  variant = "up",
  distance = 44,
  stagger,
  className = "",
  as: Tag = "div",
}: Props) {
  const ref = useAnim<HTMLElement>(
    ({ gsap, el }) => {
      const targets = stagger
        ? Array.from(el.querySelectorAll<HTMLElement>(stagger))
        : [el];
      if (!targets.length) return;

      gsap.set(targets, { willChange: "transform, opacity" });

      gsap.fromTo(targets, fromState(variant, distance), {
        ...toState(variant),
        duration: variant === "curtain" ? 1.25 : 1.05,
        delay: delay / 1000,
        ease: variant === "curtain" ? "expo.out" : "power3.out",
        stagger: stagger ? 0.11 : 0,
        // Bersihkan properti inline setelah selesai agar tidak mengganggu
        // hover/transition CSS pada elemen yang sama.
        clearProps: "willChange,filter,clipPath",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });
    },
    [variant, distance, delay, stagger],
  );

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      // Tanpa stagger, wrapper inilah yang dianimasikan — jadi ia sendiri
      // perlu disembunyikan sampai GSAP memasang state awalnya.
      {...(stagger ? {} : { "data-anim": "" })}
      className={className}
    >
      {children}
    </Tag>
  );
}
