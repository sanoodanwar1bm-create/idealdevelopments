// app/layout.jsx
import "./globals.css";
import ScrollToTop from "@components/ScrollToTop";
import ScrollProgress from "@components/motion/ScrollProgress";
import Footer from "@components/Footer";
import SmoothScroll from "@components/SmoothScroll";
import JsonLd from "@components/JsonLd";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { fontVariables } from "@lib/font";
import {
  DEFAULT_DESCRIPTION,
  KEYWORDS,
  LOCALE,
  SITE_NAME,
  SITE_URL,
  graph,
  organizationLd,
  websiteLd,
} from "@lib/seo";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Construction Company in Islamabad | IDEAL Developments — We Build with Ihsan",
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "construction",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: LOCALE,
    title: "IDEAL Developments — Design & Build in Islamabad",
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "IDEAL Developments — Design & Build in Islamabad",
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  formatDetection: { telephone: true, address: true, email: true },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5f0" },
    { media: "(prefers-color-scheme: dark)", color: "#0a284e" },
  ],
  colorScheme: "light",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-PK" className={fontVariables}>
      <head>
        {/* The 3D scenes and fonts come from these origins; warm them early. */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <JsonLd data={graph(organizationLd, websiteLd)} />
      </head>
      <body className="font-sans antialiased bg-ivory text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:font-bold focus:text-white"
        >
          Skip to content
        </a>
        <ScrollProgress />
        <SmoothScroll>
          {children}
          <Footer />
        </SmoothScroll>
        <ScrollToTop />
        <SpeedInsights />
      </body>
    </html>
  );
}
