import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost, Parisienne } from "next/font/google";
import "./globals.css";
import { config } from "./config";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const body = Jost({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const script = Parisienne({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const title = `The Wedding of ${config.couple.brideShort} & ${config.couple.groomShort}`;

export const metadata: Metadata = {
  title,
  description: `Undangan pernikahan ${config.couple.brideShort} & ${config.couple.groomShort} — ${config.dayText}.`,
  openGraph: {
    title,
    description: `Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i pada acara pernikahan kami — ${config.dayText}.`,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0906",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${display.variable} ${body.variable} ${script.variable} h-full antialiased`}
    >
      <head>
        {/* Elemen [data-anim] disembunyikan CSS sampai GSAP memasang state
            awalnya. Bila JavaScript mati, tidak ada yang melepasnya — jadi
            batalkan penyembunyian itu di sini. Isi undangan harus tetap
            terbaca tanpa JS. */}
        <noscript>
          <style>{`[data-anim]{visibility:visible!important;opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full bg-ink">{children}</body>
    </html>
  );
}
