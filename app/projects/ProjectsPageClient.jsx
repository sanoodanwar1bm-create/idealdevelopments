"use client";

import { useMemo, useRef } from "react";
import projects from "@lib/projects.json";
import ProjectsHero from "./ProjectsHero";
import ProjectsGallery from "./ProjectsGallery";
import { getLenis } from "@components/SmoothScroll";

export default function ProjectsPageClient() {
  const gallery = useRef(null);

  // Everything here is derived from the portfolio itself, not invented.
  const facts = useMemo(() => {
    const sizes = [...new Set(projects.map((p) => p.size))];
    const value = (s) => parseInt(s, 10) || 0;
    const range = sizes.sort((a, b) => value(a) - value(b));
    return [
      { value: `${projects.length}`, label: "Featured homes" },
      { value: `${range[0]} – ${range[range.length - 1]}`, label: "Plot sizes" },
      { value: "Islamabad", label: "Where we build" },
      { value: projects[0].duration, label: "Typical build" },
    ];
  }, []);

  const scrollToGallery = () => {
    const el = gallery.current;
    if (!el) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el, { offset: -80, duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <ProjectsHero facts={facts} scrollToGallery={scrollToGallery} />
      <ProjectsGallery innerRef={gallery} />
    </>
  );
}
