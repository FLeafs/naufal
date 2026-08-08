import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#211710", color: "#ead1aa", border: "18px solid #ead1aa", fontFamily: "Georgia, serif", fontSize: 190, letterSpacing: -18 }}>
        NB
      </div>
    ),
    size,
  );
}
