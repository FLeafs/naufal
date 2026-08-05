"use client";

/**
 * Satu pintu untuk GSAP.
 *
 * Kenapa perlu: sebelumnya tiap komponen meng-`import("gsap")` sendiri lalu
 * memanggil `registerPlugin`. Selain berulang, ScrollTrigger jadi dibuat saat
 * isi undangan masih disembunyikan di balik sampul (tinggi 0), sehingga semua
 * posisi start/end terhitung salah dan animasi terasa "meletus" barengan.
 *
 * Di sini GSAP dimuat sekali, plugin didaftarkan sekali, dan disediakan
 * `refreshScrollTriggers()` untuk dipanggil setelah sampul dibuka.
 */

import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

export type Gsap = typeof GsapType;
export type ScrollTriggerCtor = typeof ScrollTriggerType;

type Bundle = { gsap: Gsap; ScrollTrigger: ScrollTriggerCtor };

let pending: Promise<Bundle> | null = null;

/** Muat GSAP + ScrollTrigger (sekali saja, hasilnya di-cache). */
export function loadGsap(): Promise<Bundle> {
  pending ??= (async () => {
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]);

    gsap.registerPlugin(ScrollTrigger);

    // Default global: semua animasi memakai easing & durasi yang seragam
    // supaya keseluruhan halaman terasa satu bahasa gerak.
    gsap.defaults({ ease: "power3.out", duration: 1 });

    // Sinkronkan ScrollTrigger dengan ukuran layar yang berubah
    // (mis. bar URL browser mobile yang muncul-hilang).
    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    });

    return { gsap, ScrollTrigger };
  })();

  return pending;
}

/** True bila pengguna meminta animasi dikurangi. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Hitung ulang seluruh posisi ScrollTrigger.
 * Dipanggil setelah sampul dibuka — saat itu isi undangan baru punya tinggi
 * sebenarnya, jadi trigger perlu diukur ulang.
 */
export async function refreshScrollTriggers() {
  if (prefersReducedMotion()) return;
  const { ScrollTrigger } = await loadGsap();
  ScrollTrigger.refresh();
}
