"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BadgeCheck,
  Camera,
  Download,
  Languages,
  LockKeyhole,
  Paperclip,
  ReceiptText,
  Wallet,
} from "lucide-react";
import { FadeUp } from "@components/ui/Reveal";
import { PORTAL_URL, REGISTRATIONS, WHATSAPP_CHAT } from "@lib/site";

const DEMO_LINK = `${WHATSAPP_CHAT}?text=${encodeURIComponent("Assalam o Alaikum, could you show me a demo of the client portal?")}`;

/*
 * The client portal: every client gets their own login and sees their project's
 * site photos, every expense with its bill, what they have paid and what is
 * left. The dashboard on the right is an illustration, labelled as a sample.
 */

const FEATURES = [
  { icon: Camera, title: "Site photos & updates", body: "Dated photos from the site, posted as the work happens." },
  { icon: ReceiptText, title: "Every expense, with its bill", body: "Each rupee spent, under its head, with the receipt attached." },
  { icon: Wallet, title: "Paid and remaining", body: "What you have paid and what is left, against the agreed amount." },
  { icon: Download, title: "Statements on demand", body: "Download a PDF or Excel statement of your project any time." },
  { icon: Languages, title: "English and اردو", body: "Switch the whole portal to Urdu in one tap." },
  { icon: LockKeyhole, title: "Private to you", body: "Only you see your project. Bills and photos open through expiring links." },
];

const EXPENSES = [
  { head: "Steel, Grade 60", amount: "4,85,000" },
  { head: "Cement, 600 bags", amount: "8,70,000" },
  { head: "Labour, slab pour", amount: "1,60,000" },
];

function Dashboard() {
  return (
    <div className="relative">
      {/* Browser frame */}
      <div className="overflow-hidden rounded-[1.5rem] bg-[#f7f5f0] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
        <div className="flex items-center gap-2 border-b border-ink/[0.07] bg-white px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f28b82]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#fbcf6b]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#7fd3a3]" />
          <span className="ml-3 flex min-w-0 flex-1 items-center gap-1.5 truncate rounded-full bg-ink/[0.05] px-3 py-1 text-[11px] font-semibold text-ink/50">
            <LockKeyhole size={11} className="shrink-0 text-teal" />
            portal.idealinfrastructure.pk
          </span>
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          {/* Project header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal">Your project</p>
              <p className="truncate font-display text-lg font-bold text-ink">10 Marla home · B-17</p>
            </div>
            <span className="shrink-0 rounded-full bg-teal/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-teal">
              Grey structure
            </span>
          </div>

          {/* Money */}
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Agreement", "1.50 cr"],
              ["Paid", "95 lakh"],
              ["Remaining", "55 lakh"],
            ].map(([k, v], i) => (
              <div key={k} className={`rounded-xl p-3 ${i === 2 ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-ink/[0.06]"}`}>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${i === 2 ? "text-gold-400" : "text-ink/45"}`}>{k}</p>
                <p className="mt-1 font-display text-[15px] font-bold tabular-nums">PKR {v}</p>
              </div>
            ))}
          </div>
          <div>
            <div className="flex justify-between text-[11px] font-semibold text-ink/55">
              <span>Paid so far</span>
              <span className="tabular-nums">63%</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink/10">
              <motion.div
                data-reveal="fill"
                style={{ "--fill": "63%" }}
                initial={{ width: 0 }}
                whileInView={{ width: "63%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-teal to-gold-500"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1.25fr_1fr]">
            {/* Expenses */}
            <div className="rounded-xl bg-white p-3 ring-1 ring-ink/[0.06]">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink/45">Latest expenses</p>
              <ul className="mt-2 divide-y divide-ink/[0.06]">
                {EXPENSES.map((e) => (
                  <li key={e.head} className="flex items-center justify-between gap-2 py-2 text-[12px]">
                    <span className="flex min-w-0 items-center gap-1.5 font-semibold text-ink">
                      <Paperclip size={12} className="shrink-0 text-teal" />
                      <span className="truncate">{e.head}</span>
                    </span>
                    <span className="shrink-0 font-bold tabular-nums text-ink/70">{e.amount}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Site photo */}
            <div className="relative min-h-[8rem] overflow-hidden rounded-xl">
              <Image src="/projects/10marla.jpg" alt="" fill sizes="240px" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
              <p className="absolute bottom-2 left-2.5 flex items-center gap-1.5 text-[11px] font-bold text-white">
                <Camera size={12} className="text-gold-400" />
                Site update · today
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating statement chip */}
      <FadeUp
        delay={0.5}
        y={16}
        className="absolute -bottom-5 left-4 flex items-center gap-2 rounded-full bg-gold-500 px-4 py-2.5 text-xs font-bold text-ink shadow-lift sm:left-auto sm:right-6"
      >
        <Download size={14} />
        Statement.pdf ready
      </FadeUp>
      <p className="mt-9 text-center text-[11px] text-white/40 sm:mt-8">Sample project, for illustration.</p>
    </div>
  );
}

export default function ClientPortal() {
  return (
    <section
      id="client-portal"
      aria-label="Client portal"
      className="relative overflow-hidden bg-[linear-gradient(160deg,#0a284e_0%,#0d3358_55%,#11463f_100%)] py-24 text-white sm:py-28 lg:py-32"
    >
      <div className="absolute inset-0 bg-blueprint-light opacity-40 mask-fade-edges" />
      <div className="absolute -right-40 top-10 h-[30rem] w-[30rem] rounded-full glow scale-[2] opacity-20 [--glow:21_122_110]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
        <div>
          <FadeUp>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] py-1.5 pl-1.5 pr-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white/75 ring-1 ring-white/10">
              <span className="rounded-full bg-gold-500 px-2.5 py-1 text-[10px] tracking-[0.18em] text-ink">Client portal</span>
              Rare in Pakistan
            </span>
            <h2 className="mt-6 font-display text-[clamp(2rem,4vw,3.4rem)] font-bold leading-[1.03] tracking-tightest">
              Your home, your money,{" "}
              <span className="font-quote font-normal italic text-gold-400">open to you at any hour.</span>
            </h2>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-white/65">
              Most builders keep the books closed. We hand you the key. Every client gets their own login to the IDEAL
              Infrastructure portal, where the project lives exactly as we run it: the photos, the bills, the
              payments and what is left to pay.
            </p>
          </FadeUp>

          <ul className="mt-10 grid gap-x-6 gap-y-6 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, title, body }, i) => (
              <FadeUp as="li" key={title} delay={i * 0.06} y={16} className="flex gap-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.08] text-gold-400 ring-1 ring-white/10">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="font-display text-[15px] font-bold">{title}</p>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-white/55">{body}</p>
                </div>
              </FadeUp>
            ))}
          </ul>

          <FadeUp delay={0.2} className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-full bg-gold-500 py-3 pl-6 pr-3 text-sm font-bold text-ink transition-transform duration-300 hover:-translate-y-0.5"
            >
              Client login
              <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-white transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight size={16} />
              </span>
            </a>
            <a
              href={DEMO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full px-5 py-3 text-sm font-bold text-white/80 ring-1 ring-white/20 transition-colors hover:bg-white/10 hover:text-white"
            >
              Ask for a demo
            </a>
          </FadeUp>

          <FadeUp delay={0.25} className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] font-semibold text-white/55">
            {REGISTRATIONS.map((r) => (
              <span key={r.short} className="flex items-center gap-1.5">
                <BadgeCheck size={15} className="text-gold-400" />
                {r.short} registered
              </span>
            ))}
          </FadeUp>
        </div>

        <FadeUp delay={0.1} y={30}>
          <Dashboard />
        </FadeUp>
      </div>
    </section>
  );
}
