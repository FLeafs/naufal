/* Ornamen SVG bertema Autumn — dipakai ulang di banyak section. */

type IconProps = { className?: string; style?: React.CSSProperties };

export function LeafIcon({ className = "", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden>
      <path
        d="M12 2C7 5 4 9 4 13.5A8 8 0 0 0 12 22a8 8 0 0 0 8-8.5C20 9 17 5 12 2Z"
        fill="currentColor"
        opacity=".85"
      />
      <path
        d="M12 22V7M12 12l4-3M12 16l-4-3"
        stroke="#0d0906"
        strokeWidth="1"
        strokeLinecap="round"
        opacity=".55"
      />
    </svg>
  );
}

export function MapleIcon({ className = "", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden>
      <path
        d="M12 2 10 6 7 5l1 3-4 1 3 2-2 3 4-.5L8 17l3-1.5V22h2v-6.5L16 17l-1-3.5 4 .5-2-3 3-2-4-1 1-3-3 1-2-4Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function AcornIcon({ className = "", style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style} aria-hidden>
      <path
        d="M6 9h12c0 5-2.7 9-6 9S6 14 6 9Z"
        fill="currentColor"
        opacity=".85"
      />
      <rect x="4.5" y="5.5" width="15" height="4" rx="2" fill="currentColor" />
      <path d="M12 5.5V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* Pemisah antar section: garis tipis dengan daun di tengah */
export function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="h-px w-14 bg-gradient-to-r from-transparent to-amber/60 sm:w-20" />
      <LeafIcon className="h-4 w-4 shrink-0 text-amber" />
      <span className="h-px w-14 bg-gradient-to-l from-transparent to-amber/60 sm:w-20" />
    </div>
  );
}

/**
 * Judul section.
 *
 * `index` menampilkan nomor urut kecil di samping — penanda posisi yang
 * membuat tiap section terasa sebagai babak berbeda, bukan blok berulang.
 * `align` memungkinkan judul rata kiri agar ritme halaman tidak selalu tengah.
 */
export function SectionTitle({
  overline,
  title,
  index,
  align = "center",
}: {
  overline?: string;
  title: string;
  index?: string;
  align?: "center" | "left";
}) {
  const left = align === "left";

  return (
    <div className={left ? "text-left" : "text-center"}>
      <div
        className={`flex items-center gap-3 ${
          left ? "justify-start" : "justify-center"
        }`}
      >
        {index ? (
          <span className="font-display text-[0.7rem] tracking-[0.3em] text-ember">
            {index}
          </span>
        ) : null}
        {overline ? (
          <p className="text-[0.72rem] uppercase tracking-[0.28em] text-sand/80">
            {overline}
          </p>
        ) : null}
      </div>

      <h2
        className={`mt-3 font-script text-4xl leading-tight text-gilded sm:text-5xl ${
          left ? "" : "mx-auto"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}

/**
 * Pemisah antar section berupa teks berjalan.
 *
 * Fungsinya memutus rangkaian "section demi section" dengan sesuatu yang
 * bergerak horizontal — arah yang belum dipakai di halaman ini.
 */
export function SectionMarquee({
  text,
  duration = 38,
}: {
  text: string;
  duration?: number;
}) {
  // Digandakan supaya sambungan animasi (-50%) tidak terlihat.
  const items = Array.from({ length: 8 });

  return (
    <div
      className="relative overflow-hidden border-y border-edge/70 bg-void/60 py-4"
      aria-hidden
    >
      <div
        className="marquee-track items-center gap-6"
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {items.map((_, i) => (
          <span key={i} className="flex shrink-0 items-center gap-6">
            <span className="whitespace-nowrap font-display text-sm uppercase tracking-[0.34em] text-sand/45">
              {text}
            </span>
            <LeafIcon className="h-3.5 w-3.5 shrink-0 text-ember/70" />
          </span>
        ))}
      </div>

      {/* Tepi memudar agar teks tidak terpotong tajam */}
      <span className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-ink to-transparent" />
      <span className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-ink to-transparent" />
    </div>
  );
}

/** Garis vertikal tipis dengan titik yang menetes — transisi antar blok. */
export function VerticalRule({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center ${className}`} aria-hidden>
      <span className="relative h-20 w-px bg-gradient-to-b from-transparent via-edge to-transparent">
        <span className="drip absolute inset-0 bg-gradient-to-b from-amber/80 to-transparent" />
      </span>
    </div>
  );
}
