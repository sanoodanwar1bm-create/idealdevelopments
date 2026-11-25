"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { PencilRuler, FlaskConical, CalendarCheck, KeyRound } from "lucide-react";
import { FadeUp } from "@components/ui/Reveal";

/*
 * How we build: four stage cards, each showing the same 10 Marla house drawn
 * one stage further along. It scrolls like any other section, with no pinning
 * and no WebGL (the hero already has the 3D build). On desktop the cards sit
 * in a row under a progress line that fills as you scroll past, which is a
 * transform. On phones they are a swipe row, so the section stays about one
 * screen tall.
 */

const STEPS = [
  {
    icon: PencilRuler,
    title: "Consult & design",
    label: "Design",
    lead: "We start on your plot, not in an office",
    body:
      "5 Marla, 10 Marla or 1 Kanal, we visit first. We map your family's needs against your budget, then hand you architectural plans and realistic 3D elevations, so you see your home before a single brick is laid.",
    tag: ["Plans", "3D elevations", "Written estimate"],
    meta: "Weeks 1–4",
  },
  {
    icon: FlaskConical,
    title: "Foundation & structure",
    label: "Structure",
    lead: "Certified engineers at every pour",
    body:
      "Steel, block and cement samples go to an independent lab, and the reports reach you with the invoices. Proof you can hold in your hand, rather than a promise you have to take on trust.",
    tag: ["Certified engineers", "Lab reports", "Material invoices"],
    meta: "Month 2–6",
  },
  {
    icon: CalendarCheck,
    title: "Rising, on schedule",
    label: "Walls",
    lead: "An update at every milestone",
    body:
      "Real scheduling, real site photographs and a named person who answers the phone. Your project keeps moving, with no chaos, no silence and no surprises in the budget.",
    tag: ["Milestone updates", "Site photos", "Budget held"],
    meta: "Month 6–10",
  },
  {
    icon: KeyRound,
    title: "Finishing & handover",
    label: "Handover",
    lead: "The keys in your hand, on time",
    body:
      "Plaster, windows, cladding and landscaping, then a final inspection walked together, snags closed, and your home handed over exactly as promised.",
    tag: ["Joint inspection", "Snags closed", "On-time delivery"],
    meta: "Month 10–12",
  },
];

/*
 * Elevation of a modern 10 Marla house, drawn in layers. `stage` 0–3 decides
 * how much is built: finished layers are solid, the rest stay as a dashed
 * blueprint outline. The layer this stage adds rises in when the card shows.
 */
function HouseDrawing({ stage }) {
  // A plain function, not a component, so React keeps the same element between renders.
  const layer = (n, children) =>
    stage >= n ? (
      <motion.g
        data-reveal=""
        initial={stage === n ? { opacity: 0, y: 6 } : false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.g>
    ) : null;

  return (
    <svg viewBox="0 0 240 150" className="h-full w-full" fill="none" strokeLinejoin="round" aria-hidden>
      {/* Ground and the blueprint outline of the finished house */}
      <path d="M8 132 H232" className="stroke-ink/30" strokeWidth="1" />
      <g className="fill-none stroke-ink/25" strokeWidth="0.9" strokeDasharray="3 3">
        <path d="M40 126 V48 H200 V126 M156 48 V30 H200 V48 M40 88 H200" />
        <path d="M52 96 H94 V122 H52 Z M108 100 H124 V126 M50 56 H98 V82 H50 Z M108 56 H148 V82 H108 Z" />
      </g>

      {/* 0: plot, dimension lines and setting-out */}
      {stage === 0 && (
        <g className="stroke-teal" strokeWidth="0.9">
          <path d="M40 140 H200 M40 137 V143 M200 137 V143" />
          <path d="M214 48 V126 M211 48 H217 M211 126 H217" />
          <circle cx="40" cy="132" r="2.2" className="fill-gold-500 stroke-none" />
          <circle cx="200" cy="132" r="2.2" className="fill-gold-500 stroke-none" />
          <text x="120" y="148" textAnchor="middle" className="fill-teal stroke-none text-[7px] font-bold">
            35 ft
          </text>
        </g>
      )}

      {/* 1: foundation, columns and slabs */}
      {layer(
        1,
        <g className="stroke-ink" strokeWidth="1.4">
          <rect x="36" y="126" width="168" height="6" className="fill-ink/10" />
          <path d="M44 126 V48 M100 126 V48 M156 126 V30 M196 126 V30" />
          <rect x="38" y="86" width="164" height="4" className="fill-ink/15" />
          <rect x="38" y="46" width="164" height="4" className="fill-ink/15" />
          <rect x="152" y="28" width="48" height="3" className="fill-ink/15" />
        </g>
      )}

      {/* 2: walls going up, with the crane still on site */}
      {layer(
        2,
        <>
          <g className="stroke-ink" strokeWidth="1">
            <path d="M44 90 H100 V126 H44 Z M100 90 H156 V126 H100 Z M156 90 H196 V126 H156 Z" className="fill-[#e6ddcc]" />
            <path
              d="M44 50 H100 V86 H44 Z M100 50 H156 V86 H100 Z M156 50 H196 V86 H156 Z M156 31 H196 V46 H156 Z"
              className="fill-[#efe8db]"
            />
          </g>
          {stage === 2 && (
            <g className="stroke-gold-500" strokeWidth="1.2">
              <path d="M222 132 V14 M222 14 H170 M222 14 L230 22 H222 M190 14 V34" />
              <path d="M222 20 L216 14 M222 32 L216 26 M222 44 L216 38" strokeWidth="0.8" />
              <rect x="185" y="34" width="10" height="5" className="fill-gold-500/30" />
            </g>
          )}
        </>
      )}

      {/* 3: glazing, cladding, door and the garden */}
      {layer(
        3,
        <>
          <g strokeWidth="1">
            <path d="M52 96 H94 V122 H52 Z M50 56 H98 V82 H50 Z M108 56 H148 V82 H108 Z" className="fill-[#bcd5e3] stroke-ink" />
            <path d="M66 96 V122 M80 96 V122 M66 56 V82 M82 56 V82 M128 56 V82" className="stroke-ink/60" />
            <path d="M108 100 H124 V126 H108 Z" className="fill-ink stroke-ink" />
            <path d="M162 52 V84 M168 52 V84 M174 52 V84 M180 52 V84 M186 52 V84 M192 52 V84" className="stroke-[#a8743f]" />
            <path d="M162 92 H192 V124 H162 Z" className="fill-teal/25 stroke-teal" />
            <path d="M40 46 H200" className="stroke-gold-500" strokeWidth="1.6" />
          </g>
          <g strokeWidth="1">
            <circle cx="220" cy="110" r="11" className="fill-teal/30 stroke-teal" />
            <path d="M220 121 V132" className="stroke-ink" />
            <path d="M14 128 h4 v-6 h4 v6 h4 v-4 h4 v4 h4" className="stroke-teal" />
          </g>
        </>
      )}
    </svg>
  );
}

function StageCard({ step, index }) {
  const Icon = step.icon;
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-white/80 shadow-soft ring-1 ring-ink/[0.06] transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-lift">
      {/* Drawing sheet */}
      <div className="relative aspect-[16/10] border-b border-ink/[0.06] bg-[#f4f7f5] bg-blueprint px-4 pt-6">
        <span className="absolute left-4 top-3 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">
          {step.meta}
        </span>
        <span className="absolute right-4 top-3 text-[10px] font-bold uppercase tracking-[0.2em] text-teal">
          0{index + 1} · {step.label}
        </span>
        <HouseDrawing stage={index} />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink text-gold-400 transition-transform duration-500 group-hover:-rotate-6">
            <Icon size={19} />
          </span>
          <h3 className="font-display text-xl font-bold leading-tight tracking-tight text-ink">{step.title}</h3>
        </div>
        <p className="mt-4 font-quote text-lg italic leading-snug text-ink/80">{step.lead}.</p>
        <p className="mt-2 text-[14.5px] leading-relaxed text-ink/60">{step.body}</p>
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
          {step.tag.map((t) => (
            <li
              key={t}
              className="rounded-full bg-teal/[0.08] px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.1em] text-teal"
            >
              {t}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function Process() {
  const track = useRef(null);
  const row = useRef(null);
  const [reached, setReached] = useState(-1);
  const [slide, setSlide] = useState(0);

  // Desktop: the line fills as the stages pass the middle of the screen.
  const { scrollYProgress } = useScroll({ target: track, offset: ["start 75%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const n = Math.min(STEPS.length - 1, Math.floor(v * STEPS.length + 0.15));
    setReached((prev) => (prev === n ? prev : n));
  });

  // Phones: which card the swipe row is showing, for the dots underneath.
  const onSwipe = () => {
    const el = row.current;
    const card = el?.firstElementChild;
    if (!card) return;
    const n = Math.round(el.scrollLeft / (card.offsetWidth + 16));
    setSlide((prev) => (prev === n ? prev : Math.min(STEPS.length - 1, n)));
  };
  const showSlide = (i) => {
    const el = row.current;
    const card = el?.children[i];
    if (card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft - (el.clientWidth - card.offsetWidth) / 2, behavior: "smooth" });
  };

  return (
    <section
      id="process"
      aria-label="How we build"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#dcebe4_0%,#cadfd7_48%,#e9ede7_100%)] py-24 sm:py-28 lg:py-32"
    >
      <div className="absolute inset-0 bg-blueprint opacity-70 mask-fade-edges" />
      <div className="absolute -left-40 top-0 h-[28rem] w-[28rem] rounded-full glow scale-[2] opacity-60 [--glow:255_255_255]" />
      <div className="absolute -right-32 bottom-0 h-[26rem] w-[26rem] rounded-full glow scale-[2] opacity-25 [--glow:236_215_143]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* Heading */}
        <FadeUp y={18} className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="font-display text-sm font-semibold text-teal">01</span>
              <span className="h-px w-10 bg-ink/20" />
              <span className="text-xs font-bold uppercase tracking-[0.28em] text-ink/60">How we build</span>
            </div>
            <h2 className="font-display text-[clamp(1.9rem,3.8vw,3.25rem)] font-bold leading-[1.03] tracking-tightest text-ink">
              From blueprint to keys,{" "}
              <span className="font-quote font-normal italic text-teal">every step in the open.</span>
            </h2>
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-ink/60">
            Four stages, one 10 Marla home, the way we actually build it. Nothing hidden, nothing left to trust
            alone.
          </p>
        </FadeUp>

        <div ref={track} className="relative mt-10 sm:mt-14">
          {/* Desktop progress line with a node over each card */}
          <div aria-hidden className="absolute left-0 right-0 top-[15px] hidden h-[2px] rounded-full bg-ink/10 lg:block">
            <motion.div
              style={{ scaleX: fill }}
              className="h-full w-full origin-left rounded-full bg-gradient-to-r from-teal to-gold-500"
            />
          </div>

          <ol
            ref={row}
            onScroll={onSwipe}
            className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {STEPS.map((s, i) => (
              <li
                key={s.title}
                className="flex w-[84vw] max-w-[22rem] shrink-0 snap-center flex-col sm:w-[46vw] lg:w-auto lg:max-w-none"
              >
                <span
                  className={`relative z-10 hidden h-8 w-8 place-items-center rounded-full font-display text-xs font-bold ring-4 ring-[#d6e7df] transition-colors duration-500 lg:grid ${
                    i <= reached ? "bg-ink text-gold-400" : "bg-white text-ink/50"
                  }`}
                >
                  0{i + 1}
                </span>
                <FadeUp delay={i * 0.08} y={24} className="flex flex-1 flex-col lg:mt-6">
                  <StageCard step={s} index={i} />
                </FadeUp>
              </li>
            ))}
          </ol>

          {/* Phones: where you are in the row, and a way to jump */}
          <div className="mt-6 flex items-center justify-between lg:hidden">
            <div className="-ml-1 flex">
              {STEPS.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => showSlide(i)}
                  aria-label={`Show stage ${i + 1}, ${s.title}`}
                  aria-current={i === slide ? "step" : undefined}
                  className="grid h-9 place-items-center px-1"
                >
                  <span
                    className={`block h-2 rounded-full transition-all duration-300 ${
                      i === slide ? "w-7 bg-gradient-to-r from-teal to-gold-500" : "w-2 bg-ink/20"
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink/45">
              Stage 0{slide + 1} of 04 · Swipe
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
