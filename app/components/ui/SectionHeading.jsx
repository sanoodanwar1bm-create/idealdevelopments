"use client";

import SplitReveal from "@components/motion/SplitReveal";
import { FadeUp } from "./Reveal";

export default function SectionHeading({
  index,
  eyebrow,
  title,
  accent,
  description,
  align = "left",
  tone = "dark",
  className = "",
}) {
  const centered = align === "center";
  const light = tone === "light";
  return (
    <div className={`${centered ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      <FadeUp className={`mb-5 flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
        <span className={`font-display text-sm font-semibold ${light ? "text-gold-400" : "text-teal"}`}>{index}</span>
        <span className={`h-px w-10 ${light ? "bg-white/30" : "bg-ink/20"}`} />
        <span className={`text-xs font-bold uppercase tracking-[0.28em] ${light ? "text-white/70" : "text-ink/60"}`}>
          {eyebrow}
        </span>
      </FadeUp>

      {/* Split on the whole heading, so the accent clause rides the same lines
          as the rest of the sentence instead of animating on its own clock. */}
      <SplitReveal
        as="h2"
        className={`font-display text-[clamp(2.25rem,5vw,4.25rem)] font-bold leading-[1.02] tracking-tightest text-balance ${
          light ? "text-white" : "text-ink"
        }`}
      >
        {title}
        {accent && (
          <>
            {" "}
            <span className={`font-quote font-normal italic ${light ? "text-gold-400" : "text-teal"}`}>{accent}</span>
          </>
        )}
      </SplitReveal>

      {description && (
        <FadeUp delay={0.2} as="p" className={`mt-6 text-lg leading-relaxed ${light ? "text-white/70" : "text-ink/65"}`}>
          {description}
        </FadeUp>
      )}
    </div>
  );
}
