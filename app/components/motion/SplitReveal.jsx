"use client";

import { useEffect, useRef } from "react";
import { EASE_OUT, SplitText, fontsReady, gsap, reducedMotion } from "./gsap";

/*
 * Headline reveal: real text, split into its rendered lines, each rising out
 * from behind its own mask.
 *
 * SplitText measures the actual line wrapping, so this works on a two-word
 * heading and on a heading that wraps to four lines on a phone — no manual
 * <br> or per-word guesswork. `mask: "lines"` has GSAP wrap each line in an
 * overflow-hidden div, which is what makes the type appear to climb out of the
 * page rather than just fade.
 *
 * Pass `show` to gate the reveal on something else (the preloader finishing);
 * leave it out and the heading plays when it scrolls into view.
 */
export default function SplitReveal({
  as: Tag = "h2",
  children,
  className = "",
  delay = 0,
  stagger = 0.085,
  duration = 1.05,
  start = "top 88%",
  show,
  ...rest
}) {
  const ref = useRef(null);
  const played = useRef(false);
  const controlled = show !== undefined;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reducedMotion()) {
      gsap.set(el, { opacity: 1 });
      return;
    }
    // Controlled headings stay hidden until their cue arrives.
    if (controlled && !show) {
      gsap.set(el, { opacity: 0 });
      return;
    }

    let split;
    let cancelled = false;

    const build = () => {
      if (cancelled || !ref.current) return;
      gsap.set(el, { opacity: 1 });

      split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        linesClass: "split-line",
        // Re-run on resize and on a late font swap. Once the reveal has played
        // the new lines just snap to their resting state instead of replaying.
        onSplit(self) {
          if (played.current) {
            gsap.set(self.lines, { yPercent: 0, opacity: 1 });
            return undefined;
          }
          return gsap.from(self.lines, {
            yPercent: 108,
            opacity: 0,
            duration,
            delay,
            stagger,
            ease: EASE_OUT,
            onComplete: () => (played.current = true),
            ...(controlled
              ? {}
              : { scrollTrigger: { trigger: el, start, once: true } }),
          });
        },
      });
    };

    fontsReady().then(build);

    return () => {
      cancelled = true;
      split?.revert();
    };
  }, [controlled, show, delay, stagger, duration, start]);

  return (
    <Tag ref={ref} className={className} style={{ opacity: 0 }} {...rest}>
      {children}
    </Tag>
  );
}
