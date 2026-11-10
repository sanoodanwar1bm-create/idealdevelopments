"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Building2, Home, PencilRuler, RefreshCcw, Handshake, Check, ArrowUpRight, Quote } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import services from "@lib/services.json";
import { FadeUp, WordReveal } from "@components/ui/Reveal";
import { scrollToId } from "./ServicesHero";
import ProfitShare from "@components/ui/ProfitShare";
import { whatsappFor } from "@lib/site";

const ICONS = { Building2, Home, Layout: PencilRuler, RefreshCcw, Handshake };

const THEMES = [
  { bg: "bg-[linear-gradient(180deg,#e2eaf0,#d5e1ea)]", light: false },
  { bg: "bg-[linear-gradient(180deg,#f3ebdf,#ece0cd)]", light: false },
  { bg: "bg-[linear-gradient(180deg,#dcebe5,#cbe0d8)]", light: false },
  { bg: "bg-[linear-gradient(180deg,#f4e6da,#ecd9c8)]", light: false },
  { bg: "bg-[linear-gradient(135deg,#2f6c78_0%,#3a7f86_55%,#4a8f86_100%)]", light: true },
];

const EASE = [0.16, 1, 0.3, 1];

function Media({ service, index, light }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [index % 2 ? 2 : -2, index % 2 ? -2 : 2]);

  return (
    <div ref={ref} className="relative">
      <motion.div
        data-reveal=""
        initial={{ clipPath: "inset(12% 12% 12% 12% round 2rem)", opacity: 0 }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0% round 2rem)", opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: EASE }}
        style={{ rotate }}
        className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-lift lg:aspect-[4/5]"
      >
        <motion.div style={{ y }} className="absolute -inset-y-[10%] inset-x-0">
          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="(max-width: 1024px) 100vw, 600px"
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
        <span className="absolute left-6 top-5 font-display text-7xl font-extrabold leading-none text-white/90 drop-shadow-lg sm:text-8xl">
          0{index + 1}
        </span>
      </motion.div>

      {/* Floating faith note */}
      <FadeUp
        delay={0.4}
        className={`relative -mt-16 ml-auto mr-4 max-w-xs rounded-2xl p-5 shadow-lift backdrop-blur-xl sm:mr-8 lg:absolute lg:-bottom-10 lg:mt-0 ${
          index % 2 ? "lg:-left-10 lg:ml-0" : "lg:-right-10"
        } ${light ? "bg-white/90" : "bg-white/85"}`}
      >
        <Quote size={20} className="text-gold-500" />
        <p className="mt-2 font-quote text-[15px] italic leading-relaxed text-ink">{service.faithNote}</p>
      </FadeUp>
    </div>
  );
}

function ProcessSteps({ steps, light }) {
  return (
    <ol className="relative mt-4 grid gap-4 sm:grid-flow-col sm:auto-cols-fr">
      <motion.span
        aria-hidden
        data-reveal="still"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: "easeInOut", delay: 0.2 }}
        className={`absolute left-4 right-4 top-4 hidden h-px origin-left sm:block ${light ? "bg-white/40" : "bg-ink/20"}`}
      />
      {steps.map((st, i) => (
        <motion.li
          key={st.title}
          data-reveal=""
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + i * 0.15, duration: 0.6, ease: EASE }}
          className="relative flex gap-3 sm:block"
        >
          <span
            className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full font-display text-xs font-bold ${
              light ? "bg-gold-500 text-ink" : "bg-ink text-gold-400"
            }`}
          >
            {i + 1}
          </span>
          <div className="sm:mt-3">
            <p className={`font-display text-sm font-bold ${light ? "text-white" : "text-ink"}`}>{st.title}</p>
            <p className={`mt-1 text-[13px] leading-relaxed ${light ? "text-white/70" : "text-ink/55"}`}>
              {st.description}
            </p>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}

function Chapter({ service, index, onActive }) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  const theme = THEMES[index % THEMES.length];
  const light = theme.light;
  const Icon = ICONS[service.icon] ?? Building2;
  const flip = index % 2 === 1;

  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <section
      ref={ref}
      id={service.slug}
      className={`relative scroll-mt-4 overflow-x-clip py-24 sm:py-32 ${theme.bg}`}
    >
      <div className={`absolute inset-0 opacity-50 mask-fade-edges ${light ? "bg-blueprint-light" : "bg-blueprint"}`} />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20 xl:pl-24">
        <div className={flip ? "lg:order-2" : ""}>
          <Media service={service} index={index} light={light} />
        </div>

        <div>
          <FadeUp className="flex items-center gap-3">
            <span
              className={`grid h-12 w-12 place-items-center rounded-2xl ${
                light ? "bg-gold-500 text-ink" : "bg-ink text-gold-400"
              }`}
            >
              <Icon size={22} />
            </span>
            <span className={`text-xs font-bold uppercase tracking-[0.25em] ${light ? "text-white/70" : "text-ink/55"}`}>
              Service 0{index + 1}
            </span>
          </FadeUp>

          <h2
            className={`mt-6 font-display text-[clamp(2.1rem,4.4vw,3.75rem)] font-bold leading-[1.02] tracking-tightest text-balance ${
              light ? "text-white" : "text-ink"
            }`}
          >
            <WordReveal text={service.title} />
          </h2>

          <FadeUp delay={0.1} as="p" className={`mt-5 text-lg leading-relaxed ${light ? "text-white/80" : "text-ink/65"}`}>
            {service.longDescription}
          </FadeUp>

          <ul className="mt-8 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {service.features.map((f, i) => (
              <motion.li
                key={f}
                data-reveal=""
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.5 }}
                className={`flex items-start gap-3 text-[15px] font-semibold ${light ? "text-white" : "text-ink"}`}
              >
                <span
                  className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                    light ? "bg-white/20 text-gold-400" : "bg-teal/15 text-teal"
                  }`}
                >
                  <Check size={12} strokeWidth={3} />
                </span>
                {f}
              </motion.li>
            ))}
          </ul>

          {service.slug === "investor-partnership" && <ProfitShare />}

          <div className={`mt-10 border-t pt-6 ${light ? "border-white/20" : "border-ink/10"}`}>
            <p className={`text-xs font-bold uppercase tracking-[0.25em] ${light ? "text-white/60" : "text-ink/50"}`}>
              How it works
            </p>
            <ProcessSteps steps={service.ourProcess} light={light} />
          </div>

          <FadeUp delay={0.2} className="mt-10 flex flex-wrap gap-3">
            <Link
              href={`/service/${service.slug}`}
              className={`group inline-flex items-center gap-3 rounded-full py-2 pl-6 pr-2 text-[15px] font-bold transition-transform hover:-translate-y-0.5 ${
                light ? "bg-white text-ink" : "bg-ink text-white"
              }`}
            >
              Explore this service
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-500 text-ink transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight size={18} />
              </span>
            </Link>
            <a
              href={whatsappFor(service.title)}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-[15px] font-bold transition-colors ${
                light ? "border-white/30 text-white hover:bg-white/10" : "border-ink/15 text-ink hover:bg-white/60"
              }`}
            >
              <FaWhatsapp size={18} className={light ? "text-gold-400" : "text-teal"} />
              Ask about this
            </a>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// Side navigator that tracks the service being read (desktop).
function SideNav({ active, show }) {
  const onLight = !THEMES[active]?.light;
  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          aria-label="Services"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
        >
          <ul className="space-y-1">
            {services.map((s, i) => {
              const on = i === active;
              return (
                <li key={s.slug}>
                  <button onClick={() => scrollToId(s.slug)} className="group flex items-center gap-3 py-1.5">
                    <span
                      className={`block h-[3px] rounded-full transition-all duration-500 ${
                        on ? "w-10 bg-gold-500" : `w-4 ${onLight ? "bg-ink/25" : "bg-white/40"} group-hover:w-6`
                      }`}
                    />
                    <span
                      className={`font-display text-xs font-bold transition-all duration-500 ${
                        on
                          ? onLight
                            ? "text-ink"
                            : "text-white"
                          : `${onLight ? "text-ink/35" : "text-white/50"} opacity-0 group-hover:opacity-100`
                      }`}
                    >
                      0{i + 1}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

export default function ServiceChapters() {
  const wrapper = useRef(null);
  const inside = useInView(wrapper, { margin: "-40% 0px -40% 0px" });
  const [active, setActive] = useState(0);

  return (
    <div ref={wrapper}>
      <SideNav active={active} show={inside} />
      {services.map((s, i) => (
        <Chapter key={s.slug} service={s} index={i} onActive={setActive} />
      ))}
    </div>
  );
}
