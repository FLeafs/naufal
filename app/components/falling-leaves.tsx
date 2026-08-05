import { LeafIcon, MapleIcon } from "./ornaments";

/* Nilai sengaja ditulis manual (bukan Math.random) supaya hasil render di
   server dan di browser sama persis — menghindari hydration mismatch. */
const LEAVES = [
  { left: "6%", size: 20, dur: 15, delay: 0, drift: 60, spin: 320, op: 0.5, maple: false },
  { left: "18%", size: 14, dur: 19, delay: 3.5, drift: -45, spin: -280, op: 0.4, maple: true },
  { left: "29%", size: 24, dur: 13, delay: 7, drift: 75, spin: 400, op: 0.45, maple: false },
  { left: "41%", size: 12, dur: 22, delay: 1.5, drift: -30, spin: 240, op: 0.35, maple: true },
  { left: "53%", size: 18, dur: 16, delay: 9, drift: 55, spin: -360, op: 0.5, maple: false },
  { left: "64%", size: 22, dur: 20, delay: 5, drift: -65, spin: 300, op: 0.4, maple: true },
  { left: "76%", size: 15, dur: 14, delay: 11, drift: 40, spin: -420, op: 0.45, maple: false },
  { left: "87%", size: 19, dur: 18, delay: 2.5, drift: -50, spin: 340, op: 0.4, maple: true },
  { left: "95%", size: 13, dur: 21, delay: 8, drift: 35, spin: -260, op: 0.35, maple: false },
];

const TINTS = ["text-ember", "text-rust", "text-olive", "text-amber", "text-gold"];

/** Hujan daun dekoratif. Absolute — taruh di dalam wadah `relative overflow-hidden`. */
export function FallingLeaves({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {LEAVES.map((leaf, i) => {
        const Icon = leaf.maple ? MapleIcon : LeafIcon;
        return (
          <span
            key={i}
            className={`leaf ${TINTS[i % TINTS.length]}`}
            style={
              {
                left: leaf.left,
                "--leaf-duration": `${leaf.dur}s`,
                "--leaf-delay": `${leaf.delay}s`,
                "--leaf-drift": `${leaf.drift}px`,
                "--leaf-spin": `${leaf.spin}deg`,
                "--leaf-opacity": leaf.op,
              } as React.CSSProperties
            }
          >
            <Icon className="block" style={{ width: leaf.size, height: leaf.size }} />
          </span>
        );
      })}
    </div>
  );
}
