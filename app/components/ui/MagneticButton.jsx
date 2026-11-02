"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const VARIANTS = {
  dark: "bg-ink text-white shadow-[0_18px_40px_-18px_rgba(10,40,78,0.8)]",
  gold: "bg-gold-500 text-ink shadow-[0_18px_40px_-18px_rgba(212,175,55,0.9)]",
  light: "bg-white text-ink shadow-soft ring-1 ring-ink/10",
};

const ICON = {
  dark: "bg-gold-500 text-ink",
  gold: "bg-ink text-white",
  light: "bg-ink text-white",
};

// Pill button that leans toward the cursor.
export default function MagneticButton({ href, children, variant = "dark", external = false, className = "", icon = true }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18 });
  const sy = useSpring(y, { stiffness: 220, damping: 18 });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      {icon && (
        <span
          className={`relative z-10 grid h-9 w-9 place-items-center rounded-full transition-transform duration-500 group-hover:rotate-45 ${ICON[variant]}`}
        >
          <ArrowUpRight size={18} />
        </span>
      )}
    </>
  );

  const classes = `group relative overflow-hidden inline-flex items-center gap-3 rounded-full py-2 pl-6 ${
    icon ? "pr-2" : "pr-6"
  } text-[15px] font-bold tracking-tight transition-colors ${VARIANTS[variant]} ${variant === "gold" ? "btn-shine" : ""} ${className}`;

  return (
    <motion.span
      ref={ref}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className="inline-block"
    >
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {inner}
        </a>
      ) : (
        <Link href={href} className={classes}>
          {inner}
        </Link>
      )}
    </motion.span>
  );
}
