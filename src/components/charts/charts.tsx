// Small HTML charts: real text at every width, values labelled, a table view
// for every chart, one axis each. Tone colours follow the site rule:
// signal = my method / improvement, ember = worse, plate = everything else.

import type { ReactNode } from "react";

type Tone = "mine" | "bad" | "neutral";

const toneClass: Record<Tone, string> = {
  mine: "bg-signal",
  bad: "bg-ember",
  neutral: "bg-muted",
};

// Phones stack the label above its track; wider screens put them side by side.
const cols2 = "grid-cols-1 sm:grid-cols-[minmax(7.5rem,13rem)_1fr]";
const cols3 = "grid-cols-[1fr_auto] sm:grid-cols-[minmax(6rem,10rem)_1fr_7.5rem]";

const pct = (v: number, [lo, hi]: [number, number]) => `${((v - lo) / (hi - lo)) * 100}%`;

interface Frame {
  title: string;
  source: string;
  children: ReactNode;
  table: { head: string[]; rows: (string | number)[][] };
  legend?: ReactNode;
  note?: ReactNode;
}

export function ChartFrame({ title, source, children, table, legend, note }: Frame) {
  return (
    <figure className="mt-8">
      <figcaption className="type-heading text-lg">{title}</figcaption>
      {legend && <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">{legend}</div>}
      <div className="mt-4">{children}</div>
      {note && <p className="mt-3 max-w-[44rem] text-[0.95rem] text-muted">{note}</p>}
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-muted hover:text-hull">Show as table</summary>
        <table className="num mt-3 w-full max-w-[40rem] border-collapse text-left">
          <thead>
            <tr>
              {table.head.map((h) => (
                <th key={h} className="border-b border-plate py-1.5 pr-4 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((r, i) => (
              <tr key={i}>
                {r.map((c, j) => (
                  <td key={j} className="border-b border-plate py-1.5 pr-4">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </details>
      <p className="mt-2 text-xs text-muted">Source: {source}</p>
    </figure>
  );
}

function Grid({ domain, ticks }: { domain: [number, number]; ticks: number[] }) {
  return (
    <>
      {ticks.map((t) => (
        <span key={t} aria-hidden="true" className="absolute inset-y-0 w-px bg-plate" style={{ left: pct(t, domain) }} />
      ))}
    </>
  );
}

function Axis({
  domain,
  ticks,
  format,
  label,
  trailing = false,
}: {
  domain: [number, number];
  ticks: number[];
  format: (v: number) => string;
  label: string;
  trailing?: boolean;
}) {
  return (
    <div className={`grid ${trailing ? cols3 : cols2} gap-x-4 text-xs text-muted`} aria-hidden="true">
      <span className="hidden sm:block" />
      <div className={trailing ? "col-span-2 sm:col-span-1" : "mr-12"}>
        <div className="relative h-5">
          {ticks.map((t) => (
            <span key={t} className="num absolute -translate-x-1/2" style={{ left: pct(t, domain) }}>
              {format(t)}
            </span>
          ))}
        </div>
        <div className="mt-1">{label}</div>
      </div>
      {trailing && <span className="hidden sm:block" />}
    </div>
  );
}

export interface DotRow {
  label: string;
  value: number;
  tone?: Tone;
  group?: string;
}

/** One dot per row on a shared axis. Use when differences are small and a zero baseline would hide them. */
export function DotPlot({
  rows,
  domain,
  ticks,
  format,
  tickFormat,
  axisLabel,
}: {
  rows: DotRow[];
  domain: [number, number];
  ticks: number[];
  format: (v: number) => string;
  tickFormat?: (v: number) => string;
  axisLabel: string;
}) {
  return (
    <div aria-hidden="true">
      {rows.map((r, i) => {
        const showGroup = r.group && r.group !== rows[i - 1]?.group;
        return (
          <div key={r.label}>
            {showGroup && <div className="mt-3 text-xs font-semibold text-muted">{r.group}</div>}
            <div className={`group grid ${cols2} items-center gap-x-4 rounded hover:bg-raised`} title={`${r.label}: ${format(r.value)}`}>
              <span className={`pt-1 text-sm sm:py-1 ${r.tone === "mine" ? "font-semibold" : ""}`}>{r.label}</span>
              <div className="relative mr-12 h-8">
                <Grid domain={domain} ticks={ticks} />
                <span
                  className={`absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-deck ${toneClass[r.tone ?? "neutral"]}`}
                  style={{ left: pct(r.value, domain) }}
                />
                <span className="num absolute top-1/2 -translate-y-1/2 pl-3 text-xs" style={{ left: pct(r.value, domain) }}>
                  {format(r.value)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      <Axis domain={domain} ticks={ticks} format={tickFormat ?? format} label={axisLabel} />
    </div>
  );
}

export interface BarRow {
  label: string;
  value: number;
  tone?: Tone;
}

/** Horizontal bars from zero. */
export function BarChart({
  rows,
  max,
  ticks,
  format,
  tickFormat,
  axisLabel,
}: {
  rows: BarRow[];
  max: number;
  ticks: number[];
  format: (v: number) => string;
  tickFormat?: (v: number) => string;
  axisLabel: string;
}) {
  const domain: [number, number] = [0, max];
  return (
    <div aria-hidden="true">
      {rows.map((r) => (
        <div key={r.label} className={`grid ${cols2} items-center gap-x-4 rounded hover:bg-raised`} title={`${r.label}: ${format(r.value)}`}>
          <span className={`pt-1 text-sm sm:py-1 ${r.tone === "mine" ? "font-semibold" : ""}`}>{r.label}</span>
          <div className="relative mr-12 h-8">
            <Grid domain={domain} ticks={ticks} />
            <span
              className={`absolute left-0 top-1/2 h-4 -translate-y-1/2 rounded-r-[4px] ${toneClass[r.tone ?? "neutral"]}`}
              style={{ width: pct(r.value, domain) }}
            />
            <span className="num absolute top-1/2 -translate-y-1/2 pl-2 text-xs" style={{ left: pct(r.value, domain) }}>
              {format(r.value)}
            </span>
          </div>
        </div>
      ))}
      <Axis domain={domain} ticks={ticks} format={tickFormat ?? format} label={axisLabel} />
    </div>
  );
}

export interface DumbbellRow {
  label: string;
  from: number;
  to: number;
}

/** Before and after on one axis. The after dot is teal when it improved (lower), ember when it got worse. */
export function Dumbbell({
  rows,
  domain,
  ticks,
  format,
  tickFormat,
  axisLabel,
}: {
  rows: DumbbellRow[];
  domain: [number, number];
  ticks: number[];
  format: (v: number) => string;
  tickFormat?: (v: number) => string;
  axisLabel: string;
}) {
  return (
    <div aria-hidden="true">
      {rows.map((r) => {
        const better = r.to < r.from;
        const lo = Math.min(r.from, r.to);
        const hi = Math.max(r.from, r.to);
        return (
          <div key={r.label} className={`grid ${cols3} items-center gap-x-4 rounded hover:bg-raised`} title={`${r.label}: ${format(r.from)} to ${format(r.to)}`}>
            <span className="order-1 pt-1 text-sm sm:py-1">{r.label}</span>
            <div className="relative order-3 col-span-2 h-9 sm:order-2 sm:col-span-1">
              <Grid domain={domain} ticks={ticks} />
              <span
                className={`absolute top-1/2 h-0.5 -translate-y-1/2 ${better ? "bg-signal" : "bg-ember"}`}
                style={{ left: pct(lo, domain), width: `calc(${pct(hi, domain)} - ${pct(lo, domain)})` }}
              />
              <span className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted ring-2 ring-deck" style={{ left: pct(r.from, domain) }} />
              <span
                className={`absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-deck ${better ? "bg-signal" : "bg-ember"}`}
                style={{ left: pct(r.to, domain) }}
              />
            </div>
            <span className="num order-2 whitespace-nowrap pt-1 text-xs sm:order-3 sm:pt-0">
              {format(r.from)} to {format(r.to)}
            </span>
          </div>
        );
      })}
      <Axis domain={domain} ticks={ticks} format={tickFormat ?? format} label={axisLabel} trailing />
    </div>
  );
}

export function Swatch({ tone, round = true, children }: { tone: Tone; round?: boolean; children: ReactNode }) {
  return (
    <span className="flex items-center gap-1.5">
      <span aria-hidden="true" className={`inline-block h-3 w-3 ${round ? "rounded-full" : "rounded-[2px]"} ${toneClass[tone]}`} />
      {children}
    </span>
  );
}
