"use client";

import { useEffect } from "react";
import { loadGsap, prefersReducedMotion } from "../lib/gsap";

/**
 * Smooth scroll Lenis + sinkronisasi ke GSAP ScrollTrigger.
 *
 * Lenis mengambil alih scroll native, jadi ScrollTrigger harus diberi tahu
 * posisi scroll dari Lenis dan ticker GSAP dipakai untuk menggerakkan Lenis
 * agar keduanya berjalan pada frame yang sama — tanpa ini, animasi ber-scrub
 * akan terlihat bergetar satu frame di belakang.
 */
export function SmoothScroll() {
  useEffect(() => {
    // Hormati pengguna yang meminta animasi dikurangi.
    if (prefersReducedMotion()) return;

    let cleanup = () => {};
    let cancelled = false;

    (async () => {
      const [{ default: Lenis }, { gsap, ScrollTrigger }] = await Promise.all([
        import("lenis"),
        loadGsap(),
      ]);
      if (cancelled) return;

      const lenis = new Lenis({
        duration: 1.05,
        // easeOutExpo — berhenti lebih halus dibanding cubic, terasa "mahal".
        easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.5,
        wheelMultiplier: 0.95,
      });

      // ScrollTrigger membaca posisi scroll dari Lenis.
      lenis.on("scroll", ScrollTrigger.update);

      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      // Supaya bisa dikontrol dari komponen lain (mis. saat sampul dibuka).
      window.__lenis = lenis;

      // Ukur ulang setelah gambar selesai dimuat — tinggi halaman berubah
      // saat foto masuk, dan trigger yang tidak di-refresh jadi bergeser.
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);

      cleanup = () => {
        window.removeEventListener("load", onLoad);
        gsap.ticker.remove(tick);
        lenis.destroy();
        delete window.__lenis;
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return null;
}
