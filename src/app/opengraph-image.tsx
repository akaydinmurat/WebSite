import { ImageResponse } from "next/og";

export const alt = "Murat Akaydın Studio — İç mimari ve 3D görselleştirme";
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
        background: "#1f211f",
        color: "#f1ede4",
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
          background: "#9a7155",
          opacity: 0.78,
          display: "flex",
        }}
      />
      <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, textTransform: "uppercase" }}>
        Murat Akaydın Studio
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
        Yaşanacak atmosferler tasarlıyoruz.
      </div>
      <div
        style={{ display: "flex", justifyContent: "space-between", fontSize: 18, color: "#c7beb0" }}
      >
        <span>İç mimari · 3D görselleştirme</span>
        <span>Türkiye</span>
      </div>
    </div>,
    size,
  );
}
