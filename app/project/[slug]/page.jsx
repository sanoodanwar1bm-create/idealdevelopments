import { notFound } from "next/navigation";
import projects from "@lib/projects.json";
import JsonLd from "@components/JsonLd";
import ProjectDetail from "./ProjectDetail";
import {
  ORGANIZATION_ID,
  WEBSITE_ID,
  absolute,
  breadcrumbLd,
  graph,
  pageMeta,
  url,
} from "@lib/seo";

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return pageMeta({
    title: `${project.title} in ${project.location} — ${project.size} Build`,
    description: `${project.description} Built by IDEAL Developments in ${project.duration}.`,
    path: `/project/${slug}`,
    images: project.images,
  });
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);

  if (index === -1) {
    notFound();
  }

  const project = projects[index];
  const path = `/project/${slug}`;
  const ld = graph(
    {
      "@type": ["CreativeWork", "Residence"],
      "@id": `${url(path)}#project`,
      name: project.title,
      description: project.description,
      url: url(path),
      image: project.images?.map(absolute),
      creator: { "@id": ORGANIZATION_ID },
      locationCreated: { "@type": "Place", name: project.location, address: project.location },
      additionalProperty: [
        { "@type": "PropertyValue", name: "Plot size", value: project.size },
        { "@type": "PropertyValue", name: "Build duration", value: project.duration },
        { "@type": "PropertyValue", name: "Design style", value: project.design },
        { "@type": "PropertyValue", name: "Budget", value: project.budget },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${url(path)}#webpage`,
      url: url(path),
      name: `${project.title} — ${project.size}, ${project.location}`,
      description: project.description,
      isPartOf: { "@id": WEBSITE_ID },
      primaryImageOfPage: absolute(project.images?.[0]),
      inLanguage: "en-PK",
    },
    breadcrumbLd([
      { name: "Home", path: "/" },
      { name: "Projects", path: "/projects" },
      { name: project.title, path },
    ])
  );

  return (
    <>
      <JsonLd data={ld} />
      <ProjectDetail project={project} index={index} />
    </>
  );
}
