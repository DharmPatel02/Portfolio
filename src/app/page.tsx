import { ArrowUpRight, Award, BookOpen, Brain, Cloud, Code2, Database, FileText, GraduationCap, Layout, Mail, Server, SquareTerminal, UserRound } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { container, SideHeading, SplitHeading } from "@/components/headings";
import { Hero } from "@/components/hero/Hero";
import { ProjectsSection } from "@/components/work/ProjectsSection";
import { about, education, experience, facts, profile, publication, recognition, skills } from "@/content/profile";

const shell = `py-24 ${container}`;

const skillIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Languages: Code2,
  "Backend and systems": Server,
  "Machine learning": Brain,
  "Cloud and DevOps": Cloud,
  Frontend: Layout,
  "Data and tools": Database,
};

export default function Home() {
  return (
    <>
      <Hero />

      <section id="about" aria-labelledby="about-title" className={shell}>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SplitHeading id="about-title" lead="About" rest="Me" />
            <div className="mt-8 flex flex-col gap-5 text-lg leading-relaxed text-hull/80">
              {about.slice(0, 2).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-4">
            {facts.map((f) => (
              <li key={f.label} className="glass-card p-6">
                <p className="type-heading text-3xl text-hull sm:text-4xl">{f.value}</p>
                <p className="mt-2 text-sm leading-snug text-accent-ink">{f.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="experience" aria-labelledby="experience-title" className={shell}>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <SideHeading id="experience-title" title="Experience" intro="A year of full-time backend work, two web development internships, and teaching at Rutgers." />
          <ol className="flex flex-col gap-10 md:col-span-2">
            {experience.map((r, i) => (
              <li key={r.org} className="relative pl-12 sm:pl-16">
                {i < experience.length - 1 && (
                  <span aria-hidden="true" className="absolute left-[15px] top-8 h-[calc(100%+2.5rem)] w-[2px] bg-gradient-to-b from-accent/40 via-accent-2/30 to-accent/10">
                    <span className="timeline-pulse absolute -left-[2px] h-8 w-[6px] rounded-full bg-accent shadow-[0_0_12px_rgb(var(--glow)/0.8)]" />
                  </span>
                )}
                <span aria-hidden="true" className="absolute left-0 top-0 grid h-8 w-8 place-items-center rounded-full border-2 border-accent bg-deck">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                </span>
                <div className="glass-card border-l-4 border-l-accent p-7">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <h3 className="type-heading text-2xl">
                      <span className="text-gradient">{r.title}</span>
                    </h3>
                    <p className="flex shrink-0 items-center gap-2 text-sm text-muted">
                      <span className="rounded-full border border-line px-2.5 py-0.5 text-xs font-semibold text-hull/80">{r.type}</span>
                      <span className="num">{r.dates}</span>
                    </p>
                  </div>
                  <p className="mt-1 font-semibold text-hull/85">
                    {r.org}
                    {r.place && <span className="font-normal text-muted">, {r.place}</span>}
                  </p>
                  <ul className="mt-5 flex flex-col gap-2.5 text-[0.95rem] text-hull/80">
                    {r.points.map((pt) => (
                      <li key={pt} className="relative pl-4">
                        <span aria-hidden="true" className="absolute left-0 top-[0.62em] h-1.5 w-1.5 rounded-full bg-accent" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  {r.tech && (
                    <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tech used">
                      {r.tech.map((t) => (
                        <li key={t} className="rounded-lg border border-line px-2.5 py-1 text-xs text-muted">
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Suspense>
        <ProjectsSection />
      </Suspense>

      <section id="skills" aria-labelledby="skills-title" className={shell}>
        <SplitHeading id="skills-title" lead="Technical" rest="Skills" intro="Tools from my projects, coursework, and a year of full-time work." />
        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((s) => {
            const Icon = skillIcons[s.group] ?? Code2;
            return (
              <div key={s.group} className="glass-card group p-7">
                <h3 className="flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-tint-strong text-muted transition-colors duration-500 group-hover:bg-accent/10 group-hover:text-accent-ink">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="type-heading text-2xl">{s.group}</span>
                </h3>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {s.items.map((it) => (
                    <li key={it} className="rounded-lg border border-line bg-tint px-3 py-1.5 text-sm text-hull/80">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section id="education" aria-labelledby="education-title" className={shell}>
        <SplitHeading id="education-title" lead="Academic" rest="Background" />
        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2">
          {education.map((e, i) => {
            const Icon = i === 0 ? GraduationCap : BookOpen;
            return (
              <div key={e.degree} className="glass-card p-7">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent/10 text-accent-ink">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="type-heading mt-6 text-2xl">{e.degree}</h3>
                <p className="mt-1 text-hull/85">{e.school}</p>
                <p className="mt-5 border-t border-line-soft pt-5 text-sm text-muted">{e.detail}</p>
              </div>
            );
          })}
          <div className="glass-card p-7 md:col-span-2">
            <h3 className="flex items-center gap-3 font-semibold">
              <Award className="h-5 w-5 text-accent-ink" aria-hidden="true" />
              Awards and certifications
            </h3>
            <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 text-[0.95rem] text-hull/80 sm:grid-cols-2">
              {recognition.map((r) => (
                <li key={r} className="relative pl-4">
                  <span aria-hidden="true" className="absolute left-0 top-[0.62em] h-1.5 w-1.5 rounded-full bg-accent-2" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="publications" aria-labelledby="publications-title" className={shell}>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <SideHeading id="publications-title" title="Publications" />
          <article className="group border-b border-line-soft pb-10 md:col-span-2">
            <p className="text-sm font-semibold text-accent-ink">{publication.venue}</p>
            <h3 className="type-heading mt-3 text-2xl leading-snug transition-colors group-hover:text-accent-ink sm:text-3xl">
              {publication.url ? (
                <a href={publication.url} target="_blank" rel="noreferrer">
                  {publication.title}
                </a>
              ) : (
                publication.title
              )}
            </h3>
            <p className="mt-3 text-sm text-muted">{publication.authors}</p>
            <p className="mt-4 max-w-2xl text-hull/80">{publication.summary}</p>
            <p className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
              {publication.url && (
                <a
                  href={publication.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-tint-strong px-4 py-2 transition-colors hover:bg-accent hover:text-on-accent"
                >
                  Read on IEEE Xplore
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              )}
              <Link
                href={`/work/${publication.related}/`}
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 transition-colors hover:border-accent hover:text-accent-ink"
              >
                Related project: comparing four image models
              </Link>
            </p>
          </article>
        </div>
      </section>

      <section id="contact" aria-labelledby="contact-title" className={`pb-12 pt-24 text-center ${container}`}>
        <div className="mx-auto max-w-4xl">
          <p className="font-semibold text-accent-ink">{profile.availability}</p>
          <h2 id="contact-title" className="type-display mt-8 text-[clamp(4.5rem,13vw,10rem)] leading-[0.85]">
            <span className="text-gradient">Let&apos;s</span>
            <br />
            <span className="text-hull/55">Build</span>
          </h2>
          <p className="mx-auto mt-10 max-w-xl text-lg text-hull/80">
            I&apos;m looking for full-time SDE and ML Engineer roles starting January 2027.
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-accent to-accent-3 px-10 py-5 text-lg font-bold text-on-accent shadow-[0_0_40px_rgb(var(--glow)/0.35)] transition-shadow hover:shadow-[0_0_60px_rgb(var(--glow)/0.6)] sm:px-14 sm:py-6 sm:text-xl"
          >
            <Mail className="h-5 w-5" aria-hidden="true" />
            Email me
          </a>
          <p className="mt-4 text-sm text-muted">{profile.email}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-semibold">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 hover:border-accent hover:text-accent-ink"
            >
              <UserRound className="h-4 w-4" aria-hidden="true" />
              LinkedIn
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 hover:border-accent hover:text-accent-ink"
            >
              <Code2 className="h-4 w-4" aria-hidden="true" />
              GitHub
            </a>
            <a
              href={profile.leetcode}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 hover:border-accent hover:text-accent-ink"
            >
              <SquareTerminal className="h-4 w-4" aria-hidden="true" />
              LeetCode
            </a>
            {profile.resume && (
              <a href={profile.resume} className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 hover:border-accent hover:text-accent-ink">
                <FileText className="h-4 w-4" aria-hidden="true" />
                Resume (PDF)
              </a>
            )}
          </div>
          <p className="mt-10 text-sm text-muted">{about[2]}</p>
        </div>

        <footer className="mt-24 flex flex-col items-center justify-between gap-4 border-t border-line-soft pt-8 text-sm text-muted md:flex-row">
          <p>© 2026 Dharm Patel. Built with Next.js and Three.js.</p>
          <p className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            <a href={`mailto:${profile.email}`} className="hover:text-accent-ink">
              Email
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-accent-ink">
              GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-accent-ink">
              LinkedIn
            </a>
            <a href={profile.leetcode} target="_blank" rel="noreferrer" className="hover:text-accent-ink">
              LeetCode
            </a>
            <a href="#home" className="hover:text-accent-ink">
              Back to top
            </a>
          </p>
        </footer>
      </section>
    </>
  );
}
