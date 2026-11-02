"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, fontsReady } from "@components/motion/gsap";

let lenisInstance = null;

export function getLenis() {
  return lenisInstance;
}

export default function SmoothScroll({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      // Lerp rather than a fixed duration: the glide is frame-rate independent
      // and keeps its weight whether you nudge the wheel or throw it.
      lerp: 0.085,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });
    lenisInstance = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Headings are split once the webfonts land, which changes their height.
    // Re-measure every trigger afterwards so nothing fires at the wrong place.
    let cancelled = false;
    fontsReady().then(() => !cancelled && ScrollTrigger.refresh());

    return () => {
      cancelled = true;
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  // New route: start at the top and let triggers re-measure.
  useEffect(() => {
    lenisInstance?.scrollTo(0, { immediate: true });
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return children;
}
