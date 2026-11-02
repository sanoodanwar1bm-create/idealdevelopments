"use client";

import services from "@lib/services.json";

const ITEMS = [...services.map((s) => s.title), "Built with Ihsan"];

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center">
          <span className="whitespace-nowrap px-6 font-display text-2xl font-semibold tracking-tight text-white sm:px-10 sm:text-4xl">
            {item}
          </span>
          <svg viewBox="0 0 40 30" className="h-4 w-5 shrink-0 sm:h-6 sm:w-8" aria-hidden>
            <path d="M10 0 H40 L30 30 H0 Z" fill="#d4af37" />
          </svg>
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <section aria-label="Our services" className="relative overflow-hidden bg-ink py-6 sm:py-8">
      <div className="flex w-max animate-marquee mask-fade-x hover:[animation-play-state:paused]" style={{ "--marquee-duration": "45s" }}>
        <Row />
        <Row />
      </div>
    </section>
  );
}
