import type { Metadata } from "next";
import { Invitation } from "../components/invitation";
import { configs } from "../config";

const cfg = configs.qnet;

export const metadata: Metadata = {
  title: `The Wedding of ${cfg.couple.brideShort} & ${cfg.couple.groomShort}`,
  description: `Undangan pernikahan ${cfg.couple.brideShort} & ${cfg.couple.groomShort} — ${cfg.dayText}, ${cfg.event.time}.`,
  openGraph: {
    title: `The Wedding of ${cfg.couple.brideShort} & ${cfg.couple.groomShort}`,
    description: `Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i pada acara pernikahan anak kami — ${cfg.dayText}, ${cfg.event.time}.`,
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: `The Wedding of ${cfg.couple.brideShort} & ${cfg.couple.groomShort}`,
    description: `Undangan pernikahan ${cfg.couple.brideShort} & ${cfg.couple.groomShort} — ${cfg.dayText}, ${cfg.event.time}.`,
  },
};

/* Mode QNET — 22 Agustus 2026, 15.00 - 18.00 WIB */
export default function QnetPage() {
  return <Invitation cfg={cfg} />;
}
