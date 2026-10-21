import type { Metadata } from "next";
import Link from "next/link";
import { container } from "@/components/headings";
import { notFound } from "next/navigation";
import { ChartFrame, Dumbbell, DotPlot, BarChart, Swatch } from "@/components/charts/charts";
import { projects, type Project } from "@/content/projects";
import {
  medguardAbstention,
  medguardCalibration,
  medguardDatasets,
  pestBackbones,
  recommenderModels,
} from "@/content/results";

const withDetail = projects.filter((p) => p.detail);

export function generateStaticParams() {
  return withDetail.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return p ? { title: p.title, description: p.summary } : {};
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const p = withDetail.find((x) => x.slug === slug);
  if (!p) notFound();

  return (
    <article className={`pb-24 pt-36 lg:pt-40 ${container}`}>
      <p>
        <Link href="/#projects" className="link">
          Back to all projects
        </Link>
      </p>
      <header className="mt-8 grid gap-x-10 gap-y-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h1 className="type-display text-[clamp(2.1rem,4.6vw,3.75rem)]">{p.title}</h1>
          <p className="mt-3 text-muted">
            {p.when}
            <br />
            {p.context}
          </p>
        </div>
        <p className="text-lg lg:col-span-5 lg:pt-3">{p.summary}</p>
      </header>

      <div className="mt-10 grid gap-x-10 gap-y-10 border-t border-line-soft pt-10 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <Facts project={p} />
        </aside>
        <div className="min-w-0 lg:col-span-8">
          {p.detail === "medguard" && <MedGuard />}
          {p.detail === "recommender" && <Recommender />}
          {p.detail === "pest" && <Pest />}
        </div>
      </div>
    </article>
  );
}

function Facts({ project: p }: { project: Project }) {
  const points = p.points.map((pt) => pt.text);
  return (
    <div className="glass-card flex flex-col gap-6 p-6 lg:sticky lg:top-36">
      <ul className="flex flex-col gap-3 text-[0.95rem] text-hull/85">
        {points.map((pt) => (
          <li key={pt} className="relative pl-5">
            <span aria-hidden="true" className="absolute left-0 top-[0.62em] h-2 w-2 rounded-full bg-accent" />
            {pt}
          </li>
        ))}
      </ul>
      {p.caveat && <p className="border-l-2 border-amber/80 pl-4 text-[0.95rem] text-muted">{p.caveat}</p>}
      <p className="text-[0.95rem] text-muted">{p.tech.join(", ")}</p>
      <p className="flex flex-col gap-2">
        {p.links.map((l) => (
          <a key={l.href} href={l.href} className="link" target="_blank" rel="noreferrer">
            {l.label}
          </a>
        ))}
      </p>
    </div>
  );
}

const f3 = (v: number) => v.toFixed(3);
const f4 = (v: number) => v.toFixed(4);

function MedGuard() {
  const cal = medguardCalibration.rows;
  return (
    <>
      <h2 className="type-heading text-2xl">What the numbers show</h2>
      <p className="mt-3 max-w-[44rem]">
        The goal was confidence you can act on, not a higher accuracy number. Grounding the model on three causal
        sentences cost 2.7 points of accuracy. The wins are elsewhere: calibrated confidence and the ability to
        decline to answer.
      </p>

      <ChartFrame
        title="Expected calibration error on PubMedQA, by method (lower is better)"
        source={medguardCalibration.source}
        note="Temperature scaling, the usual fix, made calibration worse than doing nothing."
        table={{ head: ["Method", "ECE", "Brier"], rows: cal.map((r) => [r.label, f4(r.ece), f4(r.brier)]) }}
      >
        <BarChart
          rows={cal.map((r) => ({
            label: r.label,
            value: r.ece,
            tone: r.mine ? "mine" : "neutral",
          }))}
          max={0.25}
          ticks={[0, 0.05, 0.1, 0.15, 0.2, 0.25]}
          format={f3}
          tickFormat={(v) => v.toFixed(2)}
          axisLabel="Expected calibration error"
        />
      </ChartFrame>

      <ChartFrame
        title="Calibration error before and after the MLP calibrator, per dataset"
        source={medguardDatasets.source}
        legend={
          <>
            <Swatch tone="neutral">Uncalibrated</Swatch>
            <Swatch tone="mine">After, improved</Swatch>
            <Swatch tone="bad">After, worse</Swatch>
          </>
        }
        note="BioASQ got worse: its base model was already almost perfectly calibrated (100% baseline accuracy), so there was nothing to fix and the calibrator added error. The calibrator helps where the model is miscalibrated."
        table={{
          head: ["Dataset", "Examples", "Baseline accuracy", "ECE before", "ECE after", "Change"],
          rows: medguardDatasets.rows.map((r) => [
            r.dataset,
            r.n.toLocaleString("en-US"),
            `${r.baselineAcc.toFixed(2)}%`,
            f4(r.before),
            f4(r.after),
            `${r.change > 0 ? "−" : "+"}${Math.abs(r.change).toFixed(1)}%`,
          ]),
        }}
      >
        <Dumbbell
          rows={medguardDatasets.rows.map((r) => ({ label: r.dataset, from: r.before, to: r.after }))}
          domain={[0, 0.16]}
          ticks={[0, 0.04, 0.08, 0.12, 0.16]}
          format={f3}
          tickFormat={(v) => v.toFixed(2)}
          axisLabel="Expected calibration error"
        />
      </ChartFrame>

      <ChartFrame
        title="Answering fewer questions, more accurately"
        source={medguardAbstention.source}
        note="Split conformal prediction matches the fixed threshold's accuracy while answering 8 more questions in every 100."
        table={{
          head: ["Policy", "Coverage", "Accuracy on answered"],
          rows: medguardAbstention.rows.map((r) => [r.label, `${r.coverage.toFixed(1)}%`, `${r.accuracy.toFixed(1)}%`]),
        }}
      >
        <DotPlot
          rows={medguardAbstention.rows.map((r) => ({
            label: `${r.label} (${r.coverage.toFixed(0)}% answered)`,
            value: r.accuracy,
            tone: r.mine ? "mine" : "neutral",
          }))}
          domain={[60, 70]}
          ticks={[60, 65, 70]}
          format={(v) => `${v.toFixed(1)}%`}
          tickFormat={(v) => `${v}%`}
          axisLabel="Accuracy on the questions it answers"
        />
      </ChartFrame>
    </>
  );
}

function Recommender() {
  const rows = recommenderModels.rows;
  return (
    <>
      <h2 className="type-heading text-2xl">Thirteen models, one harness</h2>
      <p className="mt-3 max-w-[44rem]">
        Every model was trained and scored on the same 80/20 split of 276,559 Food.com reviews. The interesting result is
        how small the gaps get: by phase 4 the best hybrid only ties plain matrix factorization.
      </p>

      <ChartFrame
        title="Test RMSE by model, grouped by phase (lower is better)"
        source={recommenderModels.source}
        note="The axis starts at 0.84 so the differences are visible; dots, not bars, because the length from zero would mean nothing here."
        table={{
          head: ["Phase", "Model", "Test RMSE", "NDCG@10"],
          rows: rows.map((r) => [r.phase, r.label, f4(r.rmse), f4(r.ndcg)]),
        }}
      >
        <DotPlot
          rows={rows.map((r) => ({
            label: r.label,
            value: r.rmse,
            group: `Phase ${r.phase}`,
            tone: r.best ? "mine" : "neutral",
          }))}
          domain={[0.84, 1.0]}
          ticks={[0.84, 0.88, 0.92, 0.96, 1.0]}
          format={f4}
          tickFormat={(v) => v.toFixed(2)}
          axisLabel="Test RMSE"
        />
      </ChartFrame>
    </>
  );
}

function Pest() {
  const rows = pestBackbones.rows;
  return (
    <>
      <h2 className="type-heading text-2xl">Backbone choice barely matters here</h2>
      <p className="mt-3 max-w-[44rem]">
        All four backbones were frozen and trained with the same seed, split, head, augmentation, and callbacks. Their
        test accuracy spans 0.55 points, so the practical choice is the smallest, fastest model.
      </p>

      <ChartFrame
        title="Test accuracy by backbone (1,099 test images)"
        source={pestBackbones.source}
        note="The axis covers 86% to 89% to make a half-point spread visible."
        table={{
          head: ["Backbone", "Train", "Validation", "Test", "Test loss"],
          rows: rows.map((r) => [r.label, `${r.train}%`, `${r.val}%`, `${r.test}%`, f4(r.loss)]),
        }}
      >
        <DotPlot
          rows={rows.map((r) => ({ label: r.label, value: r.test, tone: r.label === "DenseNet121" ? "mine" : "neutral" }))}
          domain={[86, 89]}
          ticks={[86, 87, 88, 89]}
          format={(v) => `${v.toFixed(2)}%`}
          tickFormat={(v) => `${v}%`}
          axisLabel="Test accuracy"
        />
      </ChartFrame>

      <h3 className="type-heading mt-10 text-lg">Per-class F1, range across the four backbones</h3>
      <p className="mt-2 max-w-[44rem] text-[0.95rem] text-muted">
        Errors cluster in the same places for every model. Snails are confused with slugs and earthworms, a real
        visual-similarity problem rather than a modelling bug.
      </p>
      <table className="num mt-4 w-full max-w-[28rem] border-collapse text-left text-[0.95rem]">
        <thead>
          <tr>
            <th className="border-b border-plate py-1.5 pr-4 font-semibold">Class</th>
            <th className="border-b border-plate py-1.5 font-semibold">F1 range</th>
          </tr>
        </thead>
        <tbody>
          {pestBackbones.classes.map((c) => (
            <tr key={c.label}>
              <td className="border-b border-plate py-1.5 pr-4">{c.label}</td>
              <td className="border-b border-plate py-1.5">{c.f1}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
