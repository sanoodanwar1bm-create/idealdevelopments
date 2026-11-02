"use client";

import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { Check, Scale, PencilRuler, Clock, MessagesSquare, FlaskConical } from "lucide-react";
import SectionHeading from "@components/ui/SectionHeading";
import { FadeUp } from "@components/ui/Reveal";

function TiltCard({ children, className = "", delay = 0 }) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const srx = useSpring(rx, { stiffness: 200, damping: 20 });
  const sry = useSpring(ry, { stiffness: 200, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mx}% ${my}%, rgba(212,175,55,0.16), transparent 60%)`;

  const onMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 8);
    rx.set((0.5 - py) * 8);
    mx.set(px * 100);
    my.set(py * 100);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <FadeUp delay={delay} className={`[perspective:1200px] ${className}`}>
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
        className="group relative h-full overflow-hidden rounded-3xl border border-ink/[0.07] bg-white p-7 shadow-soft transition-shadow duration-500 hover:shadow-lift sm:p-8"
      >
        <motion.div
          style={{ background: spotlight }}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        <div className="relative h-full" style={{ transform: "translateZ(30px)" }}>
          {children}
        </div>
      </motion.div>
    </FadeUp>
  );
}

function CardTitle({ icon: Icon, title, body }) {
  return (
    <>
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-gold-400">
        <Icon size={22} />
      </span>
      <h3 className="mt-6 font-display text-2xl font-bold tracking-tight text-ink">{title}</h3>
      <p className="mt-3 leading-relaxed text-ink/60">{body}</p>
    </>
  );
}

const REPORT = ["Steel reinforcement", "Cement", "Bricks", "Concrete cubes"];

function LabReport() {
  return (
    <div className="rounded-2xl border border-ink/10 bg-[#eef3f6] p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-ink/50">Material lab report</span>
        <span className="rounded-full bg-teal/10 px-2.5 py-1 text-[11px] font-bold text-teal">Shared with you</span>
      </div>
      <ul className="space-y-2.5">
        {REPORT.map((item, i) => (
          <li key={item} className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-soft">
            <span className="text-sm font-semibold text-ink">{item}</span>
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.2, type: "spring", stiffness: 400, damping: 18 }}
              className="flex items-center gap-1.5 text-xs font-bold text-teal"
            >
              Tested
              <span className="grid h-5 w-5 place-items-center rounded-full bg-teal text-white">
                <Check size={12} strokeWidth={3} />
              </span>
            </motion.span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BlueprintSketch() {
  return (
    <svg viewBox="0 0 240 110" className="mt-6 w-full text-teal" fill="none" aria-hidden>
      <motion.path
        d="M10 100 V40 L70 12 L130 40 V100 Z M130 60 H230 V100 H130 M30 100 V70 H55 V100 M150 72 H180 V88 H150 Z M195 72 H215 V88 H195 Z M85 55 H110 V75 H85 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2.2, ease: "easeInOut" }}
      />
      <path d="M10 106 H230" stroke="#d4af37" strokeDasharray="4 4" />
    </svg>
  );
}

const MILESTONES = ["Design", "Structure", "Finishes", "Handover"];

function Timeline() {
  return (
    <div className="mt-8">
      <div className="relative h-1 rounded-full bg-ink/10">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-teal to-gold-500"
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
        />
      </div>
      <div className="mt-3 flex justify-between text-[11px] font-bold uppercase tracking-wider text-ink/45">
        {MILESTONES.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
}

function Chat() {
  const msgs = [
    { me: false, t: "Slab on 2nd floor poured today ✅" },
    { me: true, t: "JazakAllah, photos please?" },
    { me: false, t: "Sent, plus this week's cost sheet." },
  ];
  return (
    <div className="mt-6 space-y-2">
      {msgs.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 + i * 0.5 }}
          className={`w-fit max-w-[85%] rounded-2xl px-3.5 py-2 text-[13px] ${
            m.me ? "ml-auto rounded-br-md bg-ink text-white" : "rounded-bl-md bg-[#e8eef2] text-ink"
          }`}
        >
          {m.t}
        </motion.div>
      ))}
    </div>
  );
}

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#dfe8ef,#d2dfe8)] py-24 sm:py-32">
      <div className="absolute inset-0 bg-blueprint opacity-50 mask-fade-edges" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index="03"
          eyebrow="Why families trust us"
          title="Built on Ihsan and"
          accent="Amanah."
          description="Excellence in the work, trust in every dealing. Here is what that looks like on your project, not just in our words."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          <TiltCard className="lg:col-span-2">
            <div className="grid h-full gap-8 md:grid-cols-2 md:items-center">
              <div>
                <CardTitle
                  icon={FlaskConical}
                  title="Certified materials"
                  body="You receive lab reports on the steel, bricks and cement going into your home: transparency backed by proof, not promises."
                />
              </div>
              <LabReport />
            </div>
          </TiltCard>

          <TiltCard delay={0.1}>
            <CardTitle
              icon={Scale}
              title="Fair & honest pricing"
              body="No shortcuts, no inflated costs. You pay for what you get, and what you get is quality, care and craftsmanship."
            />
            <p className="mt-8 font-display text-3xl font-bold leading-tight tracking-tightest text-ink">
              No surprises.
              <br />
              <span className="font-quote font-normal italic text-teal">Just an honest quote.</span>
            </p>
          </TiltCard>

          <TiltCard delay={0.05}>
            <CardTitle
              icon={PencilRuler}
              title="Clarity in planning"
              body="Proper architectural design and strategic planning from day one, with no guesswork."
            />
            <BlueprintSketch />
          </TiltCard>

          <TiltCard delay={0.15}>
            <CardTitle
              icon={Clock}
              title="On-time execution"
              body="Time is a trust. Real tools and real scheduling keep your project moving."
            />
            <Timeline />
          </TiltCard>

          <TiltCard delay={0.25}>
            <CardTitle
              icon={MessagesSquare}
              title="Open communication"
              body="Updates at every milestone, from start to finish."
            />
            <Chat />
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
