import Navbar from "@components/Navbar";
import CallToAction from "@components/CallToAction";
import JsonLd from "@components/JsonLd";
import AboutContent from "./AboutContent";
import { ORGANIZATION_ID, WEBSITE_ID, breadcrumbLd, graph, pageMeta, url } from "@lib/seo";

const description =
  "Who we are, what we do and what we stand for. IDEAL Developments is a design-and-build company in Islamabad delivering homes with certified materials, honest budgets and Islamic business ethics.";

export const metadata = pageMeta({
  title: "About Us — Who We Are, Vision, Mission & Values",
  description,
  path: "/about",
});

const ld = graph(
  {
    "@type": "AboutPage",
    "@id": `${url("/about")}#webpage`,
    url: url("/about"),
    name: "About IDEAL Developments",
    description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
    inLanguage: "en-PK",
  },
  breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ])
);

export default function AboutPage() {
  return (
    <main id="main">
      <JsonLd data={ld} />
      <Navbar />
      <AboutContent />
      <CallToAction />
    </main>
  );
}
