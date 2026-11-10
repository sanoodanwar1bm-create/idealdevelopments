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
import {
  ArrowUpRight,
  ChevronDown,
  ClipboardCheck,
  Compass,
  Eye,
  Hammer,
  Handshake,
  HardHat,
  Phone,
  PencilRuler,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import { getLenis, scrollToHash } from "@components/SmoothScroll";
import Logo from "@components/Logo";
import services from "@lib/services.json";
import projects from "@lib/projects.json";
import { PHONE_DISPLAY, PHONE_TEL, WHATSAPP_LINK } from "@lib/site";

const SERVICE_ICONS = {
  "project-management": ClipboardCheck,
  "residential-construction": HardHat,
  "architectural-design": PencilRuler,
  "renovation-remodeling": Hammer,
  "investor-partnership": Handshake,
};

const navLinks = [
  { name: "Home", href: "/" },
  {
    name: "Services",
    href: "/services",
    menu: {
      groups: [
        {
          items: services.map((s) => ({
            name: s.title,
            href: `/service/${s.slug}`,
            icon: SERVICE_ICONS[s.slug] ?? Wrench,
          })),
        },
      ],
      footer: [{ name: "All services", href: "/services" }],
    },
  },
  {
    name: "Projects",
    href: "/projects",
    menu: {
      wide: true,
      groups: [...new Set(projects.map((p) => p.size))].map((size) => ({
        label: size,
        items: projects
          .filter((p) => p.size === size)
          .map((p) => ({ name: p.title, href: `/project/${p.slug}` })),
      })),
      footer: [
        { name: "Home tours", href: "/#tours" },
        { name: "All projects", href: "/projects" },
      ],
    },
  },
  {
    name: "About",
    href: "/about",
    menu: {
      groups: [
        {
          items: [
            { name: "Who we are", href: "/about#who-we-are", icon: Compass },
            { name: "What we do", href: "/about#what-we-do", icon: HardHat },
            { name: "Vision & mission", href: "/about#vision-mission", icon: Eye },
            { name: "Our values", href: "/about#values", icon: Sparkles },
            { name: "How we work", href: "/about#how-we-work", icon: ShieldCheck },
            { name: "Our team", href: "/about#team", icon: Users },
          ],
        },
      ],
    },
  },
  { name: "Contact", href: "/contact" },
];

const isActive = (pathname, href) =>
  // "/services" also covers "/service/[slug]", "/projects" covers "/project/[slug]"
  href === "/" ? pathname === "/" : pathname.startsWith(href.replace(/s$/, ""));

// A link inside a menu. Section links on the current page have no route change
// to hook into, so they scroll here instead.
function MenuLink({ item, onNavigate, className, children }) {
  const pathname = usePathname();
  return (
    <Link
      href={item.href}
      className={className}
      onClick={(e) => {
        onNavigate();
        const [path, hash] = item.href.split("#");
        if (hash && path === pathname) {
          e.preventDefault();
          window.history.pushState(null, "", item.href);
          requestAnimationFrame(() => scrollToHash(`#${hash}`));
        }
      }}
    >
      {children}
    </Link>
  );
}

function DesktopMenu({ menu, onNavigate }) {
  return (
    // The top padding bridges the gap to the link, so the pointer never leaves the item.
    <div className="absolute left-1/2 top-full z-20 -translate-x-1/2 pt-3">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className={`rounded-2xl bg-white p-2 shadow-lift ring-1 ring-ink/5 ${menu.wide ? "w-[40rem]" : "w-[19rem]"}`}
      >
        <div className={menu.wide ? "grid grid-cols-3 gap-1" : ""}>
          {menu.groups.map((group, i) => (
            <div key={group.label ?? i}>
              {group.label && (
                <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-teal">
                  {group.label}
                </p>
              )}
              <ul>
                {group.items.map((item) => (
                  <li key={item.href}>
                    <MenuLink
                      item={item}
                      onNavigate={onNavigate}
                      className="group/item flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink/75 transition-colors hover:bg-mint hover:text-ink"
                    >
                      {item.icon && (
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-mint text-teal transition-colors group-hover/item:bg-ink group-hover/item:text-gold-400">
                          <item.icon size={16} />
                        </span>
                      )}
                      {item.name}
                    </MenuLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {menu.footer && (
          <div className="mt-2 flex items-center justify-between gap-2 border-t border-ink/10 px-1 pt-2">
            {menu.footer.map((item) => (
              <MenuLink
                key={item.href}
                item={item}
                onNavigate={onNavigate}
                className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-bold text-teal transition-colors hover:text-ink"
              >
                {item.name}
                <ArrowUpRight size={15} />
              </MenuLink>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function MobileSubmenu({ menu, onNavigate }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden"
    >
      <div className="mb-3 ml-8 border-l border-ink/15 pl-4">
        {menu.groups.map((group, i) => (
          <div key={group.label ?? i}>
            {group.label && (
              <p className="pb-1 pt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-teal">{group.label}</p>
            )}
            <ul>
              {group.items.map((item) => (
                <li key={item.href}>
                  <MenuLink
                    item={item}
                    onNavigate={onNavigate}
                    className="block py-2 text-base font-semibold text-ink/80"
                  >
                    {item.name}
                  </MenuLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {menu.footer?.map((item) => (
          <MenuLink
            key={item.href}
            item={item}
            onNavigate={onNavigate}
            className="flex items-center gap-1 py-2 text-base font-bold text-teal"
          >
            {item.name}
            <ArrowUpRight size={16} />
          </MenuLink>
        ))}
      </div>
    </motion.div>
  );
}

export default function Navbar({ solid = false }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    const hide = y > 240 && y > prev + 2;
    setScrolled(y > 24);
    setHidden(hide);
    // The bar only slides up by its own height, which would strand an open dropdown.
    if (hide) setHovered(null);
  });

  useEffect(() => {
    const lenis = getLenis();
    if (isOpen) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
      setExpanded(null);
    }
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
    setHovered(null);
  }, [pathname]);

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
              ? "nav-glass border-white/60 bg-white/75 shadow-soft backdrop-blur-xl"
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
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setHovered(null);
            }}
            onKeyDown={(e) => {
              if (e.key !== "Escape") return;
              e.target.closest("li.nav-item")?.querySelector("button")?.focus();
              setHovered(null);
            }}
          >
            {navLinks.map((link) => {
              const active = isActive(pathname, link.href);
              const highlighted = hovered ? hovered === link.href : active;
              const open = Boolean(link.menu) && hovered === link.href;
              return (
                <li key={link.href} className="nav-item relative" onMouseEnter={() => setHovered(link.href)}>
                  <Link
                    href={link.href}
                    className={`relative z-10 block rounded-full py-2 pl-4 text-[15px] font-semibold transition-colors duration-300 ${
                      link.menu ? "pr-8" : "pr-4"
                    } ${highlighted ? "text-white" : "text-ink/70 hover:text-ink"}`}
                  >
                    {link.name}
                  </Link>
                  {link.menu && (
                    // Hover can't reach this menu from a keyboard or a touch screen, so the arrow toggles it.
                    <button
                      type="button"
                      aria-label={`${open ? "Hide" : "Show"} ${link.name} menu`}
                      aria-expanded={open}
                      onClick={() => setHovered(open ? null : link.href)}
                      className={`absolute right-2 top-1/2 z-10 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full transition-colors duration-300 ${
                        highlighted ? "text-white" : "text-ink/50 hover:text-ink"
                      }`}
                    >
                      <ChevronDown size={15} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                    </button>
                  )}
                  {highlighted && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-ink"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <AnimatePresence>
                    {open && <DesktopMenu menu={link.menu} onNavigate={() => setHovered(null)} />}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={PHONE_TEL}
              className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-ink/70 transition-colors hover:text-ink xl:flex"
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
            // A transform, not a clip-path circle: Safari repaints the whole
            // viewport every frame for a full-screen clip-path.
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[55] flex flex-col bg-ivory bg-blueprint px-6 pb-6 pt-24 lg:hidden"
          >
            {/* Scrolls on its own: an open Projects list can be taller than the screen. */}
            <div data-lenis-prevent className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
              <ul className="my-auto flex flex-col gap-1 py-2">
                {navLinks.map((link, i) => (
                  <li key={link.href}>
                    <div className="overflow-hidden">
                      <motion.div
                        initial={{ y: "110%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "110%" }}
                        transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center justify-between gap-3"
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className="flex min-w-0 items-baseline gap-4 py-1.5"
                        >
                          <span className="font-display text-xs font-semibold text-teal">
                            0{i + 1}
                          </span>
                          <span
                            className={`font-display text-[clamp(2rem,10.5vw,3rem)] font-bold leading-[1.1] tracking-tightest ${
                              isActive(pathname, link.href) ? "text-ink" : "text-ink/40"
                            }`}
                          >
                            {link.name}
                          </span>
                        </Link>
                        {link.menu && (
                          <button
                            type="button"
                            aria-label={`${expanded === link.href ? "Hide" : "Show"} ${link.name} links`}
                            aria-expanded={expanded === link.href}
                            onClick={() => setExpanded((v) => (v === link.href ? null : link.href))}
                            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-ink/10 bg-white text-ink"
                          >
                            <ChevronDown
                              size={20}
                              className={`transition-transform duration-300 ${expanded === link.href ? "rotate-180" : ""}`}
                            />
                          </button>
                        )}
                      </motion.div>
                    </div>
                    <AnimatePresence initial={false}>
                      {link.menu && expanded === link.href && (
                        <MobileSubmenu menu={link.menu} onNavigate={() => setIsOpen(false)} />
                      )}
                    </AnimatePresence>
                  </li>
                ))}
              </ul>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-3 shrink-0 space-y-3"
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
