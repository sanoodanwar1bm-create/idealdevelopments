import Navbar from "@components/Navbar";
import CallToAction from "@components/CallToAction";
import JsonLd from "@components/JsonLd";
import ProjectsPageClient from "./ProjectsPageClient";
import projects from "@lib/projects.json";
import { ORGANIZATION_ID, WEBSITE_ID, absolute, breadcrumbLd, graph, pageMeta, url } from "@lib/seo";

const description =
  "Completed 5 Marla, 7 Marla, 10 Marla and 1 Kanal homes built by IDEAL Developments in Islamabad — with real budgets, build durations and the materials used on each project.";

export const metadata = pageMeta({
  title: "Our Projects — 5, 7 & 10 Marla Homes Built in Islamabad",
  description,
  path: "/projects",
  images: projects[0]?.images?.slice(0, 1),
});

const ld = graph(
  {
    "@type": "CollectionPage",
    "@id": `${url("/projects")}#webpage`,
    url: url("/projects"),
    name: "Our completed projects",
    description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
    inLanguage: "en-PK",
  },
  {
    "@type": "ItemList",
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${p.title} — ${p.size}, ${p.location}`,
      url: url(`/project/${p.slug}`),
      image: absolute(p.images?.[0]),
    })),
  },
  breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
  ])
);

export default function ProjectsPage() {
  return (
    <main id="main">
      <JsonLd data={ld} />
      <Navbar />
      <ProjectsPageClient />
      <CallToAction />
    </main>
  );
}
