import Navbar from "@components/Navbar";
import Marquee from "@components/Marquee";
import CallToAction from "@components/CallToAction";
import JsonLd from "@components/JsonLd";
import ServicesHero from "./ServicesHero";
import ServiceChapters from "./ServiceChapters";
import services from "@lib/services.json";
import { ORGANIZATION_ID, WEBSITE_ID, breadcrumbLd, graph, pageMeta, url } from "@lib/seo";

const description =
  "Project management, residential construction, architectural and 3D elevation design, renovation, and a Shariah-compliant 60/40 investor partnership — all delivered in Islamabad by one team.";

export const metadata = pageMeta({
  title: "Construction Services in Islamabad — Design, Build, Renovate & Invest",
  description,
  path: "/services",
});

const ld = graph(
  {
    "@type": "CollectionPage",
    "@id": `${url("/services")}#webpage`,
    url: url("/services"),
    name: "Our construction services",
    description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
    inLanguage: "en-PK",
  },
  {
    "@type": "ItemList",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.title,
      description: s.description,
      url: url(`/service/${s.slug}`),
    })),
  },
  breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
  ])
);

export default function ServicesPage() {
  return (
    <main id="main">
      <JsonLd data={ld} />
      <Navbar />
      <ServicesHero />
      <Marquee />
      <ServiceChapters />
      <CallToAction />
    </main>
  );
}
