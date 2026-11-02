"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Phone } from "lucide-react";
import MagneticButton from "@components/ui/MagneticButton";
import { WordReveal, FadeUp } from "@components/ui/Reveal";
import { BRICKS } from "@components/BrandMark";
import { PHONE_DISPLAY, PHONE_TEL, WHATSAPP_LINK } from "@lib/site";

// Floating logo bricks that drift apart with scroll
const FLOAT = [
  { brick: 0, className: "left-[6%] top-[14%] w-28 sm:w-40", speed: -120, rotate: -12 },
  { brick: 1, className: "right-[8%] top-[10%] w-24 sm:w-36", speed: 90, rotate: 14 },
  { brick: 2, className: "left-[12%] bottom-[8%] w-24 sm:w-32", speed: 70, rotate: 8 },
  { brick: 3, className: "right-[5%] bottom-[12%] w-28 sm:w-44", speed: -80, rotate: -6 },
];

function FloatingBrick({ item, progress }) {
  const y = useTransform(progress, [0, 1], [-item.speed, item.speed]);
  const rotate = useTransform(progress, [0, 1], [item.rotate, -item.rotate]);
  const b = BRICKS[item.brick];
  return (
    <motion.svg
      viewBox="0 0 584 427"
      style={{ y, rotate }}
      className={`absolute opacity-20 ${item.className}`}
      aria-hidden
    >
      <path d={b.d} fill={item.brick < 2 ? "#6fd3c3" : "#d4af37"} />
    </motion.svg>
  );
}

export default function CallToAction() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.4], [0.92, 1]);

  return (
    <section ref={ref} className="bg-[#f1e8da] px-3 py-16 sm:px-5 sm:py-24">
      <motion.div
        style={{ scale }}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0f3a66] via-ink to-[#0d4f55] px-6 py-24 text-center sm:py-32"
      >
        <div className="absolute inset-0 bg-blueprint-light mask-fade-edges" />
        <div className="absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-gold-500/25 blur-[100px]" />
        {FLOAT.map((f, i) => (
          <FloatingBrick key={i} item={f} progress={scrollYProgress} />
        ))}

        <div className="relative">
          <FadeUp className="text-xs font-bold uppercase tracking-[0.3em] text-gold-400">
            Free consultation
          </FadeUp>
          <h2 className="mx-auto mt-6 max-w-4xl font-display text-[clamp(2.4rem,6vw,5.5rem)] font-bold leading-[1] tracking-tightest text-white">
            <WordReveal text="Let's build your home" />{" "}
            <WordReveal text="with Ihsan." delay={0.3} className="font-quote font-normal italic text-gold-400" />
          </h2>
          <FadeUp delay={0.2} as="p" className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70">
            Share your plot size and ideas. We&apos;ll come back with a clear plan, an honest estimate and a
            timeline you can hold us to.
          </FadeUp>
          <FadeUp delay={0.3} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton href={WHATSAPP_LINK} external variant="gold">
              Chat on WhatsApp
            </MagneticButton>
            <a
              href={PHONE_TEL}
              className="flex items-center gap-3 rounded-full border border-white/20 px-6 py-3.5 font-bold text-white transition-colors hover:bg-white/10"
            >
              <Phone size={18} className="text-gold-400" />
              {PHONE_DISPLAY}
            </a>
          </FadeUp>
        </div>
      </motion.div>
    </section>
  );
}
