import type Lenis from "lenis";

declare global {
  interface Window {
    /** Instance Lenis global, dipasang oleh <SmoothScroll />. */
    __lenis?: Lenis;
  }
}

export {};
