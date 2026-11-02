"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowUpRight,
  Ruler,
  Wallet,
  CalendarClock,
  PencilRuler,
  Hammer,
  MessageSquare,
  Footprints,
  FileText,
} from "lucide-react";
import { FaWhatsapp, FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import SectionHeading from "@components/ui/SectionHeading";
import CopyButton from "@components/ui/CopyButton";
import Khatam from "@components/ui/Khatam";
import { FadeUp, WordReveal } from "@components/ui/Reveal";
import {
  ADDRESS,
  EMAIL,
  HOURS_ROWS,
  MAPS_LINK,
  MAP_EMBED,
  PHONE_DISPLAY,
  PHONE_TEL,
  WHATSAPP_LINK,
} from "@lib/site";

const ConstructionScene = dynamic(() => import("@components/three/ConstructionScene"), { ssr: false });

const EASE = [0.16, 1, 0.3, 1];

const CHANNELS = [
  {
    key: "whatsapp",
    icon: FaWhatsapp,
    label: "WhatsApp",
    value: "+92 320 9840974",
    note: "Fastest way to reach us. Send your plot details and photos.",
    href: WHATSAPP_LINK,
    action: "Start a chat",
    primary: true,
  },
  {
    key: "phone",
    icon: Phone,
    label: "Phone",
    value: PHONE_DISPLAY,
    note: "Speak to our team during business hours.",
    href: PHONE_TEL,
    action: "Call now",
    copy: "+923209840974",
  },
  {
    key: "email",
    icon: Mail,
    label: "Email",
    value: EMAIL,
    note: "Best for drawings, documents and detailed briefs.",
    href: `mailto:${EMAIL}`,
    action: "Send an email",
    copy: EMAIL,
    small: true,
  },
];

const BRIEF = [
  { icon: MapPin, text: "Your plot location and society" },
  { icon: Ruler, text: "Plot size (5 Marla, 10 Marla, 1 Kanal…)" },
  { icon: Hammer, text: "What you need: design, construction, renovation or investment" },
  { icon: Wallet, text: "A budget range you are comfortable with" },
  { icon: CalendarClock, text: "When you would like to start" },
  { icon: PencilRuler, text: "Any drawings or reference designs you already have" },
];

const STEPS = [
  { icon: MessageSquare, title: "You reach out", body: "Message us on WhatsApp, call, or email your brief." },
  { icon: Footprints, title: "We visit your plot", body: "We assess the site and discuss your needs, layout and budget." },
  { icon: FileText, title: "You get a plan", body: "Architectural plans, a transparent estimate and a timeline to hold us to." },
];

const SOCIALS = [
  { icon: FaWhatsapp, url: "https://wa.me/923209840974", name: "WhatsApp" },
  { icon: FaInstagram, url: "https://instagram.com/idealconstructions", name: "Instagram" },
  { icon: FaFacebookF, url: "https://facebook.com/idealconstructions", name: "Facebook" },
  { icon: FaLinkedinIn, url: "https://linkedin.com/company/idealconstructions", name: "LinkedIn" },
];

function Hero() {
  // The finished house, already complete: nothing to scroll for here.
  const progress = useRef(1);

  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(165deg,#cfdfe9_0%,#e3e7e0_50%,#efe4d2_100%)] pb-16 pt-24 lg:pb-24 lg:pt-32">
      <div className="absolute inset-0 -z-10 bg-blueprint opacity-60 mask-fade-edges" />
      <Khatam className="absolute -right-24 top-10 -z-10 h-80 w-80 text-teal/10 animate-spin-slow" />

      <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mb-6 flex items-center gap-3"
          >
            <span className="font-display text-sm font-semibold text-teal">IDEAL</span>
            <span className="h-px w-10 bg-ink/25" />
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-ink/60">Contact us</span>
          </motion.div>

          <h1 className="font-display text-[clamp(2.6rem,5.4vw,5rem)] font-bold leading-[0.98] tracking-tightest text-ink">
            <WordReveal text="Tell us about" show delay={0.1} />
            <br />
            <WordReveal text="your plot." show delay={0.3} className="font-quote font-normal italic text-teal" />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-ink/65 sm:text-xl"
          >
            No forms to fill in. Message us on WhatsApp, give us a call or send an email, and you will be
            talking to our team directly.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-4 py-2 text-sm font-semibold text-ink/70 shadow-soft backdrop-blur"
          >
            <Clock size={15} className="text-teal" />
            Mon–Fri 9AM–6PM · Sat 10AM–4PM
          </motion.p>
        </div>

        <div className="relative -mx-5 order-first h-[30svh] sm:mx-0 lg:order-none lg:h-[26rem]">
          <ConstructionScene progress={progress} immediate baseRotation={-0.4} distance={21} className="absolute inset-0" />
        </div>
      </div>

      {/* Channels */}
      <div className="mx-auto mt-10 max-w-7xl px-5 sm:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {CHANNELS.map(({ key, icon: Icon, label, value, note, href, action, primary, copy, small }, i) => (
            <FadeUp key={key} delay={i * 0.1}>
              <a
                href={href}
                {...(key === "whatsapp" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-[1.75rem] p-7 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift ${
                  primary ? "bg-ink text-white" : "border border-ink/10 bg-white/85 text-ink backdrop-blur"
                }`}
              >
                {primary && (
                  <span className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold-500/20 blur-2xl" />
                )}
                <div className="relative">
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-2xl ${
                      primary ? "bg-gold-500 text-ink" : "bg-ink text-gold-400"
                    }`}
                  >
                    <Icon size={22} />
                  </span>
                  <p
                    className={`mt-5 text-xs font-bold uppercase tracking-[0.2em] ${
                      primary ? "text-white/60" : "text-ink/45"
                    }`}
                  >
                    {label}
                  </p>
                  <p
                    className={`mt-1 font-display font-bold tracking-tight ${
                      small ? "break-all text-base sm:text-lg" : "break-words text-xl sm:text-2xl"
                    }`}
                  >
                    {value}
                  </p>
                  <p className={`mt-3 text-sm leading-relaxed ${primary ? "text-white/70" : "text-ink/60"}`}>
                    {note}
                  </p>
                </div>

                <div className="relative mt-7 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-sm font-bold">
                    {action}
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-full transition-transform duration-500 group-hover:rotate-45 ${
                        primary ? "bg-gold-500 text-ink" : "bg-ink text-gold-400"
                      }`}
                    >
                      <ArrowUpRight size={16} />
                    </span>
                  </span>
                  {copy && (
                    <CopyButton
                      value={copy}
                      className={primary ? "bg-white/10 text-white" : "bg-ink/5 text-ink/60 hover:bg-ink/10"}
                    />
                  )}
                </div>
              </a>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function Office() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#e2eaf0,#d5e1ea)] py-24 sm:py-32">
      <div className="absolute inset-0 bg-blueprint opacity-50 mask-fade-edges" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading index="01" eyebrow="Our office" title="Come and see us" accent="in B-17." />

        <div className="mt-14 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <FadeUp className="overflow-hidden rounded-[2rem] bg-white p-2 shadow-lift">
            <iframe
              src={MAP_EMBED}
              title="IDEAL Developments office location, 77 Square, B-17 Islamabad"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="h-[22rem] w-full rounded-[1.6rem] border-0 sm:h-[26rem]"
            />
          </FadeUp>

          <div className="grid gap-5">
            <FadeUp delay={0.1} className="rounded-[2rem] bg-white p-7 shadow-soft">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink text-gold-400">
                <MapPin size={19} />
              </span>
              <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-ink">Office address</h3>
              <p className="mt-2 leading-relaxed text-ink/65">{ADDRESS}</p>
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-5 inline-flex items-center gap-2 text-sm font-bold text-ink"
              >
                Get directions
                <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-gold-400 transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight size={16} />
                </span>
              </a>
            </FadeUp>

            <FadeUp delay={0.2} className="rounded-[2rem] bg-ink p-7 text-white shadow-lift">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-500 text-ink">
                <Clock size={19} />
              </span>
              <h3 className="mt-4 font-display text-xl font-bold tracking-tight">Business hours</h3>
              <dl className="mt-4 space-y-2.5 text-[15px]">
                {HOURS_ROWS.map(({ day, time }) => (
                  <div key={day} className="flex items-center justify-between gap-4 border-b border-white/10 pb-2.5 last:border-0">
                    <dt className="text-white/70">{day}</dt>
                    <dd className="font-semibold">{time}</dd>
                  </div>
                ))}
              </dl>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}

function Brief() {
  return (
    <section className="bg-ivory py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              index="02"
              eyebrow="Before you message"
              title="Six things that get you"
              accent="a faster estimate."
              description="Not required, but the more you share up front, the sooner we can come back with real numbers."
            />
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {BRIEF.map(({ icon: Icon, text }, i) => (
              <FadeUp
                as="li"
                key={text}
                delay={i * 0.06}
                className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-white/70 p-4 shadow-soft"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-mint text-teal">
                  <Icon size={18} />
                </span>
                <span className="text-[15px] font-semibold text-ink">{text}</span>
              </FadeUp>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Next() {
  return (
    <section className="relative overflow-x-clip bg-[linear-gradient(180deg,#dcebe5,#cbe0d8)] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index="03"
          eyebrow="What happens next"
          title="Three steps,"
          accent="no obligation."
          align="center"
        />
        <ol className="mt-14 grid gap-5 lg:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <FadeUp
              as="li"
              key={title}
              delay={i * 0.1}
              className="relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-soft"
            >
              <span className="absolute right-6 top-4 font-display text-6xl font-extrabold text-ink/[0.06]">
                0{i + 1}
              </span>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-gold-400">
                <Icon size={21} />
              </span>
              <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-ink">{title}</h3>
              <p className="mt-2 leading-relaxed text-ink/60">{body}</p>
            </FadeUp>
          ))}
        </ol>

        {/* Socials */}
        <FadeUp delay={0.2} className="mt-16 flex flex-col items-center gap-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-ink/50">Or find us here</p>
          <div className="flex gap-3">
            {SOCIALS.map(({ icon: Icon, url, name }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="grid h-12 w-12 place-items-center rounded-full border border-ink/10 bg-white text-ink/70 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:bg-ink hover:text-gold-400"
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

export default function ContactContent() {
  return (
    <>
      <Hero />
      <Office />
      <Brief />
      <Next />
    </>
  );
}
