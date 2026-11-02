import services from "@lib/services.json";
import projects from "@lib/projects.json";
import blogs from "@lib/blogs.json";
import { SITE_URL } from "@lib/seo";

const entry = (path, priority, changeFrequency, lastModified = new Date()) => ({
  url: `${SITE_URL}${path === "/" ? "" : path}`,
  lastModified,
  changeFrequency,
  priority,
});

export default function sitemap() {
  return [
    entry("/", 1, "weekly"),
    entry("/services", 0.9, "monthly"),
    entry("/projects", 0.9, "weekly"),
    entry("/about", 0.7, "yearly"),
    entry("/contact", 0.7, "yearly"),
    entry("/blogs", 0.6, "weekly"),
    ...services.map((s) => entry(`/service/${s.slug}`, 0.8, "monthly")),
    ...projects.map((p) => entry(`/project/${p.slug}`, 0.7, "monthly")),
    ...blogs.map((b) => entry(`/blog/${b.slug}`, 0.5, "yearly", new Date(b.date))),
  ];
}
