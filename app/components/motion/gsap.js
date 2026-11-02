"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/*
 * One registration point for GSAP.
 *
 * The split between the two animation libraries in this project is deliberate:
 *   - GSAP + ScrollTrigger drive anything tied to scroll position — heading
 *     reveals, parallax, the build progress — because it measures and refreshes
 *     properly alongside Lenis.
 *   - framer-motion drives component state — accordions, presence, hover — where
 *     React already owns the state.
 */

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

// House easing. Everything that enters uses OUT, everything that leaves uses IN,
// so motion across the site reads as one hand.
export const EASE_OUT = "power4.out";
export const EASE_IN_OUT = "power3.inOut";

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Resolves once web fonts are in, so SplitText never measures fallback metrics.
 * Raced against a deadline: on a bad connection a heading waiting on fonts.ready
 * would otherwise sit invisible, and slightly-off line breaks beat no text.
 */
export const fontsReady = (deadline = 1200) => {
  if (typeof document === "undefined" || !document.fonts) return Promise.resolve();
  return Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, deadline))]);
};

export { gsap, ScrollTrigger, SplitText };
