"use client";

import { useEffect, useRef, type RefObject } from "react";
import { loadGsap, prefersReducedMotion, type Gsap } from "./gsap";

type Setup = (ctx: { gsap: Gsap; el: HTMLElement }) => void;

/**
 * Jalankan animasi GSAP dengan scope ke satu elemen.
 *
 * `gsap.context` dipakai supaya seluruh tween & ScrollTrigger yang dibuat di
 * dalam `setup` otomatis ikut mati saat komponen unmount — tanpa itu, kembali
 * ke halaman ini akan menumpuk trigger lama dan animasi mulai tersendat.
 */
export function useAnim<T extends HTMLElement = HTMLDivElement>(
  setup: Setup,
  deps: unknown[] = [],
): RefObject<T | null> {
  const ref = useRef<T>(null);

  // Simpan setup di ref supaya perubahan identitas fungsi (setiap render)
  // tidak ikut memicu ulang effect — hanya `deps` yang menentukan.
  // Disinkronkan di effect terpisah yang dideklarasikan lebih dulu, karena
  // effect berjalan sesuai urutan deklarasi: nilai sudah segar saat dipakai.
  const setupRef = useRef(setup);
  useEffect(() => {
    setupRef.current = setup;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion: tampilkan apa adanya, jangan muat GSAP sama sekali.
    if (prefersReducedMotion()) {
      el.classList.add("no-anim");
      return;
    }

    let ctx: { revert: () => void } | null = null;
    let cancelled = false;

    loadGsap()
      .then(({ gsap }) => {
        if (cancelled || !ref.current) return;

        const scope = ref.current;
        ctx = gsap.context(() => setupRef.current({ gsap, el: scope }), scope);

        // Elemen [data-anim] disembunyikan lewat CSS sampai titik ini,
        // supaya tidak terlihat berkedip sebelum GSAP siap.
        scope.classList.add("anim-ready");
      })
      .catch(() => {
        // GSAP gagal dimuat (jaringan/blokir). Konten HARUS tetap terbaca —
        // tanpa ini, elemen [data-anim] tersembunyi permanen.
        ref.current?.classList.add("no-anim");
      });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
