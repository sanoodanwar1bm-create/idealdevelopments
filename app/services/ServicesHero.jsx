"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { ArrowDown } from "lucide-react";
import services from "@lib/services.json";
import { WordReveal } from "@components/ui/Reveal";
import MagneticButton from "@components/ui/MagneticButton";
import { WHATSAPP_LINK } from "@lib/site";
import { getLenis } from "@components/SmoothScroll";

const BrandBricks = dynamic(() => import("@components/three/BrandBricks"), { ssr: false });

const EASE = [0.16, 1, 0.3, 1];

const FACTS = [
  { value: "5", label: "Core services" },
  { value: "5 Marla – 1 Kanal", label: "Homes we build" },
  { value: "60 / 40", label: "Halal profit-sharing" },
  { value: "Certified", label: "Materials, with lab reports" },
];

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(el, { offset: -20, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
}

export default function ServicesHero() {
  const section = useRef(null);
  const explode = useRef(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => (explode.current = v));
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section
      ref={section}
      className="relative isolate overflow-hidden bg-[linear-gradient(160deg,#efe4d2_0%,#e3e6df_45%,#c9dce6_100%)] pb-16 pt-20 lg:pb-24 lg:pt-36"
    >
      <div className="absolute inset-0 -z-10 bg-blueprint opacity-60 mask-fade-edges" />
      <div className="absolute -left-32 top-20 -z-10 h-[30rem] w-[30rem] rounded-full glow scale-[2] opacity-50 [--glow:255_255_255]" />

      <div className="mx-auto grid max-w-7xl items-center gap-6 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div style={{ y }} className="relative z-10 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mb-6 flex items-center gap-3"
          >
            <span className="font-display text-sm font-semibold text-teal">IDEAL</span>
            <span className="h-px w-10 bg-ink/25" />
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-ink/60">Our services</span>
          </motion.div>

          <h1 className="font-display text-[clamp(2.75rem,6vw,5.5rem)] font-bold leading-[0.98] tracking-tightest text-ink">
            <WordReveal text="One team," show delay={0.1} />
            <br />
            <WordReveal text="from plot" show delay={0.25} />{" "}
            <WordReveal text="to keys." show delay={0.4} className="font-quote font-normal italic text-teal" />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-ink/65 sm:text-xl"
          >
            Design, construction, renovation, project management and Shariah-compliant investment,
            each delivered with Ihsan, certified materials and complete transparency.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.65, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <MagneticButton href={WHATSAPP_LINK} external variant="dark">
              Get a free consultation
            </MagneticButton>
            <button
              onClick={() => scrollToId(services[0].slug)}
              className="group inline-flex items-center gap-2 rounded-full px-5 py-3 text-[15px] font-bold text-ink transition-colors hover:bg-white/60"
            >
              Browse services
              <ArrowDown size={17} className="transition-transform group-hover:translate-y-0.5" />
            </button>
          </motion.div>

          {/* Quick jump */}
          <motion.ul
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.85 } } }}
            className="no-scrollbar -mx-5 mt-10 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
          >
            {services.map((s, i) => (
              <motion.li key={s.slug} className="shrink-0" variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                <button
                  onClick={() => scrollToId(s.slug)}
                  className="flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 py-2 pl-2 pr-4 text-sm font-semibold text-ink shadow-soft backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-ink font-display text-[10px] text-gold-400">
                    0{i + 1}
                  </span>
                  {s.title.replace(" Program", "").replace(" & Consultancy", "")}
                </button>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* 3D logo bricks */}
        <div className="relative -mx-5 order-first h-[34svh] sm:mx-0 lg:order-none lg:h-[36rem]">
          <BrandBricks explode={explode} className="absolute inset-0" />
        </div>
      </div>

      {/* Facts */}
      <div className="mx-auto mt-6 max-w-7xl px-5 sm:px-8 lg:mt-10">
        <motion.dl
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1, ease: EASE }}
          className="grid grid-cols-2 overflow-hidden rounded-3xl border border-white/70 bg-white/60 shadow-soft backdrop-blur-xl lg:grid-cols-4"
        >
          {FACTS.map((f, i) => (
            <div
              key={f.label}
              className={`p-5 sm:p-7 ${i % 2 ? "" : "border-r"} ${i < 2 ? "border-b lg:border-b-0" : ""} ${
                i === 1 ? "lg:border-r" : ""
              } border-ink/10`}
            >
              <dt className="text-xs font-bold uppercase tracking-[0.18em] text-ink/50">{f.label}</dt>
              <dd className="mt-2 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">{f.value}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
