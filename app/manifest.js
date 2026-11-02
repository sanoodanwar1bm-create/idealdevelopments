import { DEFAULT_DESCRIPTION, SITE_NAME } from "@lib/seo";

export default function manifest() {
  return {
    name: `${SITE_NAME} — We Build with Ihsan`,
    short_name: "IDEAL",
    description: DEFAULT_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#f7f5f0",
    theme_color: "#0a284e",
    lang: "en-PK",
    categories: ["business", "productivity"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
