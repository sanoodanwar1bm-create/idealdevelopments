"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, MapPin, Play, X } from "lucide-react";
import tours from "@lib/tours.json";
import SectionHeading from "@components/ui/SectionHeading";
import { getLenis } from "@components/SmoothScroll";
import { whatsappForProject } from "@lib/site";

// A vertical "reel" card. The silent preview only plays while the card is on
// screen, so four videos never decode at once on a phone.
function TourCard({ tour, index, onOpen }) {
  const ref = useRef(null);
  const video = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const v = video.current;
    if (!el || !v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.45 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={() => onOpen(index)}
      data-reveal=""
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ delay: index * 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      aria-label={`Play video tour of ${tour.title}, ${tour.location}`}
      className={`group relative aspect-[9/16] w-[72vw] shrink-0 snap-center overflow-hidden rounded-[2rem] bg-ink text-left shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/10 sm:w-[44vw] lg:w-auto ${
        index % 2 === 1 ? "lg:mt-12" : ""
      }`}
    >
      <video
        ref={video}
        src={tour.preview}
        poster={tour.poster}
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/30" />

      <div className="absolute inset-x-4 top-4 flex items-center justify-between">
        <span className="rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-ink backdrop-blur">
          {tour.status}
        </span>
        <span className="rounded-full bg-ink/60 px-2.5 py-1.5 text-[11px] font-bold tabular-nums text-white backdrop-blur">
          {tour.duration}
        </span>
      </div>

      <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/40 backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:bg-gold-500 group-hover:text-ink group-hover:ring-gold-500">
        <Play size={22} className="ml-1" fill="currentColor" />
      </span>

      <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold-400">{tour.tag}</p>
        <h3 className="mt-2 font-display text-2xl font-bold tracking-tight">{tour.title}</h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-white/70">
          <MapPin size={14} className="shrink-0 text-gold-400" />
          {tour.location}
        </p>
      </div>
    </motion.button>
  );
}

function TourPlayer({ index, onClose, onStep }) {
  const tour = tours[index];

  useEffect(() => {
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [onClose, onStep]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${tour.title} video tour`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[#05162b]/95 px-4 py-6 backdrop-blur-xl"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close video"
        className="absolute right-4 top-4 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white hover:text-ink sm:right-8 sm:top-8"
      >
        <X size={22} />
      </button>

      <div
        className="flex h-full w-full max-w-5xl items-center justify-center gap-6 lg:gap-12"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => onStep(-1)}
          aria-label="Previous tour"
          className="hidden h-12 w-12 shrink-0 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-gold-400 hover:text-gold-400 md:grid"
        >
          <ChevronLeft size={22} />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={tour.slug}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-full max-h-[88svh] flex-col items-center gap-8 lg:flex-row lg:items-center"
          >
            <video
              src={tour.video}
              poster={tour.poster}
              controls
              autoPlay
              playsInline
              className="aspect-[9/16] h-full max-h-[72svh] rounded-[1.75rem] bg-black shadow-2xl ring-1 ring-white/10 lg:max-h-[88svh]"
            />

            <div className="w-full max-w-xs text-white lg:w-72">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold-400">
                {tour.status} · {tour.tag}
              </p>
              <h3 className="mt-3 font-display text-3xl font-bold tracking-tight lg:text-4xl">{tour.title}</h3>
              <p className="mt-2 flex items-center gap-1.5 text-white/70">
                <MapPin size={15} className="shrink-0 text-gold-400" />
                {tour.location}, Islamabad
              </p>
              <a
                href={whatsappForProject(tour.title)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 hidden items-center justify-between gap-3 rounded-full bg-gold-500 py-2.5 pl-5 pr-2.5 text-sm font-bold text-ink transition-transform duration-300 hover:-translate-y-0.5 lg:flex"
              >
                Ask about this home
                <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-white">
                  <ArrowUpRight size={16} />
                </span>
              </a>
              <p className="mt-6 hidden text-xs font-semibold tabular-nums text-white/40 lg:block">
                {String(index + 1).padStart(2, "0")} / {String(tours.length).padStart(2, "0")}
              </p>
              {/* Phones: compact controls under the video */}
              <div className="flex items-center justify-between lg:hidden">
                <button type="button" onClick={() => onStep(-1)} aria-label="Previous tour" className="grid h-11 w-11 place-items-center rounded-full border border-white/20">
                  <ChevronLeft size={20} />
                </button>
                <a
                  href={whatsappForProject(tour.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-gold-500 px-5 py-3 text-sm font-bold text-ink"
                >
                  Ask about this home
                </a>
                <button type="button" onClick={() => onStep(1)} aria-label="Next tour" className="grid h-11 w-11 place-items-center rounded-full border border-white/20">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={() => onStep(1)}
          aria-label="Next tour"
          className="hidden h-12 w-12 shrink-0 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-gold-400 hover:text-gold-400 md:grid"
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </motion.div>
  );
}

export default function HomeTours() {
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir) => setOpen((i) => (i === null ? i : (i + dir + tours.length) % tours.length)),
    []
  );

  return (
    <section id="tours" className="relative overflow-hidden bg-ink py-24 sm:py-32">
      {/* soft light behind the reels */}
      <div className="pointer-events-none absolute -right-40 top-10 h-[36rem] w-[36rem] rounded-full glow scale-[2] opacity-30 [--glow:21_122_110]" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[30rem] w-[30rem] rounded-full glow scale-[2] opacity-10 [--glow:212_175_55]" />
      <div className="bg-blueprint pointer-events-none absolute inset-0 opacity-[0.06]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="05"
            eyebrow="Home tours"
            title="Step inside the homes"
            accent="we've built."
            description="Real walkthroughs of finished IDEAL Developments homes in B-17 and Faisal Margalla City. Tap a home to watch the full tour."
            tone="light"
          />
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/50 lg:hidden">Swipe to explore →</p>
        </div>
      </div>

      <div className="no-scrollbar relative mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-14 sm:gap-6 sm:px-8 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-4 lg:overflow-visible lg:pb-12">
        {tours.map((t, i) => (
          <TourCard key={t.slug} tour={t} index={i} onOpen={setOpen} />
        ))}
      </div>

      <AnimatePresence>
        {open !== null && <TourPlayer index={open} onClose={close} onStep={step} />}
      </AnimatePresence>
    </section>
  );
}
