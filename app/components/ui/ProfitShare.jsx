"use client";

import { motion } from "framer-motion";
import { FadeUp } from "./Reveal";

const EASE = [0.16, 1, 0.3, 1];

// 60/40 Musharakah visual for the investor programme
export default function ProfitShare({ className = "mt-8" }) {
  return (
    <FadeUp className={`${className} rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur`}>
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Musharakah profit share</p>
        <p className="shrink-0 whitespace-nowrap font-display text-2xl font-bold text-white">
          60<span className="text-gold-400"> / </span>40
        </p>
      </div>
      <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-white/15">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "60%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
          className="h-full bg-gold-500"
        />
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "40%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.6 }}
          className="h-full bg-white/80"
        />
      </div>
      <p className="mt-3 text-[13px] text-white/70">Profit-sharing, never interest. Risk and reward shared fairly.</p>
    </FadeUp>
  );
}
