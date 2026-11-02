"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import services from "@lib/services.json";
import SectionHeading from "@components/ui/SectionHeading";
import MagneticButton from "@components/ui/MagneticButton";
import { FadeUp } from "@components/ui/Reveal";

export default function ServicesSection() {
  const [hovered, setHovered] = useState(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 22 });
  const sy = useSpring(y, { stiffness: 180, damping: 22 });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  return (
    <section id="services" className="relative overflow-x-clip bg-[#f1e8da] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            index="02"
            eyebrow="What we offer"
            title="Everything your project needs,"
            accent="under one roof."
            description="Our services are more than construction. They are acts of trust and responsibility, carried out with Ihsan, integrity and Islamic values at the core."
          />
          <FadeUp delay={0.2} className="shrink-0">
            <MagneticButton href="/services" variant="light">
              All services
            </MagneticButton>
          </FadeUp>
        </div>

        <div
          className="relative mt-16 border-t border-ink/15"
          onPointerMove={onMove}
          onPointerLeave={() => setHovered(null)}
        >
          {/* Cursor-following preview (desktop) */}
          <motion.div
            style={{ x: sx, y: sy }}
            className="pointer-events-none absolute left-0 top-0 z-20 hidden lg:block"
          >
            <AnimatePresence>
              {hovered !== null && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
                  animate={{ opacity: 1, scale: 1, rotate: -4 }}
                  exit={{ opacity: 0, scale: 0.6, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  className="relative ml-10 -mt-32 h-64 w-80 overflow-hidden rounded-2xl shadow-lift ring-4 ring-white"
                >
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={hovered}
                      initial={{ clipPath: "inset(100% 0 0 0)" }}
                      animate={{ clipPath: "inset(0% 0 0 0)" }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={services[hovered].image}
                        alt=""
                        fill
                        sizes="320px"
                        className="object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <ul>
            {services.map((s, i) => (
              <FadeUp as="li" key={s.slug} delay={i * 0.05} y={20}>
                <Link
                  href={`/service/${s.slug}`}
                  onPointerEnter={() => setHovered(i)}
                  className="group relative flex items-center gap-4 overflow-hidden border-b border-ink/15 py-7 sm:gap-8 sm:py-9"
                >
                  {/* Fill sweep */}
                  <span className="absolute inset-0 origin-bottom scale-y-0 bg-white/80 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />

                  <span className="relative hidden w-16 shrink-0 pl-4 font-display text-sm font-semibold text-teal sm:block">
                    0{i + 1}
                  </span>

                  <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl lg:hidden">
                    <Image src={s.image} alt="" fill sizes="64px" className="object-cover" />
                  </span>

                  <span className="relative min-w-0 flex-1">
                    <span className="block font-display text-xl font-bold tracking-tight text-ink transition-transform duration-500 group-hover:translate-x-2 sm:text-4xl lg:text-5xl">
                      {s.title}
                    </span>
                    <span className="mt-2 hidden max-w-2xl text-ink/60 sm:block lg:max-w-xl">
                      {s.description}
                    </span>
                  </span>

                  <span className="relative mr-0 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-ink/15 text-ink transition-all duration-500 group-hover:rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-gold-400 sm:mr-4 sm:h-14 sm:w-14">
                    <ArrowUpRight size={22} />
                  </span>
                </Link>
              </FadeUp>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
