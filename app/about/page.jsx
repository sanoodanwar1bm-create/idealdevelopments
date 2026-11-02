import Navbar from "@components/Navbar";
import CallToAction from "@components/CallToAction";
import JsonLd from "@components/JsonLd";
import AboutContent from "./AboutContent";
import { ORGANIZATION_ID, WEBSITE_ID, breadcrumbLd, graph, pageMeta, url } from "@lib/seo";

const description =
  "Meet the Islamabad design-and-build team behind IDEAL Developments. Led by COO Sanood Anwar, we deliver homes with certified materials, honest budgets and Islamic business ethics.";

export const metadata = pageMeta({
  title: "About Us — Our Team, Values & Way of Building",
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
