"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { ArrowUpRight, Phone } from "lucide-react";
import { getLenis } from "@components/SmoothScroll";
import Logo from "@components/Logo";
import { PHONE_DISPLAY, PHONE_TEL, WHATSAPP_LINK } from "@lib/site";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Projects", href: "/projects" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const isActive = (pathname, href) =>
  // "/services" also covers "/service/[slug]", "/projects" covers "/project/[slug]"
  href === "/" ? pathname === "/" : pathname.startsWith(href.replace(/s$/, ""));

export default function Navbar({ solid = false }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 240 && y > prev + 2);
  });

  useEffect(() => {
    const lenis = getLenis();
    if (isOpen) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  useEffect(() => setIsOpen(false), [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: hidden && !isOpen ? -110 : 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-[60] px-3 pt-3 sm:px-5 sm:pt-4"
      >
        <nav
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl border px-3 py-2.5 transition-all duration-500 sm:px-4 ${
            scrolled || isOpen || solid
              ? "border-white/60 bg-white/75 shadow-soft backdrop-blur-xl"
              : "border-transparent bg-transparent"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="group flex items-center py-1 pl-1" aria-label="IDEAL Developments home">
            <Logo className="text-[24px] transition-opacity duration-300 group-hover:opacity-80 sm:text-[27px]" />
          </Link>

          {/* Desktop links */}
          <ul
            className="hidden items-center gap-1 rounded-full p-1 lg:flex"
            onMouseLeave={() => setHovered(null)}
          >
            {navLinks.map((link) => {
              const active = isActive(pathname, link.href);
              const highlighted = hovered ? hovered === link.href : active;
              return (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    onMouseEnter={() => setHovered(link.href)}
                    className={`relative z-10 block rounded-full px-4 py-2 text-[15px] font-semibold transition-colors duration-300 ${
                      highlighted ? "text-white" : "text-ink/70 hover:text-ink"
                    }`}
                  >
                    {link.name}
                  </Link>
                  {highlighted && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-ink"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={PHONE_TEL}
              className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-ink/70 transition-colors hover:text-ink"
            >
              <Phone size={15} className="text-teal" />
              {PHONE_DISPLAY}
            </a>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shine group relative flex items-center gap-2 overflow-hidden rounded-full bg-gold-500 py-2.5 pl-5 pr-2.5 text-sm font-bold text-ink shadow-[0_8px_24px_-8px_rgba(212,175,55,0.8)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              <span className="relative z-10">Get a Quote</span>
              <span className="relative z-10 grid h-7 w-7 place-items-center rounded-full bg-ink text-white transition-transform duration-500 group-hover:rotate-45">
                <ArrowUpRight size={15} />
              </span>
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="relative grid h-11 w-11 place-items-center rounded-xl bg-ink text-white lg:hidden"
          >
            <span className="relative block h-3.5 w-5">
              <motion.span
                animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="absolute left-0 top-0 h-0.5 w-5 rounded bg-current"
              />
              <motion.span
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                className="absolute left-0 top-1.5 h-0.5 w-3.5 rounded bg-gold-500"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="absolute left-0 top-3 h-0.5 w-5 rounded bg-current"
              />
            </span>
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 44px) 44px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[55] flex flex-col bg-ivory bg-blueprint px-6 pb-8 pt-28 lg:hidden"
          >
            <ul className="flex flex-1 flex-col justify-center gap-1">
              {navLinks.map((link, i) => (
                <li key={link.href} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "110%" }}
                    transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-baseline gap-4 py-2"
                    >
                      <span className="font-display text-xs font-semibold text-teal">
                        0{i + 1}
                      </span>
                      <span
                        className={`font-display text-5xl font-bold tracking-tightest ${
                          isActive(pathname, link.href) ? "text-ink" : "text-ink/40"
                        }`}
                      >
                        {link.name}
                      </span>
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <a
                href={PHONE_TEL}
                className="flex items-center justify-between rounded-2xl border border-ink/10 bg-white px-5 py-4 font-semibold text-ink"
              >
                {PHONE_DISPLAY}
                <Phone size={18} className="text-teal" />
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-2xl bg-ink px-5 py-4 font-bold text-white"
              >
                Get a free quote on WhatsApp
                <ArrowUpRight size={20} className="text-gold-500" />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
