"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, MapPin } from "lucide-react";
import projects from "@lib/projects.json";
import { WordReveal } from "@components/ui/Reveal";
import MagneticButton from "@components/ui/MagneticButton";
import { WHATSAPP_LINK } from "@lib/site";

const EASE = [0.16, 1, 0.3, 1];

// Split the portfolio into columns that drift at different speeds.
const COLUMNS = [
  { items: [0, 3, 5], duration: "38s", className: "" },
  { items: [1, 4, 6], duration: "48s", className: "mt-[-6rem]" },
  { items: [2, 5, 0], duration: "44s", className: "mt-[-3rem] hidden xl:block" },
];

function Tile({ project, priority }) {
  return (
    <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-2xl shadow-soft">
      <Image
        src={project.images[0]}
        alt={project.title}
        fill
        sizes="(max-width: 1024px) 45vw, 260px"
        priority={priority}
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
      <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-ink">
        {project.size}
      </span>
    </div>
  );
}

export default function ProjectsHero({ facts, scrollToGallery }) {
  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(165deg,#dfe8ef_0%,#e9e5da_55%,#efe4d2_100%)] pb-16 pt-24 lg:pb-24 lg:pt-32">
      <div className="absolute inset-0 -z-10 bg-blueprint opacity-60 mask-fade-edges" />
      <div className="absolute -right-32 top-10 -z-10 h-[32rem] w-[32rem] rounded-full bg-white/50 blur-[120px]" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mb-6 flex items-center gap-3"
          >
            <span className="font-display text-sm font-semibold text-teal">IDEAL</span>
            <span className="h-px w-10 bg-ink/25" />
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-ink/60">Our projects</span>
          </motion.div>

          <h1 className="font-display text-[clamp(2.6rem,5vw,4.75rem)] font-bold leading-[0.98] tracking-tightest text-ink">
            <WordReveal text="Homes we have" show delay={0.1} />
            <br />
            <WordReveal text="handed over" show delay={0.3} />{" "}
            <WordReveal text="with pride." show delay={0.45} className="font-quote font-normal italic text-teal" />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-ink/65 sm:text-xl"
          >
            Modern residences across Islamabad, from compact 5 Marla homes to spacious 10 Marla
            family houses. Every one built with certified materials and an honest budget.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <MagneticButton href={WHATSAPP_LINK} external variant="dark">
              Plan your home
            </MagneticButton>
            <button
              onClick={scrollToGallery}
              className="group inline-flex items-center gap-2 rounded-full px-5 py-3 text-[15px] font-bold text-ink transition-colors hover:bg-white/60"
            >
              Browse the portfolio
              <ArrowDown size={17} className="transition-transform group-hover:translate-y-0.5" />
            </button>
          </motion.div>

          <motion.dl
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.85 } } }}
            className="mt-12 grid max-w-xl grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4"
          >
            {facts.map((f) => (
              <motion.div key={f.label} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
                <dd className="font-display text-2xl font-bold tracking-tight text-ink">{f.value}</dd>
                <dt className="mt-1 text-[11px] font-bold uppercase leading-snug tracking-[0.14em] text-ink/50">{f.label}</dt>
              </motion.div>
            ))}
          </motion.dl>
        </div>

        {/* Drifting photo columns */}
        <div className="relative order-first lg:order-none">
          <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
          className="relative -mx-5 h-[17rem] overflow-hidden [mask-image:linear-gradient(180deg,transparent,#000_14%,#000_86%,transparent)] sm:mx-0 sm:h-[24rem] lg:h-[34rem]"
          aria-hidden
        >
          
          <div className="grid grid-cols-2 gap-4 px-5 sm:px-0 xl:grid-cols-3">
            {COLUMNS.map((col, ci) => (
              <div key={ci} className={`overflow-hidden ${col.className}`}>
                <div
                  className="animate-marquee-y will-change-transform"
                  style={{ "--marquee-duration": col.duration }}
                >
                  {[...col.items, ...col.items].map((idx, i) => (
                    <Tile key={i} project={projects[idx]} priority={ci === 0 && i === 0} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          </motion.div>
          <span className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5 text-xs font-bold text-ink shadow-soft backdrop-blur">
            <MapPin size={13} className="text-teal" />
            Islamabad
          </span>
        </div>
      </div>
    </section>
  );
}
