import Navbar from "@components/Navbar";
import CallToAction from "@components/CallToAction";
import JsonLd from "@components/JsonLd";
import ContactContent from "./ContactContent";
import { ORGANIZATION_ID, WEBSITE_ID, breadcrumbLd, graph, pageMeta, url } from "@lib/seo";

const description =
  "Talk to IDEAL Developments on WhatsApp, by phone or email. Office at House 723, E Block, Multigardens B-17, Islamabad. Open Mon–Fri 9AM–6PM, Sat 10AM–4PM.";

export const metadata = pageMeta({
  title: "Contact Us — Free Site Visit & Quote in Islamabad",
  description,
  path: "/contact",
});

const ld = graph(
  {
    "@type": "ContactPage",
    "@id": `${url("/contact")}#webpage`,
    url: url("/contact"),
    name: "Contact IDEAL Developments",
    description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
    inLanguage: "en-PK",
  },
  breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ])
);

export default function ContactPage() {
  return (
    <main id="main">
      <JsonLd data={ld} />
      <Navbar />
      <ContactContent />
      <CallToAction />
    </main>
  );
}
