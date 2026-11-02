"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@components/motion/gsap";
import { ArrowUpRight, MapPin, Ruler, Timer } from "lucide-react";
import projects from "@lib/projects.json";
import SectionHeading from "@components/ui/SectionHeading";

gsap.registerPlugin(useGSAP);

function ProjectCard({ project, index }) {
  return (
    <Link
      href={`/project/${project.slug}`}
      className="project-card group relative block h-[62svh] max-h-[560px] min-h-[380px] w-[82vw] shrink-0 snap-center overflow-hidden rounded-[2rem] bg-ink/30 shadow-lift sm:w-[60vw] lg:w-[38vw] lg:max-w-[560px]"
    >
      <div className="project-img absolute inset-y-0 -left-[10%] w-[120%]">
        <Image
          src={project.images[0]}
          alt={project.title}
          fill
          sizes="(max-width: 1024px) 82vw, 560px"
          className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />

      <div className="absolute left-5 top-5 flex gap-2">
        <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-ink backdrop-blur">
          {project.size}
        </span>
        <span className="rounded-full bg-ink/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
          {project.design}
        </span>
      </div>
      <span className="absolute right-5 top-5 font-display text-sm font-semibold text-white/80">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
        <h3 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{project.title}</h3>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/75">
          <span className="flex items-center gap-1.5">
            <MapPin size={14} className="text-gold-400" />
            {project.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Ruler size={14} className="text-gold-400" />
            {project.size}
          </span>
          <span className="flex items-center gap-1.5">
            <Timer size={14} className="text-gold-400" />
            {project.duration}
          </span>
        </div>
        <div className="mt-5 flex max-h-0 items-center gap-2 overflow-hidden text-sm font-bold text-gold-400 opacity-0 transition-all duration-500 group-hover:max-h-10 group-hover:opacity-100">
          View project <ArrowUpRight size={16} />
        </div>
      </div>
    </Link>
  );
}

export default function OurProjects() {
  const section = useRef(null);
  const track = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const distance = () => track.current.scrollWidth - window.innerWidth;
        const scroll = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        // Parallax inside each photo as it crosses the screen
        gsap.utils.toArray(".project-card").forEach((card) => {
          gsap.fromTo(
            card.querySelector(".project-img"),
            { xPercent: 6 },
            {
              xPercent: -6,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: scroll,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        });
      });
      return () => mm.revert();
    },
    { scope: section }
  );

  return (
    <section ref={section} id="projects" className="relative overflow-hidden bg-[linear-gradient(135deg,#2f6c78_0%,#3a7f86_55%,#4a8f86_100%)]">
      <div className="flex min-h-[100svh] flex-col justify-center py-20 lg:py-0">
        <div
          ref={track}
          className="no-scrollbar flex snap-x snap-mandatory items-center gap-5 overflow-x-auto px-5 sm:px-8 lg:w-max lg:snap-none lg:gap-8 lg:overflow-visible lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pr-24"
        >
          {/* Intro panel */}
          <div className="w-[82vw] shrink-0 snap-start sm:w-[60vw] lg:w-[34rem] lg:pr-10">
            <SectionHeading
              index="04"
              eyebrow="Selected work"
              title="Homes crafted with Ihsan,"
              accent="designed for life."
              description="A look at recent residences across Islamabad, from compact 5 Marla homes to spacious 10 Marla family houses."
              tone="light"
            />
            <p className="mt-8 hidden items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-white/60 lg:flex">
              <span className="h-px w-12 bg-white/40" /> Keep scrolling
            </p>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-white/60 lg:hidden">
              Swipe to explore →
            </p>
          </div>

          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}

          {/* Outro */}
          <Link
            href="/projects"
            className="group grid h-[62svh] max-h-[560px] min-h-[380px] w-[70vw] shrink-0 snap-center place-items-center rounded-[2rem] border-2 border-dashed border-white/30 transition-colors duration-500 hover:border-gold-400 hover:bg-white/10 sm:w-[40vw] lg:w-[24rem]"
          >
            <span className="text-center">
              <span className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gold-500 text-ink transition-transform duration-500 group-hover:rotate-45 group-hover:scale-110">
                <ArrowUpRight size={36} />
              </span>
              <span className="mt-6 block font-display text-2xl font-bold tracking-tight text-white">
                View all projects
              </span>
              <span className="mt-1 block text-sm text-white/60">Full portfolio &amp; details</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
