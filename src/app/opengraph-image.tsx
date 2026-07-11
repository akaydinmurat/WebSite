import { ImageResponse } from "next/og";

export const alt = "Göknur Uygur Akaydın — Mimarlık ve iç mekân tasarımı";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#171411",
        color: "#f6f1e9",
        padding: "66px 72px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 660,
          height: 660,
          borderRadius: "50%",
          right: -180,
          top: -270,
          background: "#9b4f2f",
          opacity: 0.78,
          display: "flex",
        }}
      />
      <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, textTransform: "uppercase" }}>
        Göknur Uygur Akaydın
      </div>
      <div
        style={{
          display: "flex",
          maxWidth: 880,
          fontFamily: "serif",
          fontSize: 76,
          lineHeight: 0.96,
          letterSpacing: -4,
        }}
      >
        Mekânı, yaşamla birlikte tasarlıyorum.
      </div>
      <div
        style={{ display: "flex", justifyContent: "space-between", fontSize: 18, color: "#c7beb0" }}
      >
        <span>Mimarlık · İç mekân tasarımı</span>
        <span>Ankara · Türkiye</span>
      </div>
    </div>,
    size,
  );
}
