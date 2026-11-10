"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, animate } from "framer-motion";
import BrandMark from "@components/BrandMark";

const STEPS = ["Surveying the site", "Laying the foundation", "Raising the structure", "Welcome"];
const SEEN_KEY = "ideal-intro-seen";
const stepAt = (count) => STEPS[Math.min(STEPS.length - 1, Math.floor(count / 26))];

// Brief branded intro. Plays once per browser session.
// Everything that moves every frame is a transform or a direct DOM write: the
// overlay covers the whole viewport, and Safari repaints all of it for clip-path,
// width, or a React re-render on each frame.
export default function Preloader({ onDone }) {
  const [show, setShow] = useState(true);
  const [step, setStep] = useState(STEPS[0]);
  const [quick, setQuick] = useState(false);
  const countRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) setQuick(true);

    // Phones and metered connections get a shorter intro: they are already
    // waiting on the network, so don't spend their patience on an animation.
    const lean =
      (navigator.connection?.saveData ?? false) ||
      (navigator.hardwareConcurrency ?? 8) <= 4 ||
      (window.matchMedia("(pointer: coarse)").matches && window.innerWidth < 900);

    const controls = animate(0, 100, {
      duration: seen || reduced ? 0.35 : lean ? 1.1 : 2.1,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => {
        const count = Math.round(v);
        if (countRef.current) countRef.current.textContent = count;
        if (barRef.current) barRef.current.style.transform = `scaleX(${v / 100})`;
        setStep(stepAt(count)); // bails out unless the label actually changes
      },
      onComplete: () => setTimeout(() => setShow(false), seen || reduced ? 0 : 250),
    });
    return () => controls.stop();
  }, []);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {show && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ivory bg-blueprint"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: quick ? 0.4 : 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="w-28 sm:w-36">
            <BrandMark delay={0.1} />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-col items-center font-brand leading-none"
          >
            <span className="pl-[0.1em] text-4xl font-extrabold tracking-[0.1em] text-ink sm:text-5xl">IDEAL</span>
            <span className="mt-3 pl-[0.4em] text-[10px] font-semibold tracking-[0.4em] text-teal sm:text-[13px]">
              DEVELOPMENTS
            </span>
          </motion.p>

          <div className="absolute inset-x-6 bottom-10 mx-auto max-w-xl sm:bottom-14">
            <div className="mb-3 flex items-end justify-between font-display text-ink">
              <AnimatePresence mode="wait">
                <motion.span
                  key={step}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="text-xs font-semibold uppercase tracking-[0.25em] text-ink/60"
                >
                  {step}
                </motion.span>
              </AnimatePresence>
              <span className="text-4xl font-bold tabular-nums tracking-tight">
                <span ref={countRef}>0</span>
                <span className="text-gold-500">%</span>
              </span>
            </div>
            <div className="h-[3px] w-full overflow-hidden rounded-full bg-ink/10">
              <div
                ref={barRef}
                className="h-full origin-left rounded-full bg-gradient-to-r from-teal via-teal to-gold-500"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
