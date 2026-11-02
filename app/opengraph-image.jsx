import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "IDEAL Developments — design and build homes in Islamabad, built with Ihsan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const logo = await readFile(join(process.cwd(), "public", "logo-white.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0a284e 0%, #11395f 45%, #157a6e 100%)",
          color: "#f7f5f0",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* blueprint grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -160,
            top: -160,
            width: 620,
            height: 620,
            borderRadius: 620,
            background: "rgba(212,175,55,0.16)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", marginLeft: -40, marginTop: -40 }}>
          {/* official white-on-transparent lockup, 1542x540 */}
          <img src={logoSrc} width={386} height={135} alt="" />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 82, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3, maxWidth: 940 }}>
            We build homes with Ihsan.
          </div>
          <div style={{ marginTop: 22, fontSize: 30, color: "rgba(247,245,240,0.78)", maxWidth: 860 }}>
            Design &amp; build in Islamabad — 5 Marla to 1 Kanal, certified materials, honest budgets.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 24 }}>
          <div
            style={{
              display: "flex",
              background: "#d4af37",
              color: "#0a284e",
              fontWeight: 700,
              padding: "12px 26px",
              borderRadius: 999,
            }}
          >
            idealconstruction.com.pk
          </div>
          <div style={{ display: "flex", color: "rgba(247,245,240,0.6)" }}>
            House 723, E Block, Multigardens B-17, Islamabad
          </div>
        </div>
      </div>
    ),
    size
  );
}
