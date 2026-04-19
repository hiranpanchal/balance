import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Balance and Wellness — massage & bodywork";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#EAE2D2",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
        }}
      >
        {/* Gold rule top */}
        <div style={{ width: 48, height: 1, background: "#B28B5D", marginBottom: 36 }} />

        {/* Eyebrow */}
        <div
          style={{
            color: "#B28B5D",
            fontSize: 15,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            marginBottom: 28,
            fontFamily: "serif",
          }}
        >
          MASSAGE · BODYWORK · SPA
        </div>

        {/* Headline */}
        <div
          style={{
            color: "#3E4F56",
            fontSize: 80,
            fontWeight: 400,
            textAlign: "center",
            lineHeight: 1.05,
            fontFamily: "serif",
            maxWidth: 900,
          }}
        >
          Balance and Wellness
        </div>

        {/* Gold rule */}
        <div style={{ width: 48, height: 1, background: "#B28B5D", margin: "36px 0" }} />

        {/* Subtext */}
        <div
          style={{
            color: "#3E4F56",
            fontSize: 22,
            opacity: 0.65,
            textAlign: "center",
            fontFamily: "serif",
            maxWidth: 640,
            lineHeight: 1.5,
          }}
        >
          Boutique massage and bodywork by Mukti Panchal
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
