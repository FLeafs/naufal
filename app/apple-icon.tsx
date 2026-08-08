import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#211710", color: "#ead1aa", border: "7px solid #ead1aa", fontFamily: "Georgia, serif", fontSize: 68, letterSpacing: -7 }}>
        NB
      </div>
    ),
    size,
  );
}
