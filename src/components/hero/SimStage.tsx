"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Strategy } from "@/lib/sim/bot";
import { Simulation, type SimState } from "@/lib/sim/simulation";
import ShipFallback2D from "./ShipFallback2D";
import { useThemeColors } from "./useThemeColors";

const ShipScene = dynamic(() => import("./ShipScene"), { ssr: false });

const SIZE = 25;
const Q = 0.3;
const TICK_MS = 190;
const PAUSE_AFTER_END_MS = 2600;

const strategies: { id: Strategy; label: string }[] = [
  { id: "risk-aware", label: "Smart bot" },
  { id: "plan-once", label: "Simple bot" },
];

const hasWebGL = () => {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
};

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const statusText = (s: SimState) => {
  switch (s.status) {
    case "escaped":
      return `Escaped in ${s.steps} steps.`;
    case "caught":
      return `Caught by the fire after ${s.steps} steps.`;
    case "button-lost":
      return `The fire reached the button first.`;
    default:
      return `Step ${s.steps}. Click a floor tile to start a fire.`;
  }
};

type Tally = Record<Strategy, { runs: number; escaped: number }>;

/** Compact fire-escape demo from the Rutgers Intro to AI project. */
export default function SimStage() {
  const colors = useThemeColors();
  const [baseSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const run = useRef(0);
  const [strategy, setStrategy] = useState<Strategy>("risk-aware");
  const [sim, setSim] = useState(() => new Simulation({ size: SIZE, q: Q, strategy: "risk-aware", seed: baseSeed }));
  const [state, setState] = useState<SimState>(() => sim.state);
  // Reduced motion starts paused, so nothing moves until the visitor asks.
  const [playing, setPlaying] = useState(() => !prefersReducedMotion());
  const [webgl] = useState(hasWebGL);
  const [visible, setVisible] = useState(true);
  const [tally, setTally] = useState<Tally>({
    "risk-aware": { runs: 0, escaped: 0 },
    "plan-once": { runs: 0, escaped: 0 },
  });
  const stageRef = useRef<HTMLDivElement>(null);

  const newShip = useCallback(
    (nextStrategy: Strategy) => {
      run.current += 1;
      const next = new Simulation({ size: SIZE, q: Q, strategy: nextStrategy, seed: baseSeed + run.current });
      setSim(next);
      setState(next.state);
    },
    [baseSeed],
  );

  // Stop ticking while the demo is off screen or the tab is hidden.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let onScreen = true;
    const update = () => setVisible(onScreen && document.visibilityState === "visible");
    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        update();
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", update);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  const running = state.status === "running";

  useEffect(() => {
    if (!playing || !visible || !running) return;
    const id = window.setInterval(() => {
      const next = sim.tick();
      setState(next);
      if (next.status !== "running") {
        setTally((t) => ({
          ...t,
          [sim.strategy]: {
            runs: t[sim.strategy].runs + 1,
            escaped: t[sim.strategy].escaped + (next.status === "escaped" ? 1 : 0),
          },
        }));
      }
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [sim, playing, visible, running]);

  // After a run ends, start a fresh ship.
  useEffect(() => {
    if (!playing || !visible || running) return;
    const id = window.setTimeout(() => newShip(strategy), PAUSE_AFTER_END_MS);
    return () => window.clearTimeout(id);
  }, [playing, visible, running, strategy, newShip]);

  const onCellClick = useCallback(
    (cell: number) => {
      if (sim.ignite(cell)) setState(sim.state);
    },
    [sim],
  );

  const chooseStrategy = (s: Strategy) => {
    setStrategy(s);
    newShip(s);
  };

  const rate = (t: { runs: number; escaped: number }) => `${t.escaped}/${t.runs}`;
  const anyRuns = tally["risk-aware"].runs + tally["plan-once"].runs > 0;

  return (
    <figure aria-label="Fire escape simulation" className="rounded-xl bg-deck p-3">
      <div ref={stageRef} className="relative aspect-[16/10] w-full touch-manipulation">
        {colors &&
          (webgl ? (
            <ShipScene state={state} colors={colors} animate={playing && visible} onCellClick={onCellClick} />
          ) : (
            <ShipFallback2D state={state} colors={colors} onCellClick={onCellClick} />
          ))}
      </div>

      <p className="num mt-2 min-h-[1.55em] text-sm font-semibold" aria-live="polite">
        {statusText(state)}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="rounded-full border border-hull px-3 py-1 font-semibold hover:bg-hull hover:text-deck"
        >
          {playing ? "Pause" : "Play"}
        </button>
        <button type="button" onClick={() => newShip(strategy)} className="rounded-full border border-plate px-3 py-1 hover:border-hull">
          New ship
        </button>
        <div role="radiogroup" aria-label="Bot strategy" className="flex rounded-full border border-plate p-0.5">
          {strategies.map((s) => (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={strategy === s.id}
              onClick={() => chooseStrategy(s.id)}
              className={`rounded-full px-3 py-0.5 ${strategy === s.id ? "bg-hull text-deck" : "hover:text-signal-ink"}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <figcaption className="mt-3 text-xs text-muted">
        {strategy === "risk-aware"
          ? "The smart bot replans every step and keeps its distance from the fire."
          : "The simple bot plans the shortest route once and ignores the fire."}
        <span className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-hull">
          <Key color="var(--signal)" round>
            Bot
          </Key>
          <Key color="var(--hull)" round>
            Exit button
          </Key>
          <Key color="var(--ember)">Fire</Key>
          {anyRuns && (
            <span className="num text-muted">
              Escapes: smart {rate(tally["risk-aware"])}, simple {rate(tally["plan-once"])}
            </span>
          )}
        </span>
      </figcaption>
    </figure>
  );
}

function Key({ color, round = false, children }: { color: string; round?: boolean; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1.5">
      <span aria-hidden="true" className={`inline-block h-2.5 w-2.5 ${round ? "rounded-full" : "rounded-[2px]"}`} style={{ background: color }} />
      {children}
    </span>
  );
}
