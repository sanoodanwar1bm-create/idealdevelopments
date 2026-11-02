"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ShieldCheck, FlaskConical, Scale } from "lucide-react";
import MagneticButton from "@components/ui/MagneticButton";
import { WordReveal } from "@components/ui/Reveal";
import { WHATSAPP_LINK } from "@lib/site";

const ConstructionScene = dynamic(() => import("@components/three/ConstructionScene"), {
  ssr: false,
});

const WORDS = ["Ihsan", "Honesty", "Trust", "Excellence"];
const EASE = [0.16, 1, 0.3, 1];

const TRUST = [
  { icon: FlaskConical, label: "Lab-tested materials" },
  { icon: Scale, label: "Fair, honest pricing" },
  { icon: ShieldCheck, label: "Shariah-guided dealings" },
];

const STAGES = [
  { at: 0, label: "Plot & blueprint" },
  { at: 0.05, label: "Foundation" },
  { at: 0.12, label: "Grey structure" },
  { at: 0.5, label: "Brickwork" },
  { at: 0.7, label: "Plaster & windows" },
  { at: 0.86, label: "Landscaping" },
  { at: 0.995, label: "Keys handed over" },
];

function RotatingWord({ start }) {
  const [i, setI] = useState(0);
  const [cycled, setCycled] = useState(false);
  useEffect(() => {
    if (!start) return;
    const id = setInterval(() => {
      setCycled(true);
      setI((v) => (v + 1) % WORDS.length);
    }, 2400);
    return () => clearInterval(id);
  }, [start]);

  return (
    <span className="relative -mb-[0.14em] inline-grid overflow-hidden pb-[0.14em] align-baseline">
      {/* Reserve the width of the longest word so nothing shifts */}
      {WORDS.map((w) => (
        <span key={w} className="invisible col-start-1 row-start-1" aria-hidden>
          {w}.
        </span>
      ))}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={WORDS[i]}
          className="col-start-1 row-start-1 font-quote font-normal italic text-teal"
          initial={{ y: "100%", opacity: 0 }}
          animate={start ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: cycled ? 0 : 0.55 }}
        >
          {WORDS[i]}
          <span className="text-gold-500">.</span>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// Glass card that mirrors the 3D build progress without re-rendering React.
function BuildStatus({ progress, show }) {
  const pct = useRef(null);
  const bar = useRef(null);
  const stage = useRef(null);

  useEffect(() => {
    let raf;
    let lastStage = "";
    const tick = () => {
      const p = progress.current;
      if (pct.current) pct.current.textContent = `${Math.round(p * 100)}%`;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      const s = [...STAGES].reverse().find((st) => p >= st.at)?.label ?? "";
      if (s !== lastStage && stage.current) {
        stage.current.textContent = s;
        lastStage = s;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={show ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 1.1, duration: 0.9, ease: EASE }}
      className="w-60 rounded-2xl border border-white/70 bg-white/70 p-4 shadow-lift backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-ink/50">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
          </span>
          Live build
        </span>
        <span ref={pct} className="font-display text-lg font-bold tabular-nums text-ink">
          0%
        </span>
      </div>
      <p ref={stage} className="mt-1 font-display text-sm font-semibold text-ink">
        Blueprint
      </p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/10">
        <div
          ref={bar}
          className="h-full origin-left rounded-full bg-gradient-to-r from-teal to-gold-500"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
      <p className="mt-2 text-[11px] text-ink/50">10 Marla family home · Islamabad</p>
    </motion.div>
  );
}

export default function Hero({ start = true }) {
  const section = useRef(null);
  const progress = useRef(0);

  // Build the house once the intro has finished.
  useEffect(() => {
    if (!start) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      progress.current = 1;
      return;
    }
    const tween = gsap.to(progress, { current: 1, duration: 4.6, delay: 0.25, ease: "power1.inOut" });
    return () => tween.kill();
  }, [start]);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section
      ref={section}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[linear-gradient(180deg,#bcd5e3_0%,#d7e5ec_45%,#ebe2d1_100%)] lg:block"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 -z-10 bg-blueprint opacity-60 mask-fade-edges" />
      <div className="absolute -right-40 top-10 -z-10 h-[38rem] w-[38rem] rounded-full bg-white/50 blur-[120px]" />
      <div className="absolute -left-40 bottom-0 -z-10 h-[30rem] w-[30rem] rounded-full bg-gold-300/30 blur-[120px]" />

      {/* Copy */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center px-5 pb-12 pt-2 sm:px-8 lg:min-h-[100svh] lg:pb-24 lg:pt-28"
      >
        <div className="max-w-2xl lg:max-w-[52%]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={start ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE }}
            className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-ink/10 bg-white/70 py-1.5 pl-1.5 pr-4 text-xs font-bold uppercase tracking-[0.18em] text-ink/70 shadow-soft backdrop-blur"
          >
            <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] tracking-[0.2em] text-gold-400">
              Design &amp; Build
            </span>
            Islamabad, Pakistan
          </motion.div>

          <h1 className="font-display text-[clamp(2.75rem,5.3vw,5.5rem)] font-bold leading-[0.98] tracking-tightest text-ink">
            <WordReveal text="We build homes" show={start} delay={0.1} />
            <br />
            <span className="inline-block overflow-hidden align-bottom">
              <motion.span
                className="inline-block"
                initial={{ y: "105%" }}
                animate={start ? { y: 0 } : {}}
                transition={{ duration: 1, delay: 0.35, ease: EASE }}
              >
                with&nbsp;
              </motion.span>
            </span>
            <RotatingWord start={start} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={start ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
            className="mt-7 max-w-lg text-lg leading-relaxed text-ink/65 sm:text-xl"
          >
            Modern homes, from 5 Marla to 1 Kanal, designed, built and managed for
            families and investors, delivered with certified materials, transparent budgets and
            the conviction that every structure is an <em className="font-quote text-ink">amanah</em>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={start ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.75, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <MagneticButton href={WHATSAPP_LINK} external variant="dark">
              Start your project
            </MagneticButton>
            <MagneticButton href="/projects" variant="light" icon={false}>
              Explore our work
            </MagneticButton>
          </motion.div>

          <motion.ul
            initial="hidden"
            animate={start ? "show" : "hidden"}
            variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.95 } } }}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-3"
          >
            {TRUST.map(({ icon: Icon, label }) => (
              <motion.li
                key={label}
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                className="flex items-center gap-2 text-sm font-semibold text-ink/70"
              >
                <Icon size={17} className="text-teal" />
                {label}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </motion.div>

      {/* 3D construction site */}
      <motion.div
        style={{ y: sceneY }}
        className="relative order-first mt-20 h-[40svh] w-full lg:order-none lg:mt-0 lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-[60%]"
      >
        <ConstructionScene progress={progress} lookOffset={-1.5} distance={21.5} className="absolute inset-0" />
        <div className="absolute bottom-6 right-5 hidden sm:block lg:bottom-12 lg:right-10">
          <BuildStatus progress={progress} show={start} />
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={start ? { opacity: 1 } : {}}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-3 lg:left-8 lg:flex lg:translate-x-0 xl:left-[max(2rem,calc((100vw-80rem)/2+2rem))]"
      >
        <span className="relative h-10 w-6 rounded-full border-2 border-ink/25">
          <motion.span
            className="absolute left-1/2 top-2 h-2 w-1 -translate-x-1/2 rounded-full bg-ink/60"
            animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-ink/50">
          Scroll to see how we build
        </span>
      </motion.div>
    </section>
  );
}
