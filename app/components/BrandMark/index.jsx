"use client";

import { motion } from "framer-motion";

// The IDEAL Developments mark as four parallelogram "bricks" (traced from the official icon).
export const BRICKS = [
  { d: "M160 122 L277 0 H433 V110 Q433 122 421 122 Z", fill: "#157a6e", from: { x: 120, y: -160 } },
  { d: "M5 272 L128 152 H266 Q278 152 278 164 V260 Q278 272 266 272 Z", fill: "#157a6e", from: { x: -180, y: -40 } },
  { d: "M324 152 H584 L462 272 H324 Q312 272 312 260 V164 Q312 152 324 152 Z", fill: "#0a284e", from: { x: 180, y: 40 } },
  { d: "M169 305 H433 L310 427 H157 V317 Q157 305 169 305 Z", fill: "#0a284e", from: { x: -120, y: 160 } },
];

// On dark surfaces the navy bricks disappear, so the mark gets a light set.
const LIGHT_FILLS = ["#6fd3c3", "#6fd3c3", "#e2c25e", "#e2c25e"];

export default function BrandMark({ className = "", animate = true, delay = 0, tone = "brand" }) {
  const fillFor = (b, i) => (tone === "light" ? LIGHT_FILLS[i] : b.fill);
  return (
    <svg viewBox="0 0 584 427" className={className} aria-hidden>
      {BRICKS.map((b, i) =>
        animate ? (
          <motion.path
            key={i}
            d={b.d}
            fill={fillFor(b, i)}
            initial={{ ...b.from, opacity: 0 }}
            animate={{ x: 0, y: 0, opacity: 1 }}
            transition={{ delay: delay + i * 0.12, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />
        ) : (
          <path key={i} d={b.d} fill={fillFor(b, i)} />
        )
      )}
    </svg>
  );
}
