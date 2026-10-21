"use client";

import { Anchor, Archive, ArrowUpRight, BarChart3, Bot, Bug, ChefHat, Code2, Gavel, Globe, Stethoscope } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import { container, SplitHeading } from "@/components/headings";
import { FireDemo } from "@/components/hero/FireDemo";
import { TiltCard } from "@/components/ui/tilt-card";
import { kindLabels, lensLabels, pointsFor, projectsFor, type Lens, type Project } from "@/content/projects";

const lenses: Lens[] = ["all", "eng", "ml"];
const isLens = (v: string | null): v is Lens => v === "all" || v === "eng" || v === "ml";

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  medguard: Stethoscope,
  "vehicle-auction": Gavel,
  anchor: Anchor,
  deathbox: Archive,
  "recipe-recommender": ChefHat,
  "rutgers-ai": Bot,
  "pest-classification": Bug,
};

export function ProjectsSection() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const raw = params.get("lens");
  const lens: Lens = isLens(raw) ? raw : "all";

  // The filter lives in the URL, so a link to ?lens=ml opens the ML projects.
  const choose = (next: Lens) => {
    const q = new URLSearchParams(params.toString());
    if (next === "all") q.delete("lens");
    else q.set("lens", next);
    const qs = q.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}#projects`, { scroll: false });
  };

  // The wide demo card goes last so the two-column grid stays even.
  const list = projectsFor(lens);
  const ordered = [...list.filter((p) => !p.demo), ...list.filter((p) => p.demo)];

  return (
    <section id="projects" aria-labelledby="projects-title" className={`py-24 ${container}`}>
      <SplitHeading
        id="projects-title"
        lead="Selected"
        rest="Works"
        intro="Filter by the role you're hiring for. Each card shows what it is, the key results, and what I built."
      >
        <FilterTabs lens={lens} onChange={choose} />
      </SplitHeading>

      <ul className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
        {ordered.map((p) => (
          <li key={p.slug} className={`min-w-0 ${p.demo ? "md:col-span-2" : ""}`}>
            <ProjectCard project={p} lens={lens} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Segmented control with an amber pill that slides to the selected tab. */
function FilterTabs({ lens, onChange }: { lens: Lens; onChange: (l: Lens) => void }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const pill = useRef<HTMLSpanElement>(null);
  const index = lenses.indexOf(lens);

  useLayoutEffect(() => {
    const el = refs.current[index];
    const p = pill.current;
    if (!el || !p) return;
    p.style.width = `${el.offsetWidth}px`;
    p.style.transform = `translateX(${el.offsetLeft - 4}px)`;
  }, [index]);

  return (
    <div role="radiogroup" aria-label="Filter projects" className="relative flex w-fit rounded-full border border-line bg-deck/60 p-1 backdrop-blur-xl">
      <span
        ref={pill}
        aria-hidden="true"
        className="absolute inset-y-1 left-1 rounded-full bg-accent shadow-lg shadow-accent/25 transition-[transform,width] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
      />
      {lenses.map((l, i) => (
        <button
          key={l}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="button"
          role="radio"
          aria-checked={lens === l}
          onClick={() => onChange(l)}
          className={`relative z-10 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
            lens === l ? "text-on-accent" : "text-hull/65 hover:text-hull"
          }`}
        >
          <span className="sm:hidden">{lensLabels[l].short}</span>
          <span className="hidden sm:inline">{lensLabels[l].full}</span>
        </button>
      ))}
    </div>
  );
}

function ProjectCard({ project: p, lens }: { project: Project; lens: Lens }) {
  const points = pointsFor(p, lens);
  const Icon = icons[p.slug] ?? Code2;
  return (
    <TiltCard max={p.demo ? 0 : 4} className="glass-card group flex h-full flex-col p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-tint-strong text-accent-ink transition-colors duration-500 group-hover:bg-accent/15">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 pt-1">
          {p.kinds.map((k) => (
            <span
              key={k}
              className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                k === "ml" ? "border-accent-2/30 text-accent-2" : "border-accent/30 text-accent-ink"
              }`}
            >
              {kindLabels[k]}
            </span>
          ))}
          <span className="num ml-auto text-sm text-muted">{p.when}</span>
        </div>
      </div>

      <h3 className="type-heading mt-6 text-[1.75rem] transition-colors duration-500 group-hover:text-accent-ink">{p.title}</h3>
      <p className="mt-1 text-sm text-muted">{p.context}</p>
      <p className="mt-4 text-[1.05rem] text-hull/85">{p.summary}</p>

      {p.metrics.length > 0 && (
        <dl className="mt-6 grid grid-cols-3 gap-3">
          {p.metrics.map((m) => (
            <div key={m.label} className="flex flex-col-reverse rounded-2xl border border-line bg-tint px-3 py-3">
              <dt className="mt-1 text-xs leading-snug text-muted">{m.label}</dt>
              <dd className="type-heading num text-2xl text-hull sm:text-[1.65rem]">{m.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className={p.demo ? "mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2" : "mt-6"}>
        <div>
          <p className="text-sm font-semibold text-hull/90">What I built</p>
          <ul className="mt-3 flex flex-col gap-2.5 text-[0.95rem] text-hull/80">
            {points.map((pt) => (
              <li key={pt.text} className="relative pl-4">
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-[0.62em] h-1.5 w-1.5 rounded-full ${pt.kind === "ml" ? "bg-accent-2" : "bg-accent"}`}
                />
                {pt.text}
              </li>
            ))}
          </ul>
          {p.caveat && <p className="mt-4 border-l-2 border-amber/80 pl-3 text-sm text-muted">{p.caveat}</p>}
        </div>
        {p.demo && <FireDemo />}
      </div>

      <div className="mt-auto pt-6">
        <ul className="flex flex-wrap gap-1.5" aria-label="Tech used">
          {p.tech.map((t) => (
            <li key={t} className="rounded-lg border border-line bg-tint px-2.5 py-1 text-xs text-hull/70">
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-5 flex flex-wrap gap-2">
          {p.detail && (
            <Link
              href={`/work/${p.slug}/`}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-on-accent transition-shadow hover:shadow-[0_0_24px_rgb(var(--glow)/0.45)]"
            >
              <BarChart3 className="h-4 w-4" aria-hidden="true" />
              See results
            </Link>
          )}
          {p.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-semibold transition-colors hover:border-accent hover:text-accent-ink"
            >
              {l.kind === "live" ? <Globe className="h-4 w-4" aria-hidden="true" /> : <Code2 className="h-4 w-4" aria-hidden="true" />}
              {l.label}
              <ArrowUpRight className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
            </a>
          ))}
        </p>
      </div>
    </TiltCard>
  );
}
