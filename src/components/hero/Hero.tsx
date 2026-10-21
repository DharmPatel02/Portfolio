import { Brain, Code2, FileText, Mail, Server, SquareTerminal, UserRound } from "lucide-react";
import { container } from "@/components/headings";
import { focus, profile } from "@/content/profile";

// A short pick from the skills list in content/profile.ts.
const stack = ["Python", "Java", "TypeScript", "Spring Boot", "FastAPI", "PyTorch", "AWS", "Docker", "React"];

export function Hero() {
  return (
    <section id="home" aria-labelledby="hero-title" className="relative flex min-h-[100svh] items-center overflow-hidden pb-20 pt-36">
      <div aria-hidden="true" className="absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-accent/5 blur-[120px]" />
      <div aria-hidden="true" className="absolute -right-24 bottom-1/4 h-96 w-96 rounded-full bg-accent-2/5 blur-[120px]" />

      <div className={`relative grid grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-12 ${container}`}>
        <div>
          <p className="font-semibold text-accent-ink">{profile.role}</p>
          <h1 id="hero-title" className="type-display mt-5 text-[clamp(4.25rem,12vw,8.5rem)]">
            <span className="text-gradient">Dharm</span>
            <br />
            <span className="text-hull/55">Patel</span>
          </h1>
          <p className="mt-8 max-w-lg text-xl leading-relaxed text-hull/85">{profile.headline}</p>
          <p className="mt-4 max-w-lg text-muted">{profile.sub}</p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-semibold text-on-accent shadow-[0_0_24px_rgb(var(--glow)/0.3)] transition-shadow hover:shadow-[0_0_36px_rgb(var(--glow)/0.55)]"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Email me
            </a>
            <a href="#projects" className="rounded-full border border-line-strong px-7 py-3.5 font-semibold transition-colors hover:border-accent hover:text-accent-ink">
              See projects
            </a>
            {profile.resume && (
              <a
                href={profile.resume}
                className="inline-flex items-center gap-2 rounded-full border border-line-strong px-7 py-3.5 font-semibold transition-colors hover:border-accent hover:text-accent-ink"
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                Resume
              </a>
            )}
          </div>
          <div className="mt-6 flex gap-5 text-sm font-semibold text-muted">
            <a href={profile.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-accent-ink">
              <Code2 className="h-4 w-4" aria-hidden="true" />
              GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-accent-ink">
              <UserRound className="h-4 w-4" aria-hidden="true" />
              LinkedIn
            </a>
            <a href={profile.leetcode} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-accent-ink">
              <SquareTerminal className="h-4 w-4" aria-hidden="true" />
              LeetCode
            </a>
          </div>
        </div>

        <div className="glass-card p-7 sm:p-8">
          <p className="flex items-center gap-2.5 border-b border-line-soft pb-5 text-sm text-muted">
            <span aria-hidden="true" className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            {profile.availability}
          </p>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
            <FocusList icon={<Server className="h-5 w-5" aria-hidden="true" />} tone="accent" {...focus.eng} />
            <FocusList icon={<Brain className="h-5 w-5" aria-hidden="true" />} tone="accent-2" {...focus.ml} />
          </div>
          <div className="mt-7 border-t border-line-soft pt-6">
            <p className="text-sm text-muted">Core stack</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {stack.map((s) => (
                <li key={s} className="rounded-lg border border-line bg-tint px-3 py-1 text-sm">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function FocusList({ icon, title, items, tone }: { icon: React.ReactNode; title: string; items: string[]; tone: "accent" | "accent-2" }) {
  const color = tone === "accent" ? "text-accent-ink bg-accent/10" : "text-accent-2 bg-accent-2/10";
  const dot = tone === "accent" ? "bg-accent" : "bg-accent-2";
  return (
    <div>
      <p className="flex items-center gap-2 whitespace-nowrap font-semibold">
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${color}`}>{icon}</span>
        {title}
      </p>
      <ul className="mt-4 flex flex-col gap-2.5 text-[0.95rem] text-hull/85">
        {items.map((it) => (
          <li key={it} className="relative pl-4">
            <span aria-hidden="true" className={`absolute left-0 top-[0.62em] h-1.5 w-1.5 rounded-full ${dot}`} />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
