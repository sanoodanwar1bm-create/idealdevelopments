// Central SEO configuration. Change SITE_URL here (or via NEXT_PUBLIC_SITE_URL)
// and every canonical, sitemap entry, OG tag and JSON-LD node follows.

import { ADDRESS, EMAIL, HOURS_ROWS, MAPS_LINK, PHONE_INTL } from "./site";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.idealconstruction.com.pk"
).replace(/\/$/, "");

export const SITE_NAME = "IDEAL Developments";
export const SITE_TAGLINE = "We Build with Ihsan";
export const LOCALE = "en_PK";

export const DEFAULT_DESCRIPTION =
  "Design-and-build construction company in Islamabad. We build 5 Marla to 1 Kanal homes with certified materials, lab reports, transparent budgets and Shariah-guided dealings.";

export const KEYWORDS = [
  "construction company Islamabad",
  "house construction Islamabad",
  "5 marla house construction",
  "10 marla house design",
  "1 kanal house construction",
  "grey structure rates Islamabad",
  "architectural design Islamabad",
  "3D front elevation design",
  "home renovation Islamabad",
  "halal investment real estate Pakistan",
  "Shariah compliant construction",
  "design and build Pakistan",
  "Multi Garden B-17 construction",
  "IDEAL Developments",
];

export const url = (path = "/") => `${SITE_URL}${path === "/" ? "" : path}`;

export const absolute = (src) =>
  !src ? undefined : /^https?:\/\//.test(src) ? src : `${SITE_URL}${src.startsWith("/") ? "" : "/"}${src}`;

/**
 * Build a page's metadata: canonical URL, Open Graph and Twitter cards.
 * Pages that don't pass an image inherit the generated site-wide OG image.
 */
export function pageMeta({ title, description, path = "/", images, type = "website", published, modified }) {
  const canonical = url(path);
  const og = images?.length ? images.map((i) => ({ url: absolute(i) })) : undefined;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type,
      url: canonical,
      siteName: SITE_NAME,
      locale: LOCALE,
      title,
      description,
      ...(og ? { images: og } : {}),
      ...(published ? { publishedTime: published } : {}),
      ...(modified ? { modifiedTime: modified } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(og ? { images: og.map((i) => i.url) } : {}),
    },
  };
}

/* ---------------------------------------------------------------- JSON-LD */

const openingHours = HOURS_ROWS.filter((r) => !/closed/i.test(r.time)).map((r) => {
  const days = r.day
    .split(/–|-/)
    .map((d) => d.trim())
    .filter(Boolean);
  const to24 = (t) => {
    const [, h, m, ap] = t.trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i) ?? [];
    let hh = Number(h) % 12;
    if (/pm/i.test(ap)) hh += 12;
    return `${String(hh).padStart(2, "0")}:${m}`;
  };
  const [open, close] = r.time.split(/–|-/).map(to24);
  return {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: days.length === 2 ? expandDays(days[0], days[1]) : days,
    opens: open,
    closes: close,
  };
});

function expandDays(from, to) {
  const week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const a = week.indexOf(from);
  const b = week.indexOf(to);
  return a === -1 || b === -1 ? [from, to] : week.slice(a, b + 1);
}

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const organizationLd = {
  "@type": ["GeneralContractor", "HomeAndConstructionBusiness", "LocalBusiness"],
  "@id": ORGANIZATION_ID,
  name: SITE_NAME,
  alternateName: "Ideal Developments",
  legalName: "IDEAL Developments",
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: absolute("/logo.png"), width: 1542, height: 540 },
  image: absolute("/opengraph-image"),
  description: DEFAULT_DESCRIPTION,
  slogan: SITE_TAGLINE,
  telephone: PHONE_INTL,
  email: EMAIL,
  priceRange: "$$",
  currenciesAccepted: "PKR",
  address: {
    "@type": "PostalAddress",
    streetAddress: "House 723, E Block, Multigardens B-17",
    addressLocality: "Islamabad",
    addressRegion: "Islamabad Capital Territory",
    postalCode: "44000",
    addressCountry: "PK",
  },
  hasMap: MAPS_LINK,
  openingHoursSpecification: openingHours,
  areaServed: [
    { "@type": "City", name: "Islamabad" },
    { "@type": "City", name: "Rawalpindi" },
  ],
  sameAs: [
    "https://www.instagram.com/idealconstructions",
    "https://www.facebook.com/idealconstructions",
    "https://www.linkedin.com/company/idealconstructions",
  ],
  knowsAbout: [
    "Residential construction",
    "Architectural and 3D elevation design",
    "Renovation and remodeling",
    "Construction project management",
    "Shariah-compliant real estate investment",
  ],
};

export const websiteLd = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  inLanguage: "en-PK",
  publisher: { "@id": ORGANIZATION_ID },
};

export const breadcrumbLd = (trail) => ({
  "@type": "BreadcrumbList",
  itemListElement: trail.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.name,
    item: url(t.path),
  })),
});

/** Wraps nodes in a single @graph so one script tag carries the whole page. */
export const graph = (...nodes) => ({
  "@context": "https://schema.org",
  "@graph": nodes.flat().filter(Boolean),
});
