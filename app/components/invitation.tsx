import Image from "next/image";
import type { InvitationConfig } from "../config";
import { Countdown } from "./countdown";
import { FallingLeaves } from "./falling-leaves";
import { Gallery, GalleryStrip } from "./gallery";
import { InvitationGate } from "./invitation-gate";
import { Parallax } from "./parallax";
import { ScrollProgress } from "./scroll-progress";
import { ScrollText } from "./scroll-text";
import { SplitText } from "./split-text";
import {
  AcornIcon,
  Divider,
  LeafIcon,
  MapleIcon,
  SectionMarquee,
  SectionTitle,
  VerticalRule,
} from "./ornaments";
import { Reveal } from "./reveal";

type InvitationProps = {
  cfg: InvitationConfig;
  coupleTitle?: string;
  showParents?: boolean;
};

/** Halaman undangan lengkap. Dipakai oleh mode public (/) dan qnet (/qnet). */
export function Invitation({
  cfg,
  coupleTitle = "Pernikahan Anak Kami",
  showParents = true,
}: InvitationProps) {
  return (
    <InvitationGate cfg={cfg}>
      <ScrollProgress />

      <main className="relative mx-auto w-full max-w-2xl overflow-hidden bg-ink shadow-2xl">
        <HeroSection cfg={cfg} />
        <QuoteSection cfg={cfg} />

        <SectionMarquee text="Bismillahirrahmanirrahim" />

        <CoupleSection
          cfg={cfg}
          title={coupleTitle}
          showParents={showParents}
        />
        <CountdownSection cfg={cfg} />
        <EventSection cfg={cfg} />

        <SectionMarquee text="Momen Kami · Our Story" duration={30} />

        <GallerySection cfg={cfg} />
        <ClosingSection cfg={cfg} />
      </main>
    </InvitationGate>
  );
}

type P = { cfg: InvitationConfig };

/**
 * Tepi atas/bawah section berfoto dibuat membaur ke warna dasar.
 * Tanpa ini, batas antar section terlihat sebagai garis lurus dan
 * halaman terasa seperti tumpukan kotak.
 */
function EdgeFade({ side }: { side: "top" | "bottom" }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 z-10 h-24 ${
        side === "top"
          ? "top-0 bg-gradient-to-b from-ink to-transparent"
          : "bottom-0 bg-gradient-to-t from-ink to-transparent"
      }`}
    />
  );
}

/* ============================ HERO ============================ */
function HeroSection({ cfg }: P) {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <Parallax strength={14} zoom={1.12}>
        <Image
          src={cfg.couplePhoto}
          alt={`${cfg.couple.brideShort} & ${cfg.couple.groomShort}`}
          fill
          sizes="(max-width: 672px) 100vw, 672px"
          quality={90}
          loading="eager"
          className="object-cover object-center"
        />
      </Parallax>

      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/45 to-ink" />
      <div className="vignette grain absolute inset-0" />
      <FallingLeaves />

      <div className="relative px-6 pb-24 text-center">
        <Reveal variant="fade">
          <p className="text-[0.7rem] uppercase tracking-[0.35em] text-sand/85">
            Undangan Pernikahan
          </p>
        </Reveal>

        {/* Nama dianimasikan huruf per huruf — bagian paling penting,
            jadi diberi gerakan paling menonjol di halaman. Gradasi dipasang
            per huruf, bukan di <h2>, karena huruf yang di-transform tidak
            mewarisi background-clip dari induknya. */}
        <h2 className="mt-5 font-script text-5xl leading-tight sm:text-7xl">
          <SplitText
            text={`${cfg.couple.brideShort} & ${cfg.couple.groomShort}`}
            pieceClassName="text-gilded"
            delay={250}
          />
        </h2>

        <Reveal delay={700} variant="fade">
          <Divider className="my-6" />
          <p className="font-display text-base tracking-[0.3em] text-sand sm:text-xl">
            {cfg.dayText}
          </p>
        </Reveal>
      </div>

      {/* Indikator scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="mb-1.5 text-[0.65rem] uppercase tracking-[0.25em] text-muted">
          Scroll
        </p>
        <svg
          viewBox="0 0 24 24"
          className="bob mx-auto h-4 w-4 text-amber"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 16.5 5.5 10l1.4-1.4L12 13.7l5.1-5.1L18.5 10 12 16.5Z" />
        </svg>
      </div>
    </section>
  );
}

/* ============================ QUOTE ============================ */
function QuoteSection({ cfg }: P) {
  return (
    <section className="glow-warm relative overflow-hidden bg-ink px-7 py-24 sm:py-28">
      <div className="relative mx-auto max-w-lg text-center">
        <Reveal variant="scale">
          <MapleIcon className="mx-auto h-7 w-7 text-ember" />
        </Reveal>

        {/* Kutipan menyala kata demi kata seiring scroll — mendorong tamu
            membacanya perlahan, bukan sekadar melewatinya. */}
        <ScrollText
          text={cfg.quote.text}
          className="mt-8 font-display text-xl font-light italic leading-relaxed text-parchment sm:text-2xl"
        />

        <Reveal variant="fade" delay={100}>
          <p className="mt-6 text-[0.75rem] uppercase tracking-[0.25em] text-amber">
            {cfg.quote.source}
          </p>
        </Reveal>
      </div>

      <VerticalRule className="mt-14" />
    </section>
  );
}

/* ============================ MEMPELAI ============================ */
function CoupleSection({
  cfg,
  title,
  showParents,
}: P & { title: string; showParents: boolean }) {
  return (
    <section className="relative overflow-hidden bg-coal px-7 py-24 sm:py-28">
      <FallingLeaves className="opacity-30" />

      <Reveal className="relative" variant="up">
        <SectionTitle index="01" overline="Mempelai" title={title} align="left" />
        <p className="mt-6 max-w-md text-sm leading-relaxed text-sand/80">
          Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud
          menyelenggarakan pernikahan kami:
        </p>
      </Reveal>

      {/* Dua kartu dengan perataan berlawanan — kiri lalu kanan — supaya
          mata bergerak zig-zag, bukan lurus turun di tengah. */}
      <div className="relative mt-16 space-y-14">
        <PersonCard
          person={cfg.couple.bride}
          name={cfg.couple.brideShort}
          side="left"
          showParents={showParents}
        />

        <Reveal variant="scale" className="flex items-center justify-center gap-4">
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-edge" />
          <span className="font-script text-4xl text-amber">&</span>
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-edge" />
        </Reveal>

        <PersonCard
          person={cfg.couple.groom}
          name={cfg.couple.groomShort}
          side="right"
          showParents={showParents}
        />
      </div>
    </section>
  );
}

function PersonCard({
  person,
  name,
  side,
  showParents,
}: {
  person: { fullName: string; instagram: string; parents: { label: string; name: string; origin: string } };
  name: string;
  side: "left" | "right";
  showParents: boolean;
}) {
  const isLeft = side === "left";

  return (
    <Reveal
      variant={isLeft ? "left" : "right"}
      distance={52}
      className={isLeft ? "text-left" : "text-right"}
    >
      {/* Garis aksen pendek di sisi luar, menegaskan arah blok */}
      <span
        aria-hidden
        className={`block h-px w-20 bg-gradient-to-r from-ember to-transparent ${
          isLeft ? "" : "ml-auto bg-gradient-to-l"
        }`}
      />

      <h3 className="mt-5 font-script text-4xl leading-snug text-gilded sm:text-5xl">
        {person.fullName || name}
      </h3>

      {showParents && person.parents ? (<>
        <p className="mt-3 text-[0.7rem] uppercase tracking-[0.2em] text-amber/80">
          {person.parents.label}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-sand/80">
          {person.parents.name}
        </p>
        <p className="mt-0.5 text-xs text-sand/60">
          {person.parents.origin}
        </p>
      </>) : null}

      {person.instagram ? (
        <a
          href={`https://instagram.com/${person.instagram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-edge px-4 py-2 text-[0.72rem] uppercase tracking-[0.18em] text-sand transition hover:border-amber/60 hover:text-gold"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="currentColor"
            aria-hidden
          >
            <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 5.3a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm0 7.4a2.9 2.9 0 1 1 0-5.8 2.9 2.9 0 0 1 0 5.8Zm5.7-7.6a1.05 1.05 0 1 1-2.1 0 1.05 1.05 0 0 1 2.1 0Z" />
          </svg>
          @{person.instagram}
        </a>
      ) : null}
    </Reveal>
  );
}

/* ============================ HITUNG MUNDUR ============================ */
function CountdownSection({ cfg }: P) {
  return (
    <section className="relative flex min-h-[85svh] items-center justify-center overflow-hidden px-6 py-24">
      <Parallax strength={12} zoom={1.1}>
        <Image
          src={cfg.countdownPhoto}
          alt=""
          fill
          sizes="(max-width: 672px) 100vw, 672px"
          quality={85}
          className="object-cover object-center"
        />
      </Parallax>

      <div className="absolute inset-0 bg-ink/80" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />
      <div className="vignette grain absolute inset-0" />
      <EdgeFade side="top" />
      <EdgeFade side="bottom" />
      <FallingLeaves className="opacity-60" />

      <div className="relative w-full text-center">
        <Reveal variant="scale">
          <AcornIcon className="mx-auto h-7 w-7 text-amber" />
        </Reveal>

        <Reveal variant="curtain" delay={80}>
          <SectionTitle index="02" overline="Menuju Hari Bahagia" title="Save The Date" />
        </Reveal>

        <Reveal variant="fade" delay={200}>
          <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-sand/85">
            Kami akan sangat berbahagia apabila Bapak/Ibu/Saudara/i berkenan hadir
            untuk memberikan doa restu.
          </p>
        </Reveal>

        {/* Kotak angka muncul satu per satu dari kiri ke kanan */}
        <Reveal variant="up" delay={280} className="mt-10">
          <Countdown target={cfg.countdownTarget} />
        </Reveal>

        <Reveal variant="fade" delay={420}>
          <p className="mt-8 font-display text-lg tracking-[0.25em] text-gold">
            {cfg.dateText}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================ ACARA ============================ */
function EventSection({ cfg }: P) {
  return (
    <section className="relative overflow-hidden bg-ink px-7 py-24 sm:py-28">
      <Reveal variant="up">
        <SectionTitle index="03" overline="Waktu & Tempat" title="Undangan" align="left" />
      </Reveal>

      {/* Detail acara sebagai daftar bergaris, di-stagger baris demi baris —
          lebih terasa "diketik" daripada satu kartu yang muncul utuh. */}
      <Reveal variant="curtain" className="mt-12">
        <article className="relative overflow-hidden rounded-2xl border border-edge bg-panel/60 p-7 shadow-lg backdrop-blur-sm">
          <LeafIcon className="absolute -right-5 -top-5 h-24 w-24 text-ember/10" />
          <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-amber/40 to-transparent" />

          <Reveal stagger="[data-row]" variant="left" distance={28}>
            <dl className="space-y-5 text-sm">
              <Row label="Tanggal" value={cfg.event.date} />
              <Row label="Waktu" value={cfg.event.time} />

              <div data-row data-anim className="py-1">
                <Divider />
              </div>

              <div data-row data-anim>
                <dt className="text-[0.7rem] uppercase tracking-[0.2em] text-ember">
                  Tempat
                </dt>
                <dd className="mt-1.5 font-display text-lg text-parchment">
                  {cfg.location.venue}
                </dd>
                <dd className="mt-1.5 max-w-xs text-[0.82rem] leading-relaxed text-muted">
                  {cfg.location.address}
                </dd>
              </div>
            </dl>
          </Reveal>

          <a
            href={cfg.location.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-7 inline-flex items-center gap-2 rounded-full border border-amber/45 bg-ember/15 px-6 py-3 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-gold transition duration-300 hover:border-amber hover:bg-ember/30 active:scale-95"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5"
              fill="currentColor"
              aria-hidden
            >
              <path d="M12 2a7 7 0 0 0-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
            </svg>
            Lihat Lokasi
          </a>
        </article>
      </Reveal>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div data-row data-anim>
      <dt className="text-[0.7rem] uppercase tracking-[0.2em] text-ember">
        {label}
      </dt>
      <dd className="mt-1.5 font-display text-lg text-parchment">{value}</dd>
    </div>
  );
}

/* ============================ GALERI ============================ */
function GallerySection({ cfg }: P) {
  const alt = `Foto ${cfg.couple.brideShort} & ${cfg.couple.groomShort}`;

  return (
    <section className="relative overflow-hidden bg-coal px-5 py-24 sm:px-7 sm:py-28">
      {/* Strip horizontal dulu sebagai pembuka — gerak menyamping memecah
          ritme scroll vertikal sebelum masuk ke grid. */}
      <GalleryStrip photos={cfg.gallery.slice(0, 8)} alt={alt} />

      <Reveal variant="up" className="mt-16">
        <SectionTitle index="04" overline="Momen Kami" title="Galeri" align="left" />
        <p className="mt-5 max-w-sm text-sm leading-relaxed text-sand/80">
          Setiap gambar menyimpan cerita perjalanan kami.
        </p>
      </Reveal>

      <div className="mt-11">
        <Gallery photos={cfg.gallery} cfg={cfg} />
      </div>
    </section>
  );
}

/* ============================ PENUTUP ============================ */
function ClosingSection({ cfg }: P) {
  return (
    <section className="relative flex min-h-[95svh] flex-col items-center justify-center overflow-hidden px-7 py-24 text-center">
      <Parallax strength={12} zoom={1.12}>
        <Image
          src={cfg.closingPhoto}
          alt=""
          fill
          sizes="(max-width: 672px) 100vw, 672px"
          quality={85}
          className="object-cover object-center"
        />
      </Parallax>

      <div className="absolute inset-0 bg-ink/85" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink" />
      <div className="vignette grain absolute inset-0" />
      <EdgeFade side="top" />
      <FallingLeaves />

      <div className="relative">
        <Reveal variant="scale">
          <MapleIcon className="mx-auto h-8 w-8 text-ember" />
        </Reveal>

        <Reveal variant="blur" delay={120}>
          <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-sand/85">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
            Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada
            kedua mempelai.
          </p>
        </Reveal>

        <Reveal variant="fade" delay={240}>
          <p className="mt-7 text-[0.75rem] uppercase tracking-[0.25em] text-amber">
            Atas kehadiran dan doanya, kami ucapkan terima kasih
          </p>

          <Divider className="my-9" />

          <p className="text-[0.7rem] uppercase tracking-[0.35em] text-muted">
            Kami yang berbahagia
          </p>
        </Reveal>

        <SplitText
          text={`${cfg.couple.brideShort} & ${cfg.couple.groomShort}`}
          pieceClassName="text-gilded"
          className="mt-4 block font-script text-5xl leading-tight sm:text-6xl"
        />

        <Reveal variant="fade" delay={300}>
          <p className="mt-8 font-display text-sm tracking-[0.3em] text-sand/80">
            {cfg.dateText}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
