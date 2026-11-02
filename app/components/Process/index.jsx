"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { PencilRuler, FlaskConical, CalendarCheck, KeyRound } from "lucide-react";
import { getLenis } from "@components/SmoothScroll";
import { FadeUp } from "@components/ui/Reveal";

const ConstructionScene = dynamic(() => import("@components/three/ConstructionScene"), {
  ssr: false,
  loading: () => <SceneSkeleton />,
});

// The build finishes here, leaving a beat at the end to look at the finished house.
const BUILD_ENDS_AT = 0.82;

const STEPS = [
  {
    icon: PencilRuler,
    title: "Consult & design",
    lead: "We start on your plot, not in an office",
    body:
      "5 Marla, 10 Marla or 1 Kanal, we visit first. We map your family's needs against your budget, then hand you architectural plans and realistic 3D elevations, so you see your home before a single brick is laid.",
    tag: ["Plans", "3D elevations", "Written estimate"],
    meta: "Weeks 1–4",
  },
  {
    icon: FlaskConical,
    title: "Foundation & structure",
    lead: "Certified engineers at every pour",
    body:
      "Steel, block and cement samples go to an independent lab, and the reports reach you with the invoices. Proof you can hold in your hand, rather than a promise you have to take on trust.",
    tag: ["Certified engineers", "Lab reports", "Material invoices"],
    meta: "Month 2–6",
  },
  {
    icon: CalendarCheck,
    title: "Rising, on schedule",
    lead: "An update at every milestone",
    body:
      "Real scheduling, real site photographs and a named person who answers the phone. Your project keeps moving, with no chaos, no silence and no surprises in the budget.",
    tag: ["Milestone updates", "Site photos", "Budget held"],
    meta: "Month 6–10",
  },
  {
    icon: KeyRound,
    title: "Finishing & handover",
    lead: "The keys in your hand, on time",
    body:
      "Plaster, windows, cladding and landscaping, then a final inspection walked together, snags closed, and your home handed over exactly as promised.",
    tag: ["Joint inspection", "Snags closed", "On-time delivery"],
    meta: "Month 10–12",
  },
];

function SceneSkeleton() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="h-20 w-20 animate-pulse rounded-2xl bg-ink/[0.06]" />
    </div>
  );
}

/* Corner registration marks, like a drawing sheet. */
function CropMarks() {
  const corner = "absolute h-5 w-5 border-ink/25";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-3 z-20 sm:inset-4">
      <span className={`${corner} left-0 top-0 border-l border-t`} />
      <span className={`${corner} right-0 top-0 border-r border-t`} />
      <span className={`${corner} bottom-0 left-0 border-b border-l`} />
      <span className={`${corner} bottom-0 right-0 border-b border-r`} />
    </div>
  );
}

/* Live readout driven from the progress ref, so no React re-render per frame. */
function BuildReadout({ progress }) {
  const pct = useRef(null);
  const bar = useRef(null);

  useEffect(() => {
    let raf;
    const tick = () => {
      const p = Math.min(1, progress.current);
      if (pct.current) pct.current.textContent = `${Math.round(p * 100)}%`;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  return (
    <div className="flex items-center gap-3">
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
      </span>
      <div className="h-1 w-16 overflow-hidden rounded-full bg-ink/10 sm:w-24">
        <div
          ref={bar}
          className="h-full origin-left rounded-full bg-gradient-to-r from-teal to-gold-500"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
      <span ref={pct} className="font-display text-sm font-bold tabular-nums text-ink">
        0%
      </span>
    </div>
  );
}

export default function Process() {
  const section = useRef(null);
  const progress = useRef(0);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const p = Math.min(1, v / BUILD_ENDS_AT);
    progress.current = p;
    const step = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length));
    setActive((prev) => (prev === step ? prev : Math.max(0, step)));
  });

  // Clicking a stage jumps to the scroll position where that stage begins.
  const goToStep = useCallback((i) => {
    const el = section.current;
    if (!el) return;
    const travel = el.offsetHeight - window.innerHeight;
    const target = el.offsetTop + travel * BUILD_ENDS_AT * ((i + 0.3) / STEPS.length);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { duration: 1.1 });
    else window.scrollTo({ top: target, behavior: "smooth" });
  }, []);

  const step = STEPS[active];
  const Icon = step.icon;

  return (
    <section
      ref={section}
      id="process"
      aria-label="How we build"
      className="relative h-[240svh] bg-[linear-gradient(180deg,#dcebe4_0%,#cadfd7_48%,#e9ede7_100%)] lg:h-[260svh]"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute inset-0 bg-blueprint opacity-70 mask-fade-edges" />
        <div className="absolute -left-40 top-0 h-[28rem] w-[28rem] rounded-full bg-white/60 blur-[120px]" />
        <div className="absolute -right-32 bottom-0 h-[26rem] w-[26rem] rounded-full bg-gold-300/25 blur-[120px]" />

        <div className="relative mx-auto flex h-full max-w-7xl flex-col px-5 pb-8 pt-[max(5.5rem,10svh)] sm:px-8 sm:pb-7 lg:pb-9">
          {/* Heading */}
          <FadeUp y={18} className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="font-display text-sm font-semibold text-teal">01</span>
                <span className="h-px w-10 bg-ink/20" />
                <span className="text-xs font-bold uppercase tracking-[0.28em] text-ink/60">How we build</span>
              </div>
              <h2 className="font-display text-[clamp(1.7rem,3.6vw,3.1rem)] font-bold leading-[1.03] tracking-tightest text-ink">
                From blueprint to keys,{" "}
                <span className="font-quote font-normal italic text-teal">every step in the open.</span>
              </h2>
            </div>
            <p className="hidden max-w-xs text-[15px] leading-relaxed text-ink/60 xl:block">
              One scroll and a 10 Marla home goes up the way we actually build it — stage by stage, with
              nothing hidden.
            </p>
          </FadeUp>

          {/* Stage track — doubles as a chapter jump */}
          <nav aria-label="Build stages" className="mt-5 sm:mt-6">
            <ol className="grid grid-cols-4 gap-1.5 sm:gap-3">
              {STEPS.map((s, i) => {
                const done = i <= active;
                return (
                  <li key={s.title}>
                    <button
                      onClick={() => goToStep(i)}
                      aria-current={i === active ? "step" : undefined}
                      className="group block w-full text-left"
                    >
                      <span
                        className={`block h-[3px] w-full rounded-full transition-all duration-500 ${
                          i === active
                            ? "bg-gradient-to-r from-teal to-gold-500"
                            : done
                              ? "bg-teal/70"
                              : "bg-ink/[0.12] group-hover:bg-ink/25"
                        }`}
                      />
                      <span
                        className={`mt-2 block truncate text-[10px] font-bold uppercase tracking-[0.14em] transition-colors sm:text-[11px] ${
                          i === active ? "text-ink" : "text-ink/40 group-hover:text-ink/70"
                        }`}
                      >
                        0{i + 1}
                        <span className="hidden sm:inline"> · {s.title}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* Stage copy + 3D sheet */}
          <div className="mt-4 grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] gap-4 sm:mt-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:grid-rows-none lg:gap-10">
            {/* Copy sits second on phones so the house leads */}
            <div className="order-2 flex min-h-0 flex-col justify-center lg:order-1 lg:row-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink text-gold-400 sm:h-12 sm:w-12">
                      <Icon size={21} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal">
                        Stage 0{active + 1} · {step.meta}
                      </p>
                      <h3 className="truncate font-display text-xl font-bold tracking-tight text-ink sm:text-2xl lg:text-[1.75rem]">
                        {step.title}
                      </h3>
                    </div>
                  </div>

                  <p className="mt-4 font-quote text-lg italic leading-snug text-ink/80 sm:text-xl lg:mt-5">
                    {step.lead}.
                  </p>
                  <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-ink/60 sm:text-[15px] lg:mt-3 lg:text-base">
                    {step.body}
                  </p>

                  <ul className="mt-4 flex flex-wrap gap-2 lg:mt-6">
                    {step.tag.map((t) => (
                      <li
                        key={t}
                        className="rounded-full bg-white/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-ink/70 ring-1 ring-ink/5 backdrop-blur"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 3D drawing sheet — takes the flexible row on phones so the
                scene always has room, and the copy sits under it */}
            <div className="relative order-1 min-h-[15rem] overflow-hidden rounded-[1.5rem] bg-white/45 shadow-lift ring-1 ring-ink/10 backdrop-blur-sm lg:order-2 lg:min-h-0 lg:rounded-[2rem]">
              <CropMarks />

              <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-3 px-5 py-3.5 sm:px-7 sm:py-4">
                <p className="truncate text-[10px] font-bold uppercase tracking-[0.2em] text-ink/45 sm:text-[11px]">
                  10 Marla<span className="hidden sm:inline"> residence</span> · Islamabad
                </p>
                <BuildReadout progress={progress} />
              </div>

              <span
                aria-hidden
                className="pointer-events-none absolute bottom-2 left-5 z-10 hidden font-display text-[6rem] font-extrabold leading-none text-ink/[0.055] sm:left-7 sm:block sm:text-[9rem] lg:text-[11rem]"
              >
                0{active + 1}
              </span>

              <ConstructionScene
                progress={progress}
                lazy
                baseRotation={0.32}
                distance={18.5}
                lookY={1.6}
                className="absolute inset-0"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
