"use client";

import { FlaskConical, Wallet, CalendarCheck, ShieldCheck } from "lucide-react";
import { FadeUp } from "./Reveal";

export const TRUST = [
  { icon: FlaskConical, title: "Lab-tested materials", body: "Reports on steel, bricks and cement, shared with you." },
  { icon: Wallet, title: "Transparent budgets", body: "Clear cost breakdowns, no inflated or hidden charges." },
  { icon: CalendarCheck, title: "Milestone updates", body: "Real scheduling and an update at every stage." },
  { icon: ShieldCheck, title: "Shariah-guided dealings", body: "Every agreement handled as an Amanah." },
];

export default function TrustGrid({ className = "" }) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {TRUST.map(({ icon: Icon, title, body }, i) => (
        <FadeUp key={title} delay={i * 0.08} className="rounded-3xl bg-white/85 p-6 shadow-soft backdrop-blur">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink text-gold-400">
            <Icon size={20} />
          </span>
          <h3 className="mt-4 font-display text-lg font-bold text-ink">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink/60">{body}</p>
        </FadeUp>
      ))}
    </div>
  );
}
