"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/* A hairline of brand gradient across the very top, filling with page scroll. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[2px] origin-left bg-gradient-to-r from-teal via-teal to-gold-500"
    />
  );
}
