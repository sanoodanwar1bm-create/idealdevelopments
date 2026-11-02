"use client";

import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

// Fade + rise when scrolled into view.
export function FadeUp({ children, delay = 0, y = 28, className = "", as = "div", ...rest }) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

// Splits text into words that slide up from behind a mask.
// `show` lets a parent control timing (e.g. after the preloader); otherwise it plays in view.
export function WordReveal({ text, className = "", delay = 0, stagger = 0.06, show }) {
  const words = text.split(" ");
  const controlled = show !== undefined;
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom" aria-hidden>
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "105%" }}
            {...(controlled
              ? { animate: show ? { y: 0 } : { y: "105%" } }
              : { whileInView: { y: 0 }, viewport: { once: true, margin: "-60px" } })}
            transition={{ duration: 1, delay: delay + i * stagger, ease: EASE }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
