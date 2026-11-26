import { ImageResponse } from "next/og";

import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #06060a 0%, #1c1917 100%)",
          padding: "64px",
          color: "#fafaf9",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "#22c55e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
              fontWeight: 900,
              color: "#06060a",
            }}
          >
            R
          </div>
          <div style={{ fontSize: "38px", fontWeight: 900, letterSpacing: "2px" }}>
            ROLLCHI
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ fontSize: "64px", fontWeight: 900, lineHeight: 1.1 }}>
            Roll your own.
          </div>
          <div style={{ fontSize: "26px", color: "#a8a29e", maxWidth: "900px" }}>
            Tobacco, rolling papers, filters &amp; all cigarette accessories — fast
            delivery across Iran.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "22px",
            color: "#78716c",
          }}
        >
          <span>{SITE.url}</span>
          <span>ROLL YOUR OWN</span>
        </div>
      </div>
    ),
    { ...size },
  );
}