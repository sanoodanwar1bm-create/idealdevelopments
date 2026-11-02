import { notFound } from "next/navigation";
import servicesData from "@lib/services.json";
import JsonLd from "@components/JsonLd";
import ServiceDetail from "./ServiceDetail";
import {
  ORGANIZATION_ID,
  WEBSITE_ID,
  absolute,
  breadcrumbLd,
  graph,
  pageMeta,
  url,
} from "@lib/seo";

// Search-facing titles: what people actually type, not the internal service name.
const SEO_TITLES = {
  "project-management": "Construction Project Management & Consultancy in Islamabad",
  "residential-construction": "Residential House Construction in Islamabad — 5 Marla to 1 Kanal",
  "architectural-design": "Architectural & 3D Front Elevation Design in Islamabad",
  "renovation-remodeling": "House Renovation & Remodeling Services in Islamabad",
  "investor-partnership": "Halal Real Estate Investment — 60/40 Shariah Partnership",
};

export async function generateStaticParams() {
  return servicesData.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = servicesData.find((s) => s.slug === slug);
  if (!service) return {};
  return pageMeta({
    title: SEO_TITLES[slug] ?? service.title,
    description: service.description,
    path: `/service/${slug}`,
    images: [service.image],
  });
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const service = servicesData.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const path = `/service/${slug}`;
  const ld = graph(
    {
      "@type": "Service",
      "@id": `${url(path)}#service`,
      name: service.title,
      serviceType: service.title,
      description: service.longDescription,
      image: absolute(service.image),
      url: url(path),
      provider: { "@id": ORGANIZATION_ID },
      areaServed: [
        { "@type": "City", name: "Islamabad" },
        { "@type": "City", name: "Rawalpindi" },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `${service.title} — what's included`,
        itemListElement: service.features.map((f) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: f },
        })),
      },
    },
    {
      "@type": "HowTo",
      "@id": `${url(path)}#howto`,
      name: `How our ${service.title.toLowerCase()} works`,
      description: service.description,
      step: service.ourProcess.map((st, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: st.title,
        text: st.description,
      })),
    },
    {
      "@type": "WebPage",
      "@id": `${url(path)}#webpage`,
      url: url(path),
      name: SEO_TITLES[slug] ?? service.title,
      description: service.description,
      isPartOf: { "@id": WEBSITE_ID },
      primaryImageOfPage: absolute(service.image),
      inLanguage: "en-PK",
    },
    breadcrumbLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: service.title, path },
    ])
  );

  return (
    <>
      <JsonLd data={ld} />
      <ServiceDetail service={service} />
    </>
  );
}
