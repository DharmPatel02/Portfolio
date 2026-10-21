"use client";

import { BookOpen, Briefcase, FolderGit2, GraduationCap, Home, Mail, User, Wrench } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export const sections = [
  { id: "home", label: "Home", icon: Home },
  { id: "about", label: "About", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "publications", label: "Publications", icon: BookOpen },
  { id: "contact", label: "Contact", icon: Mail },
] as const;

const PROJECTS = sections.findIndex((s) => s.id === "projects");
const TRAVEL_MS = 550;

/**
 * Top nav with a small robot riding the active item. The pill and the robot
 * share one CSS transition, so they glide together; the robot leans into the
 * move, then wiggles on whichever item it lands on.
 */
export function BotNav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [scrolled, setScrolled] = useState(0);
  // Project detail pages keep the robot on "Projects"; any other page puts it on "Home".
  const active = onHome ? scrolled : pathname.startsWith("/work/") ? PROJECTS : 0;

  const navRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const botRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const prev = useRef(active);
  // While a nav click is scrolling the page, ignore the sections it passes.
  const locked = useRef(false);

  // Track the section being read: the last one whose top has passed the upper third.
  useEffect(() => {
    if (!onHome) return;
    let frame = 0;
    let unlock = 0;
    const update = () => {
      frame = 0;
      if (locked.current) return;
      const line = window.innerHeight * 0.35;
      let current = 0;
      sections.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= line) current = i;
      });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = sections.length - 1;
      setScrolled(current);
    };
    const onScroll = () => {
      if (locked.current) {
        window.clearTimeout(unlock);
        unlock = window.setTimeout(() => {
          locked.current = false;
          update();
        }, 160);
        return;
      }
      if (!frame) frame = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
      window.clearTimeout(unlock);
    };
  }, [onHome]);

  // Place the pill and robot over the active item; flag the move so the robot leans.
  useLayoutEffect(() => {
    const nav = navRef.current;
    const place = () => {
      const item = itemRefs.current[active];
      const pill = pillRef.current;
      const bot = botRef.current;
      if (!item || !pill || !bot) return;
      pill.style.width = `${item.offsetWidth}px`;
      pill.style.transform = `translateX(${item.offsetLeft}px)`;
      bot.style.transform = `translateX(${item.offsetLeft + item.offsetWidth / 2 - bot.offsetWidth / 2}px)`;
    };
    place();
    if (!nav) return;

    let timer = 0;
    if (prev.current !== active && "ready" in nav.dataset) {
      nav.style.setProperty("--dir", active > prev.current ? "1" : "-1");
      nav.dataset.moving = "";
      timer = window.setTimeout(() => delete nav.dataset.moving, TRAVEL_MS);
    }
    prev.current = active;

    // First placement happens without a transition, so nothing slides in from the left.
    const ready = requestAnimationFrame(() => {
      nav.dataset.ready = "";
    });
    const ro = new ResizeObserver(place);
    ro.observe(nav);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(ready);
      window.clearTimeout(timer);
    };
  }, [active]);

  const go = (i: number) => {
    if (!onHome) return;
    locked.current = true;
    setScrolled(i);
    // Unlock even if the page was already in place and no scroll happens.
    window.setTimeout(() => {
      if (locked.current) window.dispatchEvent(new Event("scroll"));
    }, 900);
  };

  return (
    <nav aria-label="Sections" className="pointer-events-none fixed inset-x-0 top-11 z-50 flex justify-center px-3 sm:top-10">
      <div
        ref={navRef}
        className="bot-nav pointer-events-auto relative flex items-center gap-0.5 rounded-full border border-line bg-deck/70 p-1.5 nav-shadow backdrop-blur-2xl"
      >
        <span
          ref={pillRef}
          aria-hidden="true"
          className="bot-nav-travel absolute inset-y-1.5 left-0 rounded-full bg-accent shadow-lg shadow-accent/30"
        />
        <span ref={botRef} aria-hidden="true" className="bot-nav-travel pointer-events-none absolute -top-8 left-0 z-20 h-10 w-10">
          <span className="bot-lean block h-full w-full">
            <span className="bot-wiggle block h-full w-full">
              <Bot />
            </span>
          </span>
        </span>

        {sections.map((s, i) => {
          const Icon = s.icon;
          const current = i === active;
          return (
            <Link
              key={s.id}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              href={onHome ? `#${s.id}` : `/#${s.id}`}
              onClick={() => go(i)}
              aria-current={current && onHome ? "location" : undefined}
              className={`relative z-10 flex items-center rounded-full p-2.5 text-[13px] font-semibold transition-colors duration-300 md:px-3 md:py-2 ${
                current ? "text-on-accent" : "text-hull/65 hover:text-hull"
              }`}
            >
              <Icon className="h-4 w-4 md:hidden" aria-hidden="true" />
              <span className="sr-only md:not-sr-only">{s.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/** The robot from the first version of the site, with a blink. White on dark, black on light. */
function Bot() {
  return (
    <svg viewBox="0 0 100 100" fill="none" className="h-full w-full drop-shadow-[0_8px_12px_rgb(var(--glow)/0.35)]">
      <path d="M 25 50 C 15 50, 15 75, 25 80" stroke="var(--bot-arm)" strokeWidth="8" strokeLinecap="round" />
      <path d="M 75 50 C 85 50, 85 75, 75 80" stroke="var(--bot-arm)" strokeWidth="8" strokeLinecap="round" />
      <path d="M 35 50 C 35 90, 65 90, 65 50 Z" fill="url(#bot-body)" stroke="var(--bot-outline)" strokeWidth="1.5" />
      <rect x="25" y="15" width="50" height="35" rx="15" fill="url(#bot-head)" stroke="var(--bot-outline)" strokeWidth="1.5" />
      <rect x="30" y="20" width="40" height="25" rx="8" fill="var(--bot-screen)" />
      <g className="bot-eyes">
        <path d="M 38 32 Q 42 28 46 32" stroke="var(--bot-eye)" strokeWidth="3" strokeLinecap="round" />
        <path d="M 54 32 Q 58 28 62 32" stroke="var(--bot-eye)" strokeWidth="3" strokeLinecap="round" />
      </g>
      <path d="M 45 40 Q 50 44 55 40" stroke="var(--bot-eye)" strokeWidth="2.5" strokeLinecap="round" />
      <defs>
        <linearGradient id="bot-head" x1="25" y1="15" x2="75" y2="50" gradientUnits="userSpaceOnUse">
          <stop style={{ stopColor: "var(--bot-head-from)" }} />
          <stop offset="1" style={{ stopColor: "var(--bot-head-to)" }} />
        </linearGradient>
        <linearGradient id="bot-body" x1="35" y1="50" x2="65" y2="90" gradientUnits="userSpaceOnUse">
          <stop style={{ stopColor: "var(--bot-body-from)" }} />
          <stop offset="1" style={{ stopColor: "var(--bot-body-to)" }} />
        </linearGradient>
      </defs>
    </svg>
  );
}
