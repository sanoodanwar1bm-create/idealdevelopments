"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Sparkles, Handshake, ShieldCheck, Scale, HeartHandshake, Eye, Target } from "lucide-react";
import SectionHeading from "@components/ui/SectionHeading";
import MagneticButton from "@components/ui/MagneticButton";
import TrustGrid from "@components/ui/TrustGrid";
import Khatam, { KHATAM_PATTERN } from "@components/ui/Khatam";
import ScrollHighlight from "@components/ui/ScrollHighlight";
import { FadeUp, WordReveal } from "@components/ui/Reveal";
import Logo from "@components/Logo";
import services from "@lib/services.json";
import team from "@lib/team.json";
import { WHATSAPP_LINK } from "@lib/site";

const EASE = [0.16, 1, 0.3, 1];

const VALUES = [
  { icon: Sparkles, title: "Ihsan", meaning: "Excellence", body: "Perfecting the work, because Allah sees all that we do." },
  { icon: Handshake, title: "Sidq", meaning: "Honesty", body: "Truthful in every promise, quote and progress update." },
  { icon: ShieldCheck, title: "Amanah", meaning: "Trustworthiness", body: "Your project handled as a sacred trust." },
  { icon: Scale, title: "Adl", meaning: "Fairness", body: "Fair pricing and fair treatment, for clients and labourers alike." },
  { icon: HeartHandshake, title: "Rifq", meaning: "Kindness", body: "Compassion and respect in every dealing." },
];

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 70]);

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden bg-[linear-gradient(165deg,#e4ebf0_0%,#eae6dc_50%,#efe4d2_100%)] pb-20 pt-24 lg:pb-28 lg:pt-32"
    >
      <div className="absolute inset-0 -z-10 bg-blueprint opacity-60 mask-fade-edges" />
      <Khatam className="absolute -left-24 top-24 -z-10 h-80 w-80 text-teal/10 animate-spin-slow" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mb-6 flex items-center gap-3"
          >
            <span className="font-display text-sm font-semibold text-teal">IDEAL</span>
            <span className="h-px w-10 bg-ink/25" />
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-ink/60">About us</span>
          </motion.div>

          <h1 className="font-display text-[clamp(2.6rem,5.2vw,5rem)] font-bold leading-[0.98] tracking-tightest text-ink">
            <WordReveal text="We build as if" show delay={0.1} />
            <br />
            <WordReveal text="we are building" show delay={0.28} />{" "}
            <WordReveal text="for our own." show delay={0.45} className="font-quote font-normal italic text-teal" />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-ink/65 sm:text-xl"
          >
            IDEAL Developments is a design-and-build company in Islamabad. We plan, build and hand over
            homes with certified materials, honest budgets and the conviction that every structure is an
            <em className="font-quote text-ink"> amanah</em> we answer for.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <MagneticButton href={WHATSAPP_LINK} external variant="dark">
              Talk to our team
            </MagneticButton>
            <MagneticButton href="/projects" variant="light" icon={false}>
              See our work
            </MagneticButton>
          </motion.div>
        </div>

        {/* Finished homes */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <motion.div
            style={{ y: y1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
            className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-lift"
          >
            <Image
              src="/projects/10marla.jpg"
              alt="A finished IDEAL Developments home in Islamabad"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 460px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
            <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/85 p-4 backdrop-blur-xl">
              <Logo className="text-[22px]" />
              <p className="font-quote text-base italic text-ink/70">We Build with Ihsan</p>
            </div>
          </motion.div>

          <motion.div
            style={{ y: y2 }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 0.55, ease: EASE }}
            className="absolute -left-6 top-10 hidden w-40 overflow-hidden rounded-2xl shadow-lift ring-4 ring-white sm:block lg:-left-14 lg:w-48"
          >
            <span className="relative block aspect-[4/3]">
              <Image src="/projects/7marlapair.jpg" alt="A recent IDEAL home" fill sizes="220px" className="object-cover" />
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function WhoWeAre() {
  return (
    <section id="who-we-are" className="bg-ivory py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeUp className="mb-8 flex items-center gap-3">
          <span className="font-display text-sm font-semibold text-teal">01</span>
          <span className="h-px w-10 bg-ink/20" />
          <span className="text-xs font-bold uppercase tracking-[0.28em] text-ink/60">Who we are</span>
        </FadeUp>
        <ScrollHighlight
          text="We are a team of certified engineers, architects and craftsmen delivering complete Design & Build services: architecture and 3D visualisation, residential construction, renovation, project management and a Shariah-compliant investor partnership programme. Everything we do is measured against one standard: would we accept this work in our own home?"
          className="max-w-5xl font-display text-[clamp(1.5rem,3.2vw,2.6rem)] font-semibold leading-[1.25] tracking-tight text-ink"
        />
      </div>
    </section>
  );
}

function WhatWeDo() {
  return (
    <section id="what-we-do" className="relative overflow-hidden bg-[linear-gradient(180deg,#e2eaf0,#d5e1ea)] py-24 sm:py-32">
      <div className="absolute inset-0 bg-blueprint opacity-50 mask-fade-edges" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading index="02" eyebrow="What we do" title="One team, from first sketch" accent="to final handover." />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {services.map((s, i) => (
            <FadeUp
              key={s.slug}
              delay={i * 0.07}
              className={i < 2 ? "lg:col-span-3" : i === 4 ? "sm:col-span-2 lg:col-span-2" : "lg:col-span-2"}
            >
              <Link
                href={`/service/${s.slug}`}
                className="group relative block h-[24rem] overflow-hidden rounded-[2rem] bg-ink shadow-lift"
              >
                <Image
                  src={s.image}
                  alt={s.imageAlt ?? s.title}
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 620px"
                  className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />
                <span className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-ink transition-all duration-500 group-hover:rotate-45 group-hover:bg-gold-500">
                  <ArrowUpRight size={18} />
                </span>
                <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-7">
                  <h3 className="font-display text-2xl font-bold tracking-tight">{s.title}</h3>
                  <p className="mt-2 leading-relaxed text-white/75">{s.description}</p>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function VisionMission() {
  const cards = [
    {
      icon: Eye,
      label: "Our vision",
      text: "With the will of Allah, we build with Ihsan, crafting spaces with sincerity, trust and excellence, knowing that every structure we create is a responsibility before Him and a service to humanity.",
    },
    {
      icon: Target,
      label: "Our mission",
      text: "To implement the will of Allah Almighty in all our business dealings by consistently meeting our customers' expectations, guided by Shariah-based practices and ethics, delivering high-quality, transparent and cost-effective construction.",
    },
  ];

  return (
    <section
      id="vision-mission"
      className="relative overflow-x-clip bg-[#eef5f2] py-24 sm:py-32"
      style={{ backgroundImage: KHATAM_PATTERN }}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index="03"
          eyebrow="Vision & mission"
          title="Why we build,"
          accent="and how we answer for it."
          align="center"
        />
        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          {cards.map(({ icon: Icon, label, text }, i) => (
            <FadeUp
              key={label}
              delay={i * 0.12}
              className="relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-lift sm:p-10"
            >
              <Khatam className="absolute -right-16 -top-16 h-56 w-56 text-teal/[0.07]" />
              <div className="relative flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-gold-400">
                  <Icon size={22} />
                </span>
                <h3 className="font-display text-2xl font-bold tracking-tight text-ink">{label}</h3>
              </div>
              <p className="relative mt-6 font-quote text-lg italic leading-relaxed text-ink/75 sm:text-xl">
                {text}
              </p>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function OurValues() {
  return (
    <section id="values" className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <div className="pointer-events-none absolute -right-40 -top-20 h-[32rem] w-[32rem] rounded-full bg-teal/25 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index="04"
          eyebrow="Our values"
          title="The five values"
          accent="we work by."
          align="center"
          tone="light"
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {VALUES.map(({ icon: Icon, title, meaning, body }, i) => (
            <FadeUp
              key={title}
              delay={i * 0.07}
              className="group rounded-3xl bg-white/[0.06] p-6 ring-1 ring-white/10 backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.1]"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-gold-400 transition-colors duration-500 group-hover:bg-gold-500 group-hover:text-ink">
                <Icon size={20} />
              </span>
              <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-white">{title}</h3>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold-400">{meaning}</p>
              <p className="mt-3 text-sm leading-relaxed text-white/65">{body}</p>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowWeWork() {
  return (
    <section id="how-we-work" className="bg-[#f1e8da] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index="05"
          eyebrow="How we work"
          title="Proof, not"
          accent="promises."
          description="The same four commitments apply to every project we take on, whatever its size."
          align="center"
        />
        <TrustGrid className="mt-14" />
      </div>
    </section>
  );
}

function OurTeam() {
  return (
    <section id="team" className="bg-ivory py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading index="06" eyebrow="Our team" title="The people behind" accent="the promise." />

        <ul className="mt-14 flex flex-wrap justify-center gap-4 sm:gap-5 lg:flex-nowrap">
          {team.map((m, i) => (
            <FadeUp
              as="li"
              key={m.name}
              delay={i * 0.07}
              className="group w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.84rem)] lg:w-auto lg:min-w-0 lg:flex-1"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-stone-200 shadow-soft">
                <Image
                  src={m.image}
                  alt={`${m.name}, ${m.role}`}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 240px"
                  className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-ink sm:text-xl">{m.name}</h3>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-teal">{m.role}</p>
            </FadeUp>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function AboutContent() {
  return (
    <>
      <Hero />
      <WhoWeAre />
      <WhatWeDo />
      <VisionMission />
      <OurValues />
      <HowWeWork />
      <OurTeam />
    </>
  );
}
