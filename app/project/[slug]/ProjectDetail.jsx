"use client";

import { useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  MapPin,
  Ruler,
  Timer,
  Wallet,
  Sparkles,
  Compass,
  Lightbulb,
  Phone,
} from "lucide-react";
import projects from "@lib/projects.json";
import Navbar from "@components/Navbar";
import CallToAction from "@components/CallToAction";
import MagneticButton from "@components/ui/MagneticButton";
import SectionHeading from "@components/ui/SectionHeading";
import ScrollHighlight from "@components/ui/ScrollHighlight";
import { FadeUp, WordReveal } from "@components/ui/Reveal";
import { PHONE_TEL, whatsappForProject } from "@lib/site";

const ConstructionScene = dynamic(() => import("@components/three/ConstructionScene"), { ssr: false });

const EASE = [0.16, 1, 0.3, 1];

const MILESTONES = ["Design & approvals", "Grey structure", "Finishes", "Handover"];

function Hero({ project, index }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-[92svh] min-h-[560px] w-full overflow-hidden bg-ink">
      <motion.div style={{ scale, y }} className="absolute inset-0">
        <Image
          src={project.images[0]}
          alt={project.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/25" />

      <motion.div
        style={{ opacity: fade }}
        className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-16 sm:px-8 sm:pb-20"
      >
        <motion.nav
          aria-label="Breadcrumb"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-white/70"
        >
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link href="/projects" className="hover:text-white">
            Projects
          </Link>
          <ChevronRight size={14} />
          <span className="text-white">{project.title}</span>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="mt-7 flex flex-wrap items-center gap-2"
        >
          <span className="rounded-full bg-gold-500 px-3.5 py-1.5 text-xs font-bold text-ink">{project.size}</span>
          <span className="rounded-full border border-white/25 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur">
            {project.design}
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-white/25 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur">
            <MapPin size={13} className="text-gold-400" />
            {project.location}
          </span>
          <span className="ml-auto hidden font-display text-sm font-semibold text-white/50 sm:block">
            Project {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </span>
        </motion.div>

        <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.4rem,5.6vw,5rem)] font-bold leading-[1] tracking-tightest text-white">
          <WordReveal text={project.title} show delay={0.3} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80"
        >
          {project.description}
        </motion.p>
      </motion.div>
    </section>
  );
}

function SpecBar({ project }) {
  const specs = [
    { icon: Ruler, label: "Plot size", value: project.size },
    { icon: Wallet, label: "Budget", value: project.budget },
    { icon: Timer, label: "Timeline", value: project.duration },
    { icon: Compass, label: "Design", value: project.design },
  ];
  return (
    <div className="relative z-20 mx-auto -mt-14 max-w-7xl px-5 sm:px-8">
      <FadeUp className="grid grid-cols-2 overflow-hidden rounded-3xl border border-white/70 bg-white/85 shadow-lift backdrop-blur-xl lg:grid-cols-4">
        {specs.map(({ icon: Icon, label, value }, i) => (
          <div
            key={label}
            className={`flex items-center gap-4 p-5 sm:p-6 ${i % 2 === 0 ? "border-r" : ""} ${
              i < 2 ? "border-b lg:border-b-0" : ""
            } ${i === 1 ? "lg:border-r" : ""} border-ink/10`}
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink text-gold-400">
              <Icon size={19} />
            </span>
            <span className="min-w-0">
              <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-ink/50">{label}</span>
              <span className="mt-0.5 block font-display text-lg font-bold leading-tight tracking-tight text-ink">
                {value}
              </span>
            </span>
          </div>
        ))}
      </FadeUp>
    </div>
  );
}

function Brief({ project }) {
  return (
    <section className="bg-ivory pb-24 pt-20 sm:pb-32 sm:pt-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeUp className="mb-8 flex items-center gap-3">
          <span className="font-display text-sm font-semibold text-teal">01</span>
          <span className="h-px w-10 bg-ink/20" />
          <span className="text-xs font-bold uppercase tracking-[0.28em] text-ink/60">The brief</span>
        </FadeUp>
        <ScrollHighlight
          text={project.description}
          className="max-w-4xl font-display text-[clamp(1.5rem,3.2vw,2.6rem)] font-semibold leading-[1.25] tracking-tight text-ink"
        />

        {project.challengesOvercome && (
          <FadeUp
            delay={0.15}
            className="relative mt-14 overflow-hidden rounded-[2rem] bg-ink p-7 text-white sm:p-10 lg:max-w-3xl"
          >
            <Lightbulb className="absolute -right-6 -top-6 h-40 w-40 text-white/5" strokeWidth={1} />
            <p className="relative text-xs font-bold uppercase tracking-[0.25em] text-gold-400">
              The challenge we solved
            </p>
            <p className="relative mt-4 font-quote text-xl italic leading-relaxed sm:text-2xl">
              {project.challengesOvercome}
            </p>
          </FadeUp>
        )}
      </div>
    </section>
  );
}

function Details({ project }) {
  const lists = [
    { title: "Features", icon: Check, items: project.features ?? [], accent: "bg-teal/15 text-teal" },
    { title: "Premium materials", icon: Sparkles, items: project.premiumMaterials ?? [], accent: "bg-gold-500/20 text-gold-600" },
  ];

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#e2eaf0,#d5e1ea)] py-24 sm:py-32">
      <div className="absolute inset-0 bg-blueprint opacity-50 mask-fade-edges" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading index="02" eyebrow="Inside this home" title="Specified," accent="down to the finishes." />

        <div className="mt-14 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Photo */}
          <FadeUp className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-lift lg:aspect-auto">
            <Image
              src={project.images[0]}
              alt={project.title}
              fill
              sizes="(max-width: 1024px) 100vw, 700px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
          </FadeUp>

          <div className="grid gap-5">
            {lists.map(({ title, icon: Icon, items, accent }, li) => (
              <FadeUp key={title} delay={0.1 + li * 0.1} className="rounded-[2rem] bg-white p-7 shadow-soft sm:p-8">
                <h3 className="font-display text-xl font-bold tracking-tight text-ink">{title}</h3>
                <ul className="mt-5 space-y-3">
                  {items.map((item, i) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + i * 0.07, duration: 0.5 }}
                      className="flex items-center gap-3 text-[15px] font-semibold text-ink"
                    >
                      <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${accent}`}>
                        <Icon size={13} strokeWidth={3} />
                      </span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Scroll-driven build of the house, labelled with this project's timeline.
function BuildBand({ project }) {
  const ref = useRef(null);
  const progress = useRef(0);
  // Finish the build by the time the section is centred on screen, so the
  // completed house is what the visitor actually looks at.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.current = Math.min(1, Math.max(0, v / 0.85));
  });

  return (
    <section ref={ref} className="relative overflow-hidden bg-[linear-gradient(180deg,#dcebe5,#cbe0d8)] py-20 sm:py-28">
      <div className="absolute inset-0 bg-blueprint opacity-60 mask-fade-edges" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-5 sm:px-8 lg:grid-cols-2">
        <div className="min-w-0">
          <FadeUp className="flex items-center gap-3">
            <span className="font-display text-sm font-semibold text-teal">03</span>
            <span className="h-px w-10 bg-ink/20" />
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-ink/60">How it came up</span>
          </FadeUp>
          <h2 className="mt-6 font-display text-[clamp(1.9rem,4vw,3.25rem)] font-bold leading-[1.05] tracking-tightest text-ink">
            <WordReveal text="From plot to keys in" />{" "}
            <WordReveal text={project.duration} delay={0.3} className="font-quote font-normal italic text-teal" />
          </h2>
          <FadeUp delay={0.15} as="p" className="mt-5 max-w-lg text-lg leading-relaxed text-ink/65">
            Supervised by certified engineers, with lab-tested materials and an update at every milestone.
            Scroll to watch this {project.size} home come together.
          </FadeUp>

          <ol className="mt-8 grid gap-3 sm:grid-cols-2">
            {MILESTONES.map((m, i) => (
              <FadeUp key={m} as="li" delay={0.2 + i * 0.08} className="flex items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink font-display text-xs font-bold text-gold-400">
                  {i + 1}
                </span>
                <span className="text-[15px] font-semibold text-ink">{m}</span>
              </FadeUp>
            ))}
          </ol>
        </div>

        <div className="relative -mx-5 h-[42svh] sm:mx-0 lg:h-[34rem]">
          <ConstructionScene progress={progress} lazy baseRotation={0.25} distance={22} lookY={1.7} className="absolute inset-0" />
        </div>
      </div>
    </section>
  );
}

function MoreProjects({ current, index }) {
  const related = useMemo(() => {
    const others = projects.filter((p) => p.slug !== current.slug);
    const sameSize = others.filter((p) => p.size === current.size);
    const rest = others.filter((p) => p.size !== current.size);
    return [...sameSize, ...rest].slice(0, 3);
  }, [current]);

  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <section className="bg-[#f1e8da] pt-24 sm:pt-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Prev / next */}
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { p: prev, label: "Previous project", align: "left" },
            { p: next, label: "Next project", align: "right" },
          ].map(({ p, label, align }) => (
            <FadeUp key={label}>
              <Link
                href={`/project/${p.slug}`}
                className={`group flex items-center gap-4 rounded-3xl border border-ink/10 bg-white/70 p-4 transition-all duration-500 hover:-translate-y-0.5 hover:bg-white ${
                  align === "right" ? "sm:flex-row-reverse sm:text-right" : ""
                }`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-gold-400 transition-transform duration-500 group-hover:scale-110">
                  {align === "right" ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-ink/45">{label}</span>
                  <span className="mt-0.5 block truncate font-display text-lg font-bold tracking-tight text-ink">
                    {p.title}
                  </span>
                </span>
                <span className="relative hidden h-14 w-20 shrink-0 overflow-hidden rounded-xl sm:block">
                  <Image src={p.images[0]} alt="" fill sizes="80px" className="object-cover" />
                </span>
              </Link>
            </FadeUp>
          ))}
        </div>

        {/* Related */}
        <div className="mt-20 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading index="04" eyebrow="Keep exploring" title="More homes" accent="we have built." />
          <FadeUp>
            <Link href="/projects" className="inline-flex items-center gap-2 font-bold text-ink hover:underline">
              All projects <ArrowUpRight size={18} />
            </Link>
          </FadeUp>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p, i) => (
            <FadeUp key={p.slug} delay={i * 0.08}>
              <Link href={`/project/${p.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-soft">
                  <Image
                    src={p.images[0]}
                    alt={p.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 400px"
                    className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-ink">
                    {p.size}
                  </span>
                  <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-all duration-500 group-hover:rotate-45 group-hover:bg-gold-500 group-hover:text-ink">
                    <ArrowUpRight size={18} />
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-display text-lg font-bold leading-tight tracking-tight text-white">{p.title}</h3>
                    <p className="mt-1 text-sm text-white/70">{p.budget}</p>
                  </div>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ProjectDetail({ project, index }) {
  return (
    <main id="main">
      <Navbar solid />
      <Hero project={project} index={index} />
      <SpecBar project={project} />
      <Brief project={project} />
      <Details project={project} />
      <BuildBand project={project} />

      {/* Build one like this */}
      <section className="bg-ivory py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 text-center sm:px-8">
          <FadeUp as="h2" className="mx-auto max-w-3xl font-display text-[clamp(1.8rem,4vw,3rem)] font-bold leading-tight tracking-tightest text-ink">
            Want a {project.size} home like this one?
          </FadeUp>
          <FadeUp delay={0.1} as="p" className="mx-auto mt-4 max-w-xl text-lg text-ink/65">
            Send us your plot details and we will come back with a plan, an honest estimate and a timeline.
          </FadeUp>
          <FadeUp delay={0.2} className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <MagneticButton href={whatsappForProject(project.title)} external variant="dark">
              Ask about this home
            </MagneticButton>
            <a
              href={PHONE_TEL}
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-3.5 text-[15px] font-bold text-ink transition-colors hover:bg-white"
            >
              <Phone size={17} className="text-teal" />
              Call us
            </a>
          </FadeUp>
        </div>
      </section>

      <MoreProjects current={project} index={index} />
      <CallToAction />
    </main>
  );
}
