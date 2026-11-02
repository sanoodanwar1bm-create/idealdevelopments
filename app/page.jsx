// app/page.jsx
import HomeContent from "./HomeContent";
import JsonLd from "@components/JsonLd";
import faqs from "@lib/faqs.json";
import services from "@lib/services.json";
import {
  DEFAULT_DESCRIPTION,
  ORGANIZATION_ID,
  WEBSITE_ID,
  graph,
  pageMeta,
  url,
} from "@lib/seo";

export const metadata = {
  ...pageMeta({
    title: "Construction Company in Islamabad | IDEAL Developments — We Build with Ihsan",
    description: DEFAULT_DESCRIPTION,
    path: "/",
  }),
  // The root layout already sets the default title; keep the homepage's own.
  title: {
    absolute: "Construction Company in Islamabad | IDEAL Developments — We Build with Ihsan",
  },
};

const homeLd = graph(
  {
    "@type": "WebPage",
    "@id": `${url("/")}/#webpage`,
    url: url("/"),
    name: "IDEAL Developments — design and build homes in Islamabad",
    description: DEFAULT_DESCRIPTION,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
    inLanguage: "en-PK",
  },
  {
    "@type": "FAQPage",
    "@id": `${url("/")}/#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
  {
    "@type": "ItemList",
    "@id": `${url("/")}/#services`,
    name: "Construction services offered by IDEAL Developments",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.title,
      url: url(`/service/${s.slug}`),
    })),
  }
);

export default function Home() {
  return (
    <main id="main">
      <JsonLd data={homeLd} />
      <HomeContent />
    </main>
  );
}
