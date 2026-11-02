"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Sparkles, Handshake, ShieldCheck, Scale, HeartHandshake, Eye, Target } from "lucide-react";
import SectionHeading from "@components/ui/SectionHeading";
import { FadeUp } from "@components/ui/Reveal";
import Khatam, { KHATAM_PATTERN } from "@components/ui/Khatam";

const VALUES = [
  {
    icon: Sparkles,
    title: "Ihsan",
    meaning: "Excellence",
    quote: "Verily, Allah loves when one of you does a job, he perfects it.",
    source: "Al-Bayhaqi",
    description:
      "Doing everything with excellence and sincerity, aware that Allah sees all that we do. From laying bricks to customer service, we strive for perfection as an act of worship.",
  },
  {
    icon: Handshake,
    title: "Sidq",
    meaning: "Honesty",
    quote: "The truthful and trustworthy merchant will be with the prophets, the truthful, and the martyrs.",
    source: "Tirmidhi",
    description:
      "Truthfulness in every promise, every price quote and every project update. Honesty is a sacred trust between us and Allah before it is between us and our clients.",
  },
  {
    icon: ShieldCheck,
    title: "Amanah",
    meaning: "Trustworthiness",
    quote: "The signs of a hypocrite are three: when he speaks, he lies; when he promises, he breaks it; and when he is entrusted, he betrays.",
    source: "Bukhari",
    description:
      "Fulfilling every commitment as a sacred trust, whether to clients, partners or our team. We handle your project as an Amanah from Allah.",
  },
  {
    icon: Scale,
    title: "Adl",
    meaning: "Fairness & Justice",
    quote: "O you who believe! Stand out firmly for justice…",
    source: "Quran 4:135",
    description:
      "Fairness in pricing, treatment and decisions for clients and labourers alike. The worker deserves his wages before his sweat dries.",
  },
  {
    icon: HeartHandshake,
    title: "Rifq",
    meaning: "Gentleness & Kindness",
    quote: "Allah is Kind and loves kindness in all matters.",
    source: "Bukhari",
    description:
      "Dealing with clients, workers and suppliers with the compassion and respect taught by our Prophet (ﷺ). Kindness in business is both Sunnah and good practice.",
  },
];

function ValueCard({ value, index }) {
  const Icon = value.icon;
  return (
    <div className="sticky" style={{ top: `calc(7rem + ${index * 1.25}rem)` }}>
      <FadeUp
        y={40}
        className="relative overflow-hidden rounded-3xl border border-teal/10 bg-white p-7 shadow-lift sm:p-9"
      >
        <Khatam className="absolute -right-16 -top-16 h-56 w-56 text-teal/[0.07]" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-mint text-teal">
              <Icon size={26} />
            </span>
            <div>
              <h3 className="font-display text-3xl font-bold tracking-tight text-ink">{value.title}</h3>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal">{value.meaning}</p>
            </div>
          </div>
          <span className="font-display text-sm font-semibold text-ink/30">0{index + 1}</span>
        </div>
        <blockquote className="relative mt-7 border-l-2 border-gold-500 pl-5">
          <p className="font-quote text-xl italic leading-relaxed text-ink">“{value.quote}”</p>
          <cite className="mt-2 block text-sm font-semibold not-italic text-ink/50">{value.source}</cite>
        </blockquote>
        <p className="relative mt-6 leading-relaxed text-ink/65">{value.description}</p>
      </FadeUp>
    </div>
  );
}

export default function Values() {
  const section = useRef(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  return (
    <section
      ref={section}
      className="relative overflow-x-clip bg-[#eef5f2] py-24 sm:py-32"
      style={{ backgroundImage: KHATAM_PATTERN }}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* Sticky intro */}
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <div className="relative">
              <motion.div style={{ rotate }} className="absolute -left-20 -top-24 -z-0 h-72 w-72 text-teal/15">
                <Khatam className="h-full w-full" />
              </motion.div>
              <div className="relative">
                <SectionHeading
                  index="06"
                  eyebrow="Our foundation"
                  title="Principles laid"
                  accent="before the first brick."
                  description="Every brick we lay and every promise we make is grounded in the Quran and the Prophetic teachings of excellence, trust and service to humanity."
                />
              </div>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <FadeUp className="rounded-3xl bg-white/80 p-6 shadow-soft backdrop-blur">
                <div className="flex items-center gap-3">
                  <Eye size={20} className="text-teal" />
                  <h3 className="font-display text-lg font-bold text-ink">Our vision</h3>
                </div>
                <p className="mt-3 font-quote italic leading-relaxed text-ink/70">
                  With the will of Allah, we build with Ihsan, crafting spaces with sincerity, trust and
                  excellence, knowing that every structure we create is a responsibility before Him and a
                  service to humanity.
                </p>
              </FadeUp>
              <FadeUp delay={0.1} className="rounded-3xl bg-white/80 p-6 shadow-soft backdrop-blur">
                <div className="flex items-center gap-3">
                  <Target size={20} className="text-teal" />
                  <h3 className="font-display text-lg font-bold text-ink">Our mission</h3>
                </div>
                <p className="mt-3 font-quote italic leading-relaxed text-ink/70">
                  To implement the will of Allah Almighty in all our business dealings, guided by
                  Shariah-based practices, delivering high-quality, transparent and cost-effective
                  construction.
                </p>
              </FadeUp>
            </div>
          </div>

          {/* Stacking cards */}
          <div className="space-y-6 pb-4">
            {VALUES.map((v, i) => (
              <ValueCard key={v.title} value={v} index={i} />
            ))}
          </div>
        </div>

        {/* Promise */}
        <FadeUp className="relative mt-24 overflow-hidden rounded-[2rem] bg-white px-6 py-14 text-center shadow-lift sm:px-12 sm:py-20">
          <Khatam className="absolute -left-24 top-1/2 h-80 w-80 -translate-y-1/2 text-gold-500/20 animate-spin-slow" />
          <Khatam className="absolute -right-24 top-1/2 h-80 w-80 -translate-y-1/2 text-teal/10 animate-spin-slow" />
          <p className="relative text-xs font-bold uppercase tracking-[0.3em] text-teal">Our Islamic business promise</p>
          <p className="relative mx-auto mt-6 max-w-3xl font-quote text-[clamp(1.6rem,3.4vw,2.75rem)] italic leading-snug text-ink">
            “The best earnings are from honest business conducted with a pure heart.”
          </p>
          <p className="relative mt-3 text-sm font-semibold text-ink/50">Tabarani</p>
          <p className="relative mx-auto mt-8 max-w-2xl leading-relaxed text-ink/65">
            We pledge to conduct all our affairs by Quranic principles of business ethics, ensuring halal
            earnings and barakah in every project. Our construction is more than buildings: it is worship
            through craftsmanship, serving this world and the hereafter.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
