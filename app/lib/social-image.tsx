import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { InvitationConfig } from "../config";

const photoData = await readFile(
  join(process.cwd(), "public", "photo", "photo-01.jpg"),
  "base64",
);
const photoSrc = `data:image/jpeg;base64,${photoData}`;

export const socialImageSize = { width: 1200, height: 630 };

export function createSocialImage(cfg: InvitationConfig) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", overflow: "hidden", background: "#211710", color: "#fffaf1" }}>
        <img alt="" src={photoSrc} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", background: "linear-gradient(90deg, rgba(20,12,8,.94) 0%, rgba(20,12,8,.76) 42%, rgba(20,12,8,.08) 78%)" }} />
        <div style={{ width: 650, height: "100%", padding: "68px 72px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
          <div style={{ display: "flex", fontSize: 20, letterSpacing: 7, textTransform: "uppercase", color: "#d9bd91" }}>The Wedding Of</div>
          <div style={{ display: "flex", marginTop: 22, fontFamily: "Georgia, serif", fontSize: 78, lineHeight: 1, letterSpacing: -2 }}>{cfg.couple.brideShort}</div>
          <div style={{ display: "flex", margin: "5px 0 5px 112px", fontFamily: "Georgia, serif", fontSize: 40, fontStyle: "italic", color: "#d9bd91" }}>&</div>
          <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 78, lineHeight: 1, letterSpacing: -2 }}>{cfg.couple.groomShort}</div>
          <div style={{ display: "flex", width: 70, height: 2, marginTop: 32, background: "#d9bd91" }} />
          <div style={{ display: "flex", marginTop: 22, fontSize: 24, letterSpacing: 2, color: "#f3e7d5" }}>{cfg.dayText}</div>
        </div>
        <div style={{ position: "absolute", inset: 28, display: "flex", border: "1px solid rgba(236,211,172,.55)" }} />
      </div>
    ),
    socialImageSize,
  );
}
