"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, MessageCircleQuestion } from "lucide-react";
import faqs from "@lib/faqs.json";
import SectionHeading from "@components/ui/SectionHeading";
import { FadeUp } from "@components/ui/Reveal";
import MagneticButton from "@components/ui/MagneticButton";
import { WHATSAPP_LINK } from "@lib/site";

const EASE = [0.16, 1, 0.3, 1];

function Item({ item, open, onToggle, index }) {
  return (
    <FadeUp y={18} delay={index * 0.04} className="border-b border-ink/10">
      <h3>
        <button
          onClick={onToggle}
          aria-expanded={open}
          className="group flex w-full items-start gap-5 py-6 text-left"
        >
          <span className="mt-1 font-display text-xs font-bold tabular-nums text-teal">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="flex-1 font-display text-lg font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-teal sm:text-xl">
            {item.q}
          </span>
          <span
            className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
              open ? "rotate-[135deg] border-ink bg-ink text-gold-400" : "border-ink/15 text-ink group-hover:border-ink/40"
            }`}
          >
            <Plus size={17} />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="max-w-3xl pb-7 pl-10 pr-12 leading-relaxed text-ink/65">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </FadeUp>
  );
}

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="relative overflow-x-clip bg-ivory py-24 sm:py-32">
      <div className="absolute inset-0 bg-blueprint opacity-40 mask-fade-edges" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:h-fit">
          <SectionHeading
            index="07"
            eyebrow="Straight answers"
            title="The questions"
            accent="everyone asks first."
            description="Costs, timelines, material proof and how our halal partnership works — answered plainly, before you even call."
          />
          <FadeUp delay={0.2} className="mt-9 rounded-3xl border border-teal/15 bg-white p-6 shadow-soft">
            <MessageCircleQuestion size={22} className="text-teal" />
            <p className="mt-3 font-display text-lg font-bold text-ink">Still unsure about something?</p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/60">
              Send us your plot size and location on WhatsApp. You will get a realistic figure and a
              timeline the same day, with no obligation.
            </p>
            <div className="mt-5">
              <MagneticButton href={WHATSAPP_LINK} external variant="dark">
                Ask on WhatsApp
              </MagneticButton>
            </div>
          </FadeUp>
        </div>

        <div className="border-t border-ink/10">
          {faqs.map((item, i) => (
            <Item
              key={item.q}
              item={item}
              index={i}
              open={open === i}
              onToggle={() => setOpen((v) => (v === i ? -1 : i))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
