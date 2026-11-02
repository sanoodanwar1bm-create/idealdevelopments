"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import BrandMark from "@components/BrandMark";

/*
 * Route change curtain.
 *
 * This lives in app/template.jsx, which React remounts on every navigation —
 * that remount is the cue, so there is no link interception and nothing to go
 * stale. The panel starts covering the new page and wipes upward off the top,
 * which reads as the page being uncovered rather than as a loading screen.
 *
 * It deliberately sits out the very first page load: there the preloader (or
 * simply the page arriving) is the entrance, and two overlays would fight.
 *
 * The page underneath only ever animates opacity. A transform on this wrapper
 * would make it the containing block for the fixed navbar and the back-to-top
 * button, so all the movement belongs to the curtain, which is fixed itself.
 */

let hasNavigated = false;

const EASE = [0.76, 0, 0.24, 1];

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const first = useRef(!hasNavigated);
  const [skip, setSkip] = useState(false);
  const [covering, setCovering] = useState(!first.current);

  useEffect(() => {
    hasNavigated = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSkip(true);
      setCovering(false);
      return;
    }
    if (first.current) return;
    // Hold long enough for the mark to land before the panel starts to lift,
    // so it reads as a deliberate beat rather than a flash.
    const id = setTimeout(() => setCovering(false), 260);
    return () => clearTimeout(id);
  }, [pathname]);

  const animated = !first.current && !skip;

  return (
    <>
      <AnimatePresence>
        {covering && (
          <motion.div
            key="curtain"
            className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center overflow-hidden bg-ink"
            initial={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.68, ease: EASE }}
          >
            <div className="absolute inset-0 bg-blueprint-light opacity-70" />
            {/* No exit of its own — the mark rides up and off with the panel. */}
            <motion.div
              className="relative w-20 sm:w-24"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.26, ease: "easeOut" }}
            >
              <BrandMark animate={false} tone="light" className="h-full w-full" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={animated ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55, delay: animated ? 0.46 : 0, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </>
  );
}
