"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, MapPin, Ruler, Timer, Wallet, Sparkles } from "lucide-react";
import projects from "@lib/projects.json";
import SectionHeading from "@components/ui/SectionHeading";
import { FadeUp } from "@components/ui/Reveal";

const EASE = [0.16, 1, 0.3, 1];

const marlaValue = (size) => parseInt(size, 10) || 0;

function Card({ project, index, featured }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.5, ease: EASE, delay: Math.min(index * 0.05, 0.3) }}
      className={featured ? "sm:col-span-2" : ""}
    >
      <Link href={`/project/${project.slug}`} className="group block h-full">
        <div
          className={`relative overflow-hidden rounded-[1.75rem] bg-ink/10 shadow-soft transition-shadow duration-500 group-hover:shadow-lift ${
            featured ? "aspect-[4/3] sm:aspect-[16/10]" : "aspect-[4/5]"
          }`}
        >
          <Image
            src={project.images[0]}
            alt={project.title}
            fill
            sizes={featured ? "(max-width: 640px) 100vw, 760px" : "(max-width: 640px) 100vw, 380px"}
            className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent opacity-90" />

          {/* Badges */}
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-ink backdrop-blur">
              {project.size}
            </span>
            <span className="rounded-full bg-ink/50 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
              {project.design}
            </span>
          </div>
          <span className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-all duration-500 group-hover:rotate-45 group-hover:bg-gold-500 group-hover:text-ink">
            <ArrowUpRight size={20} />
          </span>

          {/* Content */}
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <h3
              className={`font-display font-bold leading-tight tracking-tight text-white ${
                featured ? "text-2xl sm:text-3xl" : "text-xl"
              }`}
            >
              {project.title}
            </h3>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-white/75">
              <span className="flex items-center gap-1.5">
                <MapPin size={13} className="text-gold-400" />
                {project.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Timer size={13} className="text-gold-400" />
                {project.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <Wallet size={13} className="text-gold-400" />
                {project.budget}
              </span>
            </div>
            <p className="mt-3 max-h-0 overflow-hidden text-sm leading-relaxed text-white/80 opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
              {project.description}
            </p>
          </div>
        </div>
      </Link>
    </motion.li>
  );
}

export default function ProjectsGallery({ innerRef }) {
  const sizes = useMemo(
    () => [...new Set(projects.map((p) => p.size))].sort((a, b) => marlaValue(a) - marlaValue(b)),
    []
  );
  const [filter, setFilter] = useState("All");
  const shown = filter === "All" ? projects : projects.filter((p) => p.size === filter);

  const materials = useMemo(
    () => [...new Set(projects.flatMap((p) => [...(p.premiumMaterials ?? []), ...(p.features ?? [])]))],
    []
  );

  return (
    <>
      <section ref={innerRef} id="gallery" className="scroll-mt-24 bg-ivory py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading
              index="01"
              eyebrow="The portfolio"
              title="Every home,"
              accent="a trust fulfilled."
              description="Browse by plot size. Each project page shows the layout, the finishes and the challenges we solved."
            />
            {/* Filters */}
            <FadeUp delay={0.15} className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:px-0">
              {["All", ...sizes].map((s) => {
                const on = s === filter;
                return (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    aria-pressed={on}
                    className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition-colors duration-300 ${
                      on ? "text-white" : "text-ink/60 hover:text-ink"
                    }`}
                  >
                    {on && (
                      <motion.span
                        layoutId="filter-pill"
                        className="absolute inset-0 rounded-full bg-ink"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">
                      {s}
                      <span className={on ? "text-gold-400" : "text-ink/35"}>
                        {" "}
                        {s === "All" ? projects.length : projects.filter((p) => p.size === s).length}
                      </span>
                    </span>
                  </button>
                );
              })}
            </FadeUp>
          </div>

          <motion.ul layout className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {shown.map((p, i) => (
                <Card key={p.slug} project={p} index={i} featured={filter === "All" && i === 0} />
              ))}
            </AnimatePresence>
          </motion.ul>
        </div>
      </section>

      {/* Finishes & features across the portfolio */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#e2eaf0,#d5e1ea)] py-20 sm:py-28">
        <div className="absolute inset-0 bg-blueprint opacity-50 mask-fade-edges" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <FadeUp className="flex items-center gap-3">
            <Sparkles size={18} className="text-teal" />
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-ink/60">
              Finishes &amp; features across these homes
            </span>
          </FadeUp>
          <FadeUp delay={0.1} className="mt-8 flex flex-wrap gap-2.5">
            {materials.map((m, i) => (
              <motion.span
                key={m}
                data-reveal=""
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.03, 0.6), duration: 0.5 }}
                className="rounded-full border border-ink/10 bg-white/80 px-4 py-2 text-sm font-semibold text-ink/75 shadow-soft backdrop-blur transition-colors hover:border-teal/40 hover:text-ink"
              >
                {m}
              </motion.span>
            ))}
          </FadeUp>
        </div>
      </section>
    </>
  );
}
