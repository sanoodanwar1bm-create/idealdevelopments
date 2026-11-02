"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import {
  Building2,
  Home,
  PencilRuler,
  RefreshCcw,
  Handshake,
  Check,
  ChevronRight,
  Phone,
  ArrowUpRight,
} from "lucide-react";
import services from "@lib/services.json";
import Navbar from "@components/Navbar";
import CallToAction from "@components/CallToAction";
import MagneticButton from "@components/ui/MagneticButton";
import SectionHeading from "@components/ui/SectionHeading";
import ScrollHighlight from "@components/ui/ScrollHighlight";
import ProfitShare from "@components/ui/ProfitShare";
import Khatam, { KHATAM_PATTERN } from "@components/ui/Khatam";
import { FadeUp, WordReveal } from "@components/ui/Reveal";
import TrustGrid from "@components/ui/TrustGrid";
import { PHONE_TEL, whatsappFor } from "@lib/site";

const ConstructionScene = dynamic(() => import("@components/three/ConstructionScene"), { ssr: false });
const BrandBricks = dynamic(() => import("@components/three/BrandBricks"), { ssr: false });

const EASE = [0.16, 1, 0.3, 1];
const ICONS = { Building2, Home, Layout: PencilRuler, RefreshCcw, Handshake };

// Per-service hero treatment
const THEMES = {
  "project-management": {
    bg: "bg-[linear-gradient(160deg,#eef2f5_0%,#dbe6ee_55%,#c7d8e5_100%)]",
    scene: "house",
    tracker: "Project tracker",
  },
  "residential-construction": {
    bg: "bg-[linear-gradient(165deg,#f5eee3_0%,#e9dcc6_55%,#d9e4ea_100%)]",
    scene: "house",
    tracker: "Your home, step by step",
  },
  "architectural-design": {
    bg: "bg-[linear-gradient(160deg,#2f6391_0%,#3b77a6_60%,#4a88b3_100%)]",
    scene: "blueprint",
    light: true,
    tracker: "Design progress",
  },
  "renovation-remodeling": {
    bg: "bg-[linear-gradient(160deg,#f6ebe1_0%,#ecd8c6_60%,#e3dccf_100%)]",
    scene: "renovate",
    tracker: "Renovation progress",
  },
  "investor-partnership": {
    bg: "bg-[linear-gradient(135deg,#2f6c78_0%,#3a7f86_55%,#4a8f86_100%)]",
    scene: "bricks",
    light: true,
  },
};

// Checklist of the service's own process that ticks along with the 3D build.
function Tracker({ title, steps, progress }) {
  const [done, setDone] = useState(0);
  useEffect(() => {
    let raf;
    const tick = () => {
      const n = Math.floor(progress.current * steps.length + 0.02);
      setDone((d) => (d === n ? d : n));
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [progress, steps.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.9, ease: EASE }}
      className="w-72 rounded-2xl border border-white/70 bg-white/80 p-4 shadow-lift backdrop-blur-xl"
    >
      <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-ink/50">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
        </span>
        {title}
      </p>
      <ul className="mt-3 space-y-2">
        {steps.map((s, i) => {
          const ok = i < done;
          return (
            <li key={s.title} className="flex items-center gap-2.5 text-[13px] font-semibold">
              <span
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-full transition-colors duration-500 ${
                  ok ? "bg-teal text-white" : "border border-ink/20 text-transparent"
                }`}
              >
                <Check size={11} strokeWidth={3} />
              </span>
              <span className={`transition-colors duration-500 ${ok ? "text-ink" : "text-ink/40"}`}>{s.title}</span>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}

function HeroScene({ service, theme }) {
  const progress = useRef(theme.scene === "renovate" ? 0.66 : 0);
  const explode = useRef(0);

  useEffect(() => {
    if (theme.scene === "bricks") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      progress.current = 1;
      return;
    }
    const tween = gsap.to(progress, {
      current: 1,
      duration: theme.scene === "renovate" ? 4 : 6,
      delay: 0.5,
      ease: "power1.inOut",
    });
    return () => tween.kill();
  }, [theme.scene]);

  if (theme.scene === "bricks") {
    return (
      <>
        <BrandBricks explode={explode} className="absolute inset-0" />
        <div className="absolute bottom-4 right-4 w-72 sm:bottom-8 sm:right-8">
          <ProfitShare className="" />
        </div>
      </>
    );
  }

  return (
    <>
      <ConstructionScene
        progress={progress}
        blueprint={theme.scene === "blueprint"}
        baseRotation={theme.scene === "renovate" ? 0.35 : -0.3}
        distance={19}
        lookY={0.4}
        className="absolute inset-0"
      />
      <div className="absolute bottom-4 right-4 hidden sm:block lg:bottom-10 lg:right-8">
        <Tracker title={theme.tracker} steps={service.ourProcess} progress={progress} />
      </div>
    </>
  );
}

function Hero({ service, index, theme }) {
  const light = theme.light;
  const Icon = ICONS[service.icon] ?? Building2;
  const text = light ? "text-white" : "text-ink";
  const muted = light ? "text-white/75" : "text-ink/65";

  return (
    <section className={`relative isolate overflow-hidden pt-28 lg:pt-32 ${theme.bg}`}>
      <div
        className={`absolute inset-0 -z-10 mask-fade-edges ${light ? "bg-blueprint-light" : "bg-blueprint opacity-60"}`}
      />
      <div className="mx-auto grid max-w-7xl items-center gap-4 px-5 sm:px-8 lg:min-h-[calc(100svh-8rem)] lg:grid-cols-[1fr_1.1fr]">
        <div className="relative z-10 min-w-0 pb-4 lg:pb-16">
          {/* Breadcrumb */}
          <motion.nav
            aria-label="Breadcrumb"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className={`flex flex-wrap items-center gap-1.5 text-sm font-semibold ${muted}`}
          >
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <ChevronRight size={14} />
            <Link href="/services" className="hover:underline">
              Services
            </Link>
            <ChevronRight size={14} />
            <span className={text}>{service.title}</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="mt-8 flex items-center gap-3"
          >
            <span
              className={`grid h-14 w-14 place-items-center rounded-2xl shadow-lift ${
                light ? "bg-gold-500 text-ink" : "bg-ink text-gold-400"
              }`}
            >
              <Icon size={26} />
            </span>
            <span className={`text-xs font-bold uppercase tracking-[0.25em] ${muted}`}>Service 0{index + 1}</span>
          </motion.div>

          <h1
            className={`mt-6 font-display text-[clamp(2.6rem,5.4vw,5rem)] font-bold leading-[1] tracking-tightest text-balance ${text}`}
          >
            <WordReveal text={service.title} show delay={0.15} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
            className={`mt-6 max-w-xl text-lg leading-relaxed sm:text-xl ${muted}`}
          >
            {service.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <MagneticButton href={whatsappFor(service.title)} external variant={light ? "gold" : "dark"}>
              Discuss your project
            </MagneticButton>
            <a
              href={PHONE_TEL}
              className={`inline-flex items-center gap-2 rounded-full border px-5 py-3.5 text-[15px] font-bold transition-colors ${
                light ? "border-white/30 text-white hover:bg-white/10" : "border-ink/15 text-ink hover:bg-white/60"
              }`}
            >
              <Phone size={17} className={light ? "text-gold-400" : "text-teal"} />
              Call us
            </a>
          </motion.div>
        </div>

        <div className="relative -mx-5 h-[46svh] sm:mx-0 lg:h-[min(40rem,calc(100svh-8rem))]">
          <HeroScene service={service} theme={theme} />
        </div>
      </div>
    </section>
  );
}

function Overview({ service }) {
  const band = useRef(null);
  const { scrollYProgress } = useScroll({ target: band, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.86, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section className="bg-[#f7f3ec] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeUp className="mb-8 flex items-center gap-3">
          <span className="font-display text-sm font-semibold text-teal">01</span>
          <span className="h-px w-10 bg-ink/20" />
          <span className="text-xs font-bold uppercase tracking-[0.28em] text-ink/60">Overview</span>
        </FadeUp>
        <ScrollHighlight
          text={service.longDescription}
          className="max-w-5xl font-display text-[clamp(1.5rem,3.2vw,2.75rem)] font-semibold leading-[1.25] tracking-tight text-ink"
        />
      </div>

      <motion.div
        ref={band}
        style={{ scale }}
        className="relative mx-3 mt-16 h-[55svh] overflow-hidden rounded-[2.5rem] sm:mx-5 lg:mx-auto lg:max-w-7xl"
      >
        <motion.div style={{ y }} className="absolute -inset-y-[12%] inset-x-0">
          <Image src={service.image} alt={service.title} fill sizes="(max-width: 1280px) 100vw, 1280px" className="object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
        <p className="absolute bottom-6 left-6 right-6 max-w-lg font-quote text-xl italic text-white sm:bottom-10 sm:left-10 sm:text-2xl">
          {service.faithNote}
        </p>
      </motion.div>
    </section>
  );
}

function Features({ service }) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#e2eaf0,#d5e1ea)] py-24 sm:py-32">
      <div className="absolute inset-0 bg-blueprint opacity-50 mask-fade-edges" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading index="02" eyebrow="What's included" title="Everything handled," accent="nothing left to chance." />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {service.features.map((f, i) => (
            <FadeUp
              key={f}
              delay={i * 0.07}
              className={`group relative overflow-hidden rounded-3xl p-7 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift ${
                i === 0 ? "flex min-h-[20rem] flex-col justify-between lg:row-span-2" : "bg-white"
              }`}
            >
              {i === 0 && (
                <>
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 400px"
                    className="object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
                </>
              )}
              <span
                className={`relative font-display text-6xl font-extrabold leading-none ${
                  i === 0 ? "text-white/80" : "text-ink/10"
                }`}
              >
                0{i + 1}
              </span>
              <div className="relative">
                <span
                  className={`mt-6 grid h-10 w-10 place-items-center rounded-full ${
                    i === 0 ? "bg-gold-500 text-ink" : "bg-teal/15 text-teal"
                  }`}
                >
                  <Check size={18} strokeWidth={3} />
                </span>
                <p
                  className={`mt-4 font-display text-2xl font-bold leading-tight tracking-tight ${
                    i === 0 ? "text-white lg:text-3xl" : "text-ink"
                  }`}
                >
                  {f}
                </p>
              </div>
              <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-teal to-gold-500 transition-transform duration-500 group-hover:scale-x-100" />
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process({ service }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.6"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="bg-[linear-gradient(180deg,#dcebe5,#cbe0d8)] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index="03"
          eyebrow="How it works"
          title="A clear path,"
          accent="from first call to completion."
          align="center"
        />

        <div ref={ref} className="relative mx-auto mt-16 max-w-4xl">
          {/* Rail */}
          <div className="absolute bottom-0 left-5 top-0 w-[3px] rounded-full bg-ink/10 lg:left-1/2 lg:-translate-x-1/2">
            <motion.div
              style={{ scaleY: fill }}
              className="absolute inset-0 origin-top rounded-full bg-gradient-to-b from-teal to-gold-500"
            />
          </div>

          <ol className="space-y-10 lg:space-y-16">
            {service.ourProcess.map((st, i) => {
              const right = i % 2 === 1;
              return (
                <li key={st.title} className="relative pl-16 lg:grid lg:grid-cols-2 lg:gap-16 lg:pl-0">
                  <span className="absolute left-5 top-4 z-10 -translate-x-1/2 lg:left-1/2">
                    <motion.span
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
                      transition={{ type: "spring", stiffness: 300, damping: 18 }}
                      className="grid h-11 w-11 place-items-center rounded-full bg-ink font-display text-sm font-bold text-gold-400 ring-4 ring-[#d4e6df]"
                    >
                      {i + 1}
                    </motion.span>
                  </span>
                  <FadeUp
                    className={`rounded-3xl bg-white p-7 shadow-soft ${right ? "lg:col-start-2" : "lg:text-right"}`}
                    y={30}
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal">Step 0{i + 1}</p>
                    <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">{st.title}</h3>
                    <p className="mt-2 leading-relaxed text-ink/60">{st.description}</p>
                  </FadeUp>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

function FaithPromise({ service }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-45, 90]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#eef5f2] py-24 sm:py-32"
      style={{ backgroundImage: KHATAM_PATTERN }}
    >
      <motion.div
        style={{ rotate }}
        className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 text-teal/15"
      >
        <Khatam className="h-full w-full" />
      </motion.div>
      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <FadeUp className="text-xs font-bold uppercase tracking-[0.3em] text-teal">Our Islamic promise</FadeUp>
        <p className="mt-8 font-quote text-[clamp(1.8rem,4.2vw,3.5rem)] italic leading-snug text-ink">
          <WordReveal text={service.faithNote} stagger={0.03} />
        </p>
      </div>

      <div className="relative mx-auto mt-20 max-w-7xl px-5 sm:px-8">
        <TrustGrid />
      </div>
    </section>
  );
}

function OtherServices({ current }) {
  const others = services.filter((s) => s.slug !== current);
  return (
    <section className="bg-[#f1e8da] pt-24 sm:pt-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading index="04" eyebrow="Explore more" title="Other ways" accent="we can help." />
          <FadeUp>
            <Link href="/services" className="inline-flex items-center gap-2 font-bold text-ink hover:underline">
              All services <ArrowUpRight size={18} />
            </Link>
          </FadeUp>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((s, i) => (
            <FadeUp key={s.slug} delay={i * 0.07}>
              <Link href={`/service/${s.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-soft">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                    className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                  <span className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-ink transition-all duration-500 group-hover:rotate-45 group-hover:bg-gold-500">
                    <ArrowUpRight size={20} />
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-display text-xl font-bold leading-tight tracking-tight text-white">{s.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-white/70">{s.description}</p>
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

export default function ServiceDetail({ service }) {
  const index = services.findIndex((s) => s.slug === service.slug);
  const theme = THEMES[service.slug] ?? THEMES["residential-construction"];

  return (
    <main id="main">
      <Navbar solid={theme.light} />
      <Hero service={service} index={index} theme={theme} />
      <Overview service={service} />
      <Features service={service} />
      <Process service={service} />
      <FaithPromise service={service} />
      <OtherServices current={service.slug} />
      <CallToAction />
    </main>
  );
}
