"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import Logo from "@components/Logo";
import services from "@lib/services.json";
import { ADDRESS, EMAIL, HOURS, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_CHAT, WHATSAPP_LINK } from "@lib/site";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Projects", href: "/projects" },
  { name: "Blogs", href: "/blogs" },
  { name: "Contact", href: "/contact" },
];

const socialLinks = [
  { icon: FaWhatsapp, url: WHATSAPP_CHAT, name: "WhatsApp" },
  { icon: FaInstagram, url: "https://instagram.com/idealconstructions", name: "Instagram" },
  { icon: FaFacebookF, url: "https://facebook.com/idealconstructions", name: "Facebook" },
  { icon: FaLinkedinIn, url: "https://linkedin.com/company/idealconstructions", name: "LinkedIn" },
];

function Heading({ children }) {
  return <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-ink/45">{children}</h4>;
}

const linkClass =
  "group inline-flex items-center gap-1 text-[15px] font-semibold text-ink/75 transition-colors hover:text-ink";

export default function Footer() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const wordY = useTransform(scrollYProgress, [0, 1], ["40%", "0%"]);

  return (
    <footer ref={ref} className="relative overflow-hidden bg-[#e6edf1]">
      <div className="mx-auto max-w-7xl px-5 pt-20 sm:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1.1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex" aria-label="IDEAL Developments home">
              <Logo className="text-[30px]" />
            </Link>
            <p className="mt-5 max-w-sm leading-relaxed text-ink/60">
              Building with Ihsan, trust and Islamic values. We create spaces that stand the test of time
              while serving humanity.
            </p>
            <div className="mt-6 flex gap-2">
              {socialLinks.map(({ icon: Icon, url, name }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="grid h-11 w-11 place-items-center rounded-full border border-ink/10 text-ink/70 transition-all duration-300 hover:-translate-y-1 hover:border-ink hover:bg-ink hover:text-gold-400"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <Heading>Explore</Heading>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Heading>Services</Heading>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/service/${s.slug}`} className={linkClass}>
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <Heading>Get in touch</Heading>
            <ul className="space-y-4 text-[15px]">
              <li>
                <a href={PHONE_TEL} className="flex gap-3 font-semibold text-ink/75 hover:text-ink">
                  <Phone size={18} className="mt-0.5 shrink-0 text-teal" />
                  <span>
                    {PHONE_DISPLAY}
                    <span className="block text-sm font-normal text-ink/45">{HOURS}</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className="flex gap-3 break-all font-semibold text-ink/75 hover:text-ink">
                  <Mail size={18} className="mt-0.5 shrink-0 text-teal" />
                  {EMAIL}
                </a>
              </li>
              <li className="flex gap-3 text-ink/75">
                <MapPin size={18} className="mt-0.5 shrink-0 text-teal" />
                {ADDRESS}
              </li>
            </ul>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-7 flex items-center justify-between rounded-2xl bg-ink py-3 pl-5 pr-3 font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              Chat on WhatsApp
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-500 text-ink transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight size={18} />
              </span>
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-ink/10 py-6 text-sm text-ink/50 sm:flex-row">
          <p>© {new Date().getFullYear()} IDEAL Developments. All rights reserved.</p>
          <p className="font-quote italic">Built with Ihsan, in Islamabad.</p>
        </div>
      </div>

      {/* Oversized wordmark */}
      <div className="pointer-events-none select-none overflow-hidden" aria-hidden>
        <motion.p
          style={{ y: wordY }}
          className="-mb-[0.2em] text-center font-brand text-[25vw] font-extrabold leading-none tracking-[0.06em] text-transparent"
        >
          <span className="bg-gradient-to-b from-ink/[0.12] to-ink/[0.02] bg-clip-text">IDEAL</span>
        </motion.p>
      </div>
    </footer>
  );
}
